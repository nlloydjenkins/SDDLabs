# Calculator REST API — Java/Spring Boot Requirements

**Version:** 2.0  
**Status:** Active  
**Framework:** Spring Boot 3.x  
**Java Version:** 17+  
**Port:** 8080

---

## 1. Scope

This document defines **Java/Spring Boot-specific** technical requirements.

**For functional requirements, see:** [../calculator-requirements.md](../calculator-requirements.md)

- Arithmetic operations and behaviour
- Edge cases and error messages
- Accessibility (WCAG 2.1 AAA) for embedded UI
- Security and performance targets

---

## 2. Project Structure

```
java-server/
├── src/main/java/com/sddlabs/
│   ├── Application.java
│   └── calculator/
│       ├── controller/
│       │   └── CalculatorController.java
│       ├── service/
│       │   ├── CalculatorService.java          # Interface
│       │   └── CalculatorServiceImpl.java      # Implementation
│       ├── model/
│       │   ├── CalculationRequest.java         # Request DTO (record)
│       │   ├── CalculationResult.java          # Response DTO (record)
│       │   └── ErrorResponse.java              # Error DTO (record)
│       └── exception/
│           ├── CalculationException.java       # Domain exception
│           └── GlobalExceptionHandler.java     # @RestControllerAdvice
├── src/main/resources/
│   ├── application.yml
│   └── static/
│       ├── index.html
│       ├── css/
│       │   └── calculator.css
│       └── js/
│           └── calculator.js
├── src/test/java/com/sddlabs/calculator/
│   ├── controller/
│   │   └── CalculatorControllerTest.java       # @WebMvcTest
│   ├── service/
│   │   └── CalculatorServiceTest.java          # Unit tests
│   └── integration/
│       └── CalculatorIntegrationTest.java      # @SpringBootTest
└── pom.xml
```

---

## 3. API Contract

### 3.1 Calculate Endpoint

**Endpoint:** `POST /api/calculator/calculate`

**Request:**

```json
{
  "firstOperand": 5.0,
  "secondOperand": 3.0,
  "operator": "+"
}
```

**Success Response (HTTP 200):**

```json
{
  "result": 8.0,
  "expression": "5.0 + 3.0",
  "hasError": false,
  "errorMessage": null
}
```

**Calculation Error Response (HTTP 200):**

```json
{
  "result": 0.0,
  "expression": "5.0 / 0.0",
  "hasError": true,
  "errorMessage": "Cannot divide by zero"
}
```

**Validation Error Response (HTTP 400):**

```json
{
  "error": "Validation failed",
  "details": [{ "field": "operator", "message": "Invalid operator: ^" }]
}
```

### 3.2 Health Endpoint

**Endpoint:** `GET /actuator/health`

**Response:**

```json
{
  "status": "UP"
}
```

---

## 4. DTOs (Java Records)

### 4.1 Request Record

```java
public record CalculationRequest(
    @NotNull(message = "firstOperand is required")
    Double firstOperand,

    @NotNull(message = "secondOperand is required")
    Double secondOperand,

    @NotBlank(message = "operator is required")
    @Pattern(regexp = "[+\\-*/]", message = "Invalid operator: ${validatedValue}")
    String operator
) {}
```

### 4.2 Response Record

```java
public record CalculationResult(
    double result,
    String expression,
    boolean hasError,
    String errorMessage
) {
    public static CalculationResult success(double result, String expression) {
        return new CalculationResult(result, expression, false, null);
    }

    public static CalculationResult error(String expression, String errorMessage) {
        return new CalculationResult(0.0, expression, true, errorMessage);
    }
}
```

### 4.3 Error Response Record

```java
public record ErrorResponse(
    String error,
    List<FieldError> details
) {
    public record FieldError(String field, String message) {}
}
```

---

## 5. Controller Pattern

```java
@RestController
@RequestMapping("/api/calculator")
public class CalculatorController {

    private final CalculatorService calculatorService;

    // Constructor injection (no @Autowired)
    public CalculatorController(CalculatorService calculatorService) {
        this.calculatorService = calculatorService;
    }

    @PostMapping("/calculate")
    public ResponseEntity<CalculationResult> calculate(
            @Valid @RequestBody CalculationRequest request) {
        CalculationResult result = calculatorService.calculate(request);
        return ResponseEntity.ok(result);
    }
}
```

---

## 6. Service Pattern

### 6.1 Interface

```java
public interface CalculatorService {
    CalculationResult calculate(CalculationRequest request);
}
```

### 6.2 Implementation

```java
@Service
public class CalculatorServiceImpl implements CalculatorService {

    @Override
    public CalculationResult calculate(CalculationRequest request) {
        double a = request.firstOperand();
        double b = request.secondOperand();
        String op = request.operator();
        String expression = formatExpression(a, b, op);

        return switch (op) {
            case "+" -> CalculationResult.success(a + b, expression);
            case "-" -> CalculationResult.success(a - b, expression);
            case "*" -> CalculationResult.success(a * b, expression);
            case "/" -> {
                if (b == 0) {
                    yield CalculationResult.error(expression, "Cannot divide by zero");
                }
                yield CalculationResult.success(a / b, expression);
            }
            default -> CalculationResult.error(expression, "Invalid operator: " + op);
        };
    }

    private String formatExpression(double a, double b, String op) {
        return String.format("%.1f %s %.1f", a, op, b);
    }
}
```

---

