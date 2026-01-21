# Spring Boot Best Practices — Java REST API Development

**Version:** 1.0  
**Status:** Active  
**Tech Stack:** Spring Boot 3.x, Java 17+, Maven

---

## 1. Project Structure

### 1.1 Package Organisation

Follow a feature-based or layer-based package structure:

```
src/main/java/com/sddlabs/<feature>/
├── controller/          # REST controllers (@RestController)
├── service/             # Business logic (@Service)
├── repository/          # Data access (@Repository)
├── model/               # DTOs, entities, records
├── exception/           # Custom exceptions and handlers
├── config/              # Configuration classes (@Configuration)
└── util/                # Utility classes
```

### 1.2 Naming Conventions

| Component              | Convention                               | Example                 |
| ---------------------- | ---------------------------------------- | ----------------------- |
| Controller             | `<Feature>Controller`                    | `CalculatorController`  |
| Service Interface      | `<Feature>Service`                       | `CalculatorService`     |
| Service Implementation | `<Feature>ServiceImpl`                   | `CalculatorServiceImpl` |
| Repository             | `<Feature>Repository`                    | `UserRepository`        |
| DTO Request            | `<Feature>Request`                       | `CalculationRequest`    |
| DTO Response           | `<Feature>Response` or `<Feature>Result` | `CalculationResult`     |
| Exception              | `<Feature>Exception`                     | `CalculationException`  |

---

## 2. REST Controller Best Practices

### 2.1 Use `@RestController` and `@RequestMapping`

```java
@RestController
@RequestMapping("/api/v1/calculator")
@Slf4j
public class CalculatorController {

    private final CalculatorService calculatorService;

    public CalculatorController(CalculatorService calculatorService) {
        this.calculatorService = calculatorService;
    }
}
```

### 2.2 API Versioning

Always version your APIs in the URL path:

```java
@RequestMapping("/api/v1/resource")  // Good
@RequestMapping("/resource")          // Bad - no versioning
```

### 2.3 Use Appropriate HTTP Methods

| Operation        | HTTP Method | Annotation                |
| ---------------- | ----------- | ------------------------- |
| Create           | POST        | `@PostMapping`            |
| Read (single)    | GET         | `@GetMapping("/{id}")`    |
| Read (list)      | GET         | `@GetMapping`             |
| Update (full)    | PUT         | `@PutMapping("/{id}")`    |
| Update (partial) | PATCH       | `@PatchMapping("/{id}")`  |
| Delete           | DELETE      | `@DeleteMapping("/{id}")` |

### 2.4 Return `ResponseEntity<>` for Explicit HTTP Status

```java
// Good: Explicit status codes
@PostMapping("/calculate")
public ResponseEntity<CalculationResult> calculate(
        @Valid @RequestBody CalculationRequest request) {
    CalculationResult result = calculatorService.calculate(request);
    return ResponseEntity.ok(result);
}

@PostMapping("/resource")
public ResponseEntity<Resource> create(@Valid @RequestBody CreateRequest request) {
    Resource created = service.create(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
}

@DeleteMapping("/{id}")
public ResponseEntity<Void> delete(@PathVariable Long id) {
    service.delete(id);
    return ResponseEntity.noContent().build();
}

// Bad: Implicit status codes
@PostMapping("/calculate")
public CalculationResult calculate(@RequestBody CalculationRequest request) {
    return calculatorService.calculate(request);
}
```

### 2.5 Controller Should Only Handle HTTP Concerns

```java
// Good: Controller delegates to service
@PostMapping("/calculate")
public ResponseEntity<CalculationResult> calculate(
        @Valid @RequestBody CalculationRequest request) {
    log.info("Received calculation request: {}", request);
    return ResponseEntity.ok(calculatorService.calculate(request));
}

// Bad: Business logic in controller
@PostMapping("/calculate")
public ResponseEntity<CalculationResult> calculate(
        @Valid @RequestBody CalculationRequest request) {
    double result;
    switch (request.operator()) {
        case "+" -> result = request.firstOperand() + request.secondOperand();
        // ... business logic doesn't belong here
    }
}
```

---

## 3. Dependency Injection

### 3.1 Use Constructor Injection (Not Field Injection)

```java
// Good: Constructor injection
@Service
public class CalculatorServiceImpl implements CalculatorService {

    private final OperationValidator validator;
    private final AuditLogger auditLogger;

    public CalculatorServiceImpl(OperationValidator validator, AuditLogger auditLogger) {
        this.validator = validator;
        this.auditLogger = auditLogger;
    }
}

// Bad: Field injection
@Service
public class CalculatorServiceImpl implements CalculatorService {

    @Autowired
    private OperationValidator validator;

    @Autowired
    private AuditLogger auditLogger;
}
```

**Why constructor injection?**

- Makes dependencies explicit
- Enables immutability (`final` fields)
- Easier to test (no reflection needed)
- Fails fast if dependencies are missing

### 3.2 Use Interfaces for Services

