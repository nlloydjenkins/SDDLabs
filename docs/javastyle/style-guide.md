# Java Style Guide

This style guide defines conventions for Java code in the SDDLabs project. Based on Google Java Style Guide with project-specific adaptations.

---

## 1. Source File Basics

### 1.1 File Name
- File name matches the top-level class name, plus `.java`
- Example: `CalculatorService.java`

### 1.2 File Encoding
- UTF-8

### 1.3 Special Characters
- Use `\t` for tabs only in string literals
- Use `\\`, `\'`, `\"`, `\n`, `\r`, `\b`, `\f` as needed
- Prefer `\n` over platform-specific line endings

---

## 2. Source File Structure

Order within a source file:

1. License/copyright (if present)
2. Package statement
3. Import statements
4. Exactly one top-level class

### 2.1 Package Statement
```java
package com.sddlabs.calculator;
```

### 2.2 Import Statements
- No wildcard imports (`import java.util.*`)
- Static imports grouped separately
- Order: `java.*`, `javax.*`, third-party, project packages

```java
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.sddlabs.calculator.model.CalculationRequest;
```

---

## 3. Formatting

### 3.1 Braces
- Opening brace on same line
- Closing brace on own line

```java
// Good
if (condition) {
    doSomething();
}

// Bad
if (condition)
{
    doSomething();
}
```

### 3.2 Indentation
- 4 spaces (no tabs)
- Continuation indent: 8 spaces

### 3.3 Line Length
- Maximum 100 characters
- Break before operators

### 3.4 Blank Lines
- One blank line between methods
- One blank line between logical sections within a method
- Two blank lines between class sections (fields, constructors, methods)

---

## 4. Naming

### 4.1 Package Names
- All lowercase, no underscores
- Example: `com.sddlabs.calculator`

### 4.2 Class Names
- UpperCamelCase
- Nouns or noun phrases
- Example: `CalculatorService`, `CalculationResult`

### 4.3 Method Names
- lowerCamelCase
- Verbs or verb phrases
- Example: `calculate()`, `performOperation()`

### 4.4 Constant Names
- UPPER_SNAKE_CASE
- Example: `MAX_DISPLAY_DIGITS`, `DEFAULT_PRECISION`

### 4.5 Variable Names
- lowerCamelCase
- Descriptive, avoid single letters except loops
- Example: `firstOperand`, `currentValue`

### 4.6 Type Parameter Names
- Single capital letter, optionally followed by number
- `T`, `E`, `K`, `V`, `T2`

---

## 5. Spring Boot Conventions

### 5.1 Controller Layer
```java
@RestController
@RequestMapping("/api/calculator")
public class CalculatorController {
    
    private final CalculatorService calculatorService;
    
    public CalculatorController(CalculatorService calculatorService) {
        this.calculatorService = calculatorService;
    }
    
    @PostMapping("/calculate")
    public ResponseEntity<CalculationResult> calculate(
            @Valid @RequestBody CalculationRequest request) {
        return ResponseEntity.ok(calculatorService.calculate(request));
    }
}
```

### 5.2 Service Layer
```java
@Service
public class CalculatorService {
    
    public CalculationResult calculate(CalculationRequest request) {
        // Business logic here
    }
}
```

### 5.3 DTOs (Data Transfer Objects)
- Use Java records for immutable DTOs (Java 17+)

```java
public record CalculationRequest(
    double firstOperand,
    double secondOperand,
    String operator
) {}

public record CalculationResult(
    double result,
    String expression,
    boolean hasError,
    String errorMessage
) {}
```

### 5.4 Validation
- Use Bean Validation annotations

```java
public record CalculationRequest(
    @NotNull Double firstOperand,
    @NotNull Double secondOperand,
    @NotBlank @Pattern(regexp = "[+\\-*/]") String operator
) {}
```

### 5.5 Exception Handling
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ArithmeticException.class)
    public ResponseEntity<ErrorResponse> handleArithmeticException(
            ArithmeticException ex) {
        return ResponseEntity.badRequest()
            .body(new ErrorResponse("CALCULATION_ERROR", ex.getMessage()));
    }
}
```

---

## 6. Testing

### 6.1 Test Class Naming
- `<ClassUnderTest>Test.java`
- Example: `CalculatorServiceTest.java`

### 6.2 Test Method Naming
- Descriptive names using underscores or camelCase
- Format: `methodName_condition_expectedResult` or descriptive sentence

```java
@Test
void calculate_additionOfTwoPositiveNumbers_returnsSum() {
    // ...
}

@Test
void shouldReturnErrorWhenDividingByZero() {
    // ...
}
```

### 6.3 Test Structure (Arrange-Act-Assert)
```java
@Test
void calculate_addition_returnsCorrectSum() {
    // Arrange
    var request = new CalculationRequest(5.0, 3.0, "+");
    
    // Act
    var result = calculatorService.calculate(request);
    
    // Assert
    assertThat(result.result()).isEqualTo(8.0);
    assertThat(result.hasError()).isFalse();
}
```

### 6.4 Testing Frameworks
- JUnit 5 for unit tests
- AssertJ for fluent assertions
- Mockito for mocking
- Spring Boot Test for integration tests

```java
@SpringBootTest
@AutoConfigureMockMvc
class CalculatorControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void calculate_validRequest_returns200() throws Exception {
        mockMvc.perform(post("/api/calculator/calculate")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"firstOperand": 5, "secondOperand": 3, "operator": "+"}
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.result").value(8.0));
    }
}
```

---

## 7. Documentation

### 7.1 Javadoc
- Required for public APIs
- Use `@param`, `@return`, `@throws`

```java
/**
 * Performs arithmetic calculation on two operands.
 *
 * @param request the calculation request containing operands and operator
 * @return the calculation result
 * @throws ArithmeticException if division by zero is attempted
 */
public CalculationResult calculate(CalculationRequest request) {
    // ...
}
```

### 7.2 Inline Comments
- Use sparingly
- Explain "why", not "what"

---

## 8. Dependency Injection

### 8.1 Constructor Injection (Preferred)
```java
@Service
public class CalculatorService {
    
    private final OperationRegistry operationRegistry;
    
    public CalculatorService(OperationRegistry operationRegistry) {
        this.operationRegistry = operationRegistry;
    }
}
```

### 8.2 Avoid Field Injection
```java
// Avoid
@Autowired
private CalculatorService calculatorService;

// Prefer constructor injection
```

---

## 9. Error Handling

### 9.1 Checked vs Unchecked Exceptions
- Use unchecked exceptions for programming errors
- Use checked exceptions sparingly for recoverable conditions

### 9.2 Never Swallow Exceptions
```java
// Bad
try {
    riskyOperation();
} catch (Exception e) {
    // silent failure
}

// Good
try {
    riskyOperation();
} catch (Exception e) {
    log.error("Operation failed", e);
    throw new ServiceException("Operation failed", e);
}
```

---

## 10. Immutability

### 10.1 Prefer Immutable Objects
```java
// Good - using record
public record CalculationResult(double result, boolean hasError) {}

// If using class, make fields final
public final class CalculationResult {
    private final double result;
    private final boolean hasError;
    
    public CalculationResult(double result, boolean hasError) {
        this.result = result;
        this.hasError = hasError;
    }
    
    // getters only, no setters
}
```

### 10.2 Defensive Copies
```java
public List<String> getOperators() {
    return List.copyOf(operators); // return immutable copy
}
```