## 7. Exception Handling

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex) {

        List<ErrorResponse.FieldError> details = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(e -> new ErrorResponse.FieldError(e.getField(), e.getDefaultMessage()))
            .toList();

        return ResponseEntity.badRequest()
            .body(new ErrorResponse("Validation failed", details));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleParseException(
            HttpMessageNotReadableException ex) {
        return ResponseEntity.badRequest()
            .body(new ErrorResponse("Invalid JSON", List.of()));
    }
}
```

---

## 8. Configuration

### 8.1 application.yml

```yaml
server:
  port: 8080

spring:
  application:
    name: sddlabs-calculator

management:
  endpoints:
    web:
      exposure:
        include: health,info
  endpoint:
    health:
      show-details: never
```

### 8.2 CORS Configuration (Optional)

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:3000", "http://localhost:5173")
            .allowedMethods("GET", "POST");
    }
}
```

---

## 9. Testing Requirements

### 9.1 Unit Tests (Service Layer)

```java
class CalculatorServiceTest {

    private CalculatorService service = new CalculatorServiceImpl();

    @Test
    void calculate_addition_returnsCorrectSum() {
        // Arrange
        var request = new CalculationRequest(5.0, 3.0, "+");

        // Act
        var result = service.calculate(request);

        // Assert
        assertThat(result.result()).isEqualTo(8.0);
        assertThat(result.hasError()).isFalse();
    }

    @Test
    void calculate_divisionByZero_returnsError() {
        var request = new CalculationRequest(5.0, 0.0, "/");

        var result = service.calculate(request);

        assertThat(result.hasError()).isTrue();
        assertThat(result.errorMessage()).isEqualTo("Cannot divide by zero");
    }

    @Test
    void calculate_floatingPointPrecision_handledCorrectly() {
        var request = new CalculationRequest(0.1, 0.2, "+");

        var result = service.calculate(request);

        assertThat(result.result()).isEqualTo(0.3);
    }
}
```

### 9.2 Controller Tests (@WebMvcTest)

```java
@WebMvcTest(CalculatorController.class)
class CalculatorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CalculatorService calculatorService;

    @Test
    void calculate_validRequest_returns200() throws Exception {
        when(calculatorService.calculate(any()))
            .thenReturn(CalculationResult.success(8.0, "5.0 + 3.0"));

        mockMvc.perform(post("/api/calculator/calculate")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"firstOperand": 5.0, "secondOperand": 3.0, "operator": "+"}
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.result").value(8.0))
            .andExpect(jsonPath("$.hasError").value(false));
    }

    @Test
    void calculate_missingOperator_returns400() throws Exception {
        mockMvc.perform(post("/api/calculator/calculate")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"firstOperand": 5.0, "secondOperand": 3.0}
                    """))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value("Validation failed"));
    }
}
```

### 9.3 Integration Tests (@SpringBootTest)

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class CalculatorIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void calculate_fullStack_returnsCorrectResult() {
        var request = new CalculationRequest(10.0, 5.0, "-");

        var response = restTemplate.postForEntity(
            "/api/calculator/calculate",
            request,
            CalculationResult.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().result()).isEqualTo(5.0);
    }
}
```

### 9.4 Coverage Target

- Service layer: ≥ 90%
- Controller layer: ≥ 80%
- All edge cases from shared requirements tested

---

## 10. Static Frontend

### 10.1 Location

Serve from `src/main/resources/static/`:

- `index.html` — Calculator UI
- `css/calculator.css` — Styles
- `js/calculator.js` — Frontend logic

### 10.2 Technology

- Vanilla HTML5, CSS3, JavaScript
- No build tools required
- Fetches from `/api/calculator/calculate`

### 10.3 Accessibility

See [../accessibility.md](../accessibility.md) for full requirements.

- All buttons have `aria-label`
- Results announced via `aria-live="polite"`
- Errors announced via `aria-live="assertive"`
- Keyboard navigation supported

---

## 11. Example curl Commands

```bash
# Addition
curl -X POST http://localhost:8080/api/calculator/calculate \
  -H "Content-Type: application/json" \
  -d '{"firstOperand": 5, "secondOperand": 3, "operator": "+"}'

# Division by zero
curl -X POST http://localhost:8080/api/calculator/calculate \
  -H "Content-Type: application/json" \
  -d '{"firstOperand": 5, "secondOperand": 0, "operator": "/"}'

# Invalid operator (returns 400)
curl -X POST http://localhost:8080/api/calculator/calculate \
  -H "Content-Type: application/json" \
  -d '{"firstOperand": 5, "secondOperand": 3, "operator": "^"}'
```

---

## 12. Acceptance Criteria

### Technical

- [ ] Uses Java records for all DTOs
- [ ] Constructor injection (no field `@Autowired`)
- [ ] Service layer behind interface
- [ ] Global exception handler with `@RestControllerAdvice`
- [ ] Validation annotations on request DTOs
- [ ] Returns `ResponseEntity<>` from controller

### Testing

- [ ] Unit tests for service layer
- [ ] Controller tests with `@WebMvcTest`
- [ ] At least one `@SpringBootTest` integration test
- [ ] All edge cases from shared requirements tested
- [ ] Tests follow Arrange-Act-Assert pattern

### Code Quality

- [ ] Follows `docs/javastyle/style-guide.md`
- [ ] Javadoc on public API methods
- [ ] No warnings from compiler
- [ ] Static UI accessible at http://localhost:8080/