```java
// Interface
public interface CalculatorService {
    CalculationResult calculate(CalculationRequest request);
}

// Implementation
@Service
public class CalculatorServiceImpl implements CalculatorService {
    @Override
    public CalculationResult calculate(CalculationRequest request) {
        // implementation
    }
}

// Controller injects interface
@RestController
public class CalculatorController {
    private final CalculatorService calculatorService; // Interface, not impl
}
```

---

## 4. DTOs and Data Transfer

### 4.1 Use Java Records for DTOs

```java
// Request DTO with validation
public record CalculationRequest(
    @NotNull(message = "First operand is required")
    Double firstOperand,

    @NotNull(message = "Second operand is required")
    Double secondOperand,

    @NotBlank(message = "Operator is required")
    @Pattern(regexp = "[+\\-*/]", message = "Operator must be +, -, *, or /")
    String operator
) {}

// Response DTO
public record CalculationResult(
    double result,
    String expression,
    boolean hasError,
    String errorMessage
) {
    // Factory methods for common cases
    public static CalculationResult success(double result, String expression) {
        return new CalculationResult(result, expression, false, null);
    }

    public static CalculationResult error(String message) {
        return new CalculationResult(0, null, true, message);
    }
}
```

### 4.2 Validate Request DTOs

```java
@PostMapping("/calculate")
public ResponseEntity<CalculationResult> calculate(
        @Valid @RequestBody CalculationRequest request) {  // @Valid triggers validation
    return ResponseEntity.ok(calculatorService.calculate(request));
}
```

### 4.3 Standardised Error Response

```java
public record ErrorResponse(
    String code,
    String message,
    LocalDateTime timestamp,
    String path
) {
    public ErrorResponse(String code, String message, String path) {
        this(code, message, LocalDateTime.now(), path);
    }
}
```

---

## 5. Exception Handling

### 5.1 Global Exception Handler

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {

        String message = ex.getBindingResult().getFieldErrors().stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .collect(Collectors.joining(", "));

        log.warn("Validation failed: {}", message);

        return ResponseEntity.badRequest()
            .body(new ErrorResponse("VALIDATION_ERROR", message, request.getRequestURI()));
    }

    @ExceptionHandler(ArithmeticException.class)
    public ResponseEntity<ErrorResponse> handleArithmeticException(
            ArithmeticException ex,
            HttpServletRequest request) {

        log.error("Arithmetic error: {}", ex.getMessage());

        return ResponseEntity.badRequest()
            .body(new ErrorResponse("CALCULATION_ERROR", ex.getMessage(), request.getRequestURI()));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            ResourceNotFoundException ex,
            HttpServletRequest request) {

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse("NOT_FOUND", ex.getMessage(), request.getRequestURI()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex,
            HttpServletRequest request) {

        log.error("Unexpected error", ex);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ErrorResponse("INTERNAL_ERROR", "An unexpected error occurred", request.getRequestURI()));
    }
}
```

### 5.2 Custom Exceptions

```java
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resource, Long id) {
        super(String.format("%s not found with id: %d", resource, id));
    }
}

public class CalculationException extends RuntimeException {
    private final String errorCode;

    public CalculationException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
```

---

## 6. Configuration Management

### 6.1 Use Application Profiles

```properties
# application.properties (common settings)
spring.application.name=calculator-api
server.port=8080

# application-dev.properties
logging.level.com.sddlabs=DEBUG
spring.devtools.restart.enabled=true

# application-prod.properties
logging.level.com.sddlabs=INFO
server.error.include-stacktrace=never
```

### 6.2 Externalise Configuration

```java
@Configuration
@ConfigurationProperties(prefix = "calculator")
public class CalculatorProperties {
    private int maxDigits = 15;
    private int decimalPrecision = 10;

    // getters and setters
}
```

```properties
# application.properties
calculator.max-digits=15
calculator.decimal-precision=10
```

### 6.3 Actuator for Production Readiness

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

```properties
# Expose health and info endpoints
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=when_authorized
```

---

## 7. Logging Best Practices

### 7.1 Use SLF4J with Lombok

```java
@RestController
@Slf4j  // Lombok annotation - creates 'log' field
public class CalculatorController {

    @PostMapping("/calculate")
    public ResponseEntity<CalculationResult> calculate(
            @Valid @RequestBody CalculationRequest request) {

        log.info("Calculating: {} {} {}",
            request.firstOperand(), request.operator(), request.secondOperand());

        CalculationResult result = calculatorService.calculate(request);

        log.debug("Result: {}", result);

        return ResponseEntity.ok(result);
    }
}
```

### 7.2 Logging Levels

| Level | Usage                                    |
| ----- | ---------------------------------------- |
| ERROR | Exceptions, failures requiring attention |
| WARN  | Recoverable issues, deprecation warnings |
| INFO  | Business events, request summaries       |
| DEBUG | Detailed flow, variable values           |
| TRACE | Very detailed debugging                  |

### 7.3 Avoid String Concatenation

```java
// Good: Parameterised logging
log.info("Processing request for user: {}", userId);

// Bad: String concatenation (evaluates even if level disabled)
log.info("Processing request for user: " + userId);
```

---

## 8. API Documentation

### 8.1 OpenAPI/Swagger Integration

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.3.0</version>
</dependency>
```

```java
@Operation(summary = "Perform calculation", description = "Executes arithmetic operation")
@ApiResponses({
    @ApiResponse(responseCode = "200", description = "Calculation successful"),
    @ApiResponse(responseCode = "400", description = "Invalid input")
})
@PostMapping("/calculate")
public ResponseEntity<CalculationResult> calculate(
        @Valid @RequestBody CalculationRequest request) {
    return ResponseEntity.ok(calculatorService.calculate(request));
}
```

Access Swagger UI at: `http://localhost:8080/swagger-ui.html`

---

## 9. Testing Strategy

### 9.1 Test Types

| Test Type   | Annotation        | Purpose          | Speed  |
| ----------- | ----------------- | ---------------- | ------ |
| Unit        | `@Test`           | Service logic    | Fast   |
| Slice       | `@WebMvcTest`     | Controller layer | Medium |
| Integration | `@SpringBootTest` | Full context     | Slow   |

### 9.2 Unit Tests (Service Layer)

```java
@ExtendWith(MockitoExtension.class)
class CalculatorServiceImplTest {

    @Mock
    private AuditLogger auditLogger;

    @InjectMocks
    private CalculatorServiceImpl calculatorService;

    @Test
    void calculate_addition_returnsCorrectSum() {
        // Arrange
        var request = new CalculationRequest(5.0, 3.0, "+");

        // Act
        var result = calculatorService.calculate(request);

        // Assert
        assertThat(result.result()).isEqualTo(8.0);
        assertThat(result.hasError()).isFalse();
        assertThat(result.expression()).isEqualTo("5.0 + 3.0 = 8.0");
    }

    @Test
    void calculate_divisionByZero_returnsError() {
        // Arrange
        var request = new CalculationRequest(5.0, 0.0, "/");

        // Act
        var result = calculatorService.calculate(request);

        // Assert
        assertThat(result.hasError()).isTrue();
        assertThat(result.errorMessage()).contains("zero");
    }
}
```

### 9.3 Controller Tests (Web Layer)

```java
@WebMvcTest(CalculatorController.class)
class CalculatorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CalculatorService calculatorService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void calculate_validRequest_returnsOk() throws Exception {
        // Arrange
        var request = new CalculationRequest(5.0, 3.0, "+");
        var result = CalculationResult.success(8.0, "5.0 + 3.0 = 8.0");

        when(calculatorService.calculate(any())).thenReturn(result);

        // Act & Assert
        mockMvc.perform(post("/api/calculate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.result").value(8.0))
            .andExpect(jsonPath("$.hasError").value(false));
    }

    @Test
    void calculate_invalidRequest_returnsBadRequest() throws Exception {
        // Arrange
        var request = new CalculationRequest(null, 3.0, "+");

        // Act & Assert
        mockMvc.perform(post("/api/calculate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }
}
```

### 9.4 Integration Tests

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class CalculatorIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void calculate_fullIntegration_returnsExpectedResult() {
        // Arrange
        var request = new CalculationRequest(10.0, 5.0, "+");

        // Act
        var response = restTemplate.postForEntity(
            "/api/calculate",
            request,
            CalculationResult.class
        );

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().result()).isEqualTo(15.0);
    }
}
```

---

## 10. SOLID Principles for Spring Boot

| Principle                 | Application                                 |
| ------------------------- | ------------------------------------------- |
| **Single Responsibility** | One controller/service per domain           |
| **Open/Closed**           | Extend via interfaces, use strategy pattern |
| **Liskov Substitution**   | Service implementations are interchangeable |
| **Interface Segregation** | Small, focused interfaces                   |
| **Dependency Inversion**  | Inject interfaces, not implementations      |

---

## 11. Checklist for Code Review

### Controller Layer

- [ ] Uses `@RestController` and `@RequestMapping`
- [ ] API path includes version (`/api/v1/...`)
- [ ] Returns `ResponseEntity<>` with explicit status
- [ ] Uses `@Valid` for request body validation
- [ ] No business logic in controller
- [ ] Appropriate logging

### Service Layer

- [ ] Uses constructor injection
- [ ] Implements interface
- [ ] Contains all business logic
- [ ] Throws appropriate exceptions
- [ ] Has unit tests

### DTOs

- [ ] Uses Java records
- [ ] Has validation annotations
- [ ] Immutable

### Exception Handling

- [ ] Global exception handler exists
- [ ] Custom exceptions for domain errors
- [ ] Standardised error response format

### Testing

- [ ] Unit tests for services
- [ ] Controller tests with `@WebMvcTest`
- [ ] Integration tests with `@SpringBootTest`
- [ ] Tests follow AAA pattern

### Documentation

- [ ] OpenAPI/Swagger configured
- [ ] Endpoints documented with `@Operation`

---

## 12. References

- [Spring Boot Best Practices (arsy786)](https://github.com/arsy786/springboot-best-practices)
- [Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Baeldung Spring Tutorials](https://www.baeldung.com/spring-tutorial)
- [Spring Boot Actuator](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html)
