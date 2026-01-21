# Project Instructions

This repository contains multiple lab projects for Spec-Driven Development:

- `/client` - React TypeScript frontend
- `/server` - Express TypeScript API backend
- `/java-server` - Spring Boot REST API backend

---

## TypeScript/React Guidelines

### Development Guidelines

- Use TypeScript for all code
- Follow React best practices with functional components and hooks
- API routes should follow RESTful conventions
- Use proper error handling in both frontend and backend

### Running the Project

- Frontend: `cd client && npm run dev`
- Backend: `cd server && npm run dev`
- Or run both: `npm run dev` from root

---

## Good Coding Practices

### 1. Component Decomposition

Split components over 250 lines. The threshold is a guideline—some 400-line components are fine if cohesive, some 150-line ones are already tangled. Each component should do one thing. If you're struggling to name it, it's probably doing too much.

### 2. Data-Driven Rendering

- Replace repetitive UI code with data structures and mapping functions
- Use arrays/objects of configuration and `.map()` instead of copy-pasting JSX
- Example:
  ```typescript
  const ITEMS = [
    { id: "a", label: "Alpha" },
    { id: "b", label: "Beta" },
  ];
  {
    ITEMS.map((item) => <Component key={item.id} {...item} />);
  }
  ```

### 3. Constants Extraction

- Move magic strings, numbers, and configuration values to dedicated constants files
- Use `as const` for type safety on constant objects
- Create a `constants.ts` file for shared values

### 4. Custom Hooks for Logic

- Extract stateful logic and side effects into reusable custom hooks
- Separate UI rendering from business logic
- Name hooks with `use` prefix (e.g., `useCalculator`, `useApi`)

### 5. CSS Encapsulation

- Prefer CSS Modules or scoped styling over global CSS
- Co-locate styles with their components
- Avoid style collisions with unique class names

### 6. Utility Functions

- Extract pure transformation logic into standalone utility functions
- Place utilities in a `utils/` directory
- Keep utility functions pure (no side effects) for easy testing

### 7. Strong Typing (React-Specific)

- Follow the TypeScript Style Guide in `docs/tsstyle/06-type-system.md` for general typing rules
- For React components, type props with explicit interfaces
- Use discriminated unions for component state machines
- Prefer `ComponentProps<typeof X>` for extending native element props

### 8. Error Boundaries

- Wrap feature areas in error boundaries to prevent cascading failures
- Provide meaningful fallback UI for error states
- Log errors appropriately for debugging

### 9. Performance Optimisation

- Use `useMemo` for expensive computations
- Use `useCallback` for functions passed as props
- Use `React.memo` for components that render often with same props
- Avoid unnecessary re-renders by keeping state close to where it's used

### 10. Testing Strategy

| Test Type                | Purpose                      | When to Use                         |
| ------------------------ | ---------------------------- | ----------------------------------- |
| **Unit Tests**           | Verify pure logic            | Utilities, reducers, pure functions |
| **Integration Tests**    | Verify component behaviour   | User interactions, data flow        |
| **Snapshot Tests**       | Detect unintended UI changes | Stable UI components                |
| **Property-Based Tests** | Find edge cases              | Mathematical operations, parsers    |

### SOLID Principles for React

| Principle                 | Application                           |
| ------------------------- | ------------------------------------- |
| **Single Responsibility** | One component = one purpose           |
| **Open/Closed**           | Extend via props, not modification    |
| **Liskov Substitution**   | Consistent prop interfaces            |
| **Interface Segregation** | Small, focused prop types             |
| **Dependency Inversion**  | Inject dependencies via props/context |

---

## Java/Spring Boot Guidelines

When working in the `/java-server` directory, follow these guidelines.

### Project Structure

```
java-server/
├── src/main/java/com/sddlabs/<feature>/
│   ├── controller/      # REST controllers
│   ├── service/         # Business logic
│   ├── model/           # DTOs and entities
│   └── exception/       # Custom exceptions
├── src/test/java/
└── pom.xml
```

### Running the Project

```bash
cd java-server
./mvnw spring-boot:run
```

### Development Guidelines

- Use Java 17+ features (records, sealed classes)
- Follow the Java Style Guide in `docs/javastyle/style-guide.md`
- Use constructor injection for dependencies (not field injection)
- Return `ResponseEntity<>` for explicit HTTP status codes

### Code Organisation

1. **Controller Layer** - HTTP handling only, no business logic
2. **Service Layer** - Business logic, validation, calculations
3. **Model Layer** - DTOs using Java records for immutability

### DTOs (Data Transfer Objects)

Use Java records for request/response objects:

```java
public record CalculationRequest(
    @NotNull Double firstOperand,
    @NotNull Double secondOperand,
    @NotBlank String operator
) {}

public record CalculationResult(
    double result,
    String expression,
    boolean hasError,
    String errorMessage
) {}
```

### Exception Handling

Use `@RestControllerAdvice` for global exception handling:

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ArithmeticException.class)
    public ResponseEntity<ErrorResponse> handleArithmeticException(ArithmeticException ex) {
        return ResponseEntity.badRequest()
            .body(new ErrorResponse("CALCULATION_ERROR", ex.getMessage()));
    }
}
```

### Testing Strategy

| Test Type         | Framework         | Purpose                                        |
| ----------------- | ----------------- | ---------------------------------------------- |
| Unit Tests        | JUnit 5 + Mockito | Service layer logic                            |
| Integration Tests | @SpringBootTest   | Full request/response with real Spring context |
| Controller Tests  | @WebMvcTest       | HTTP layer only, mocked services               |
| Property-Based    | jqwik             | Edge cases in calculations                     |

### Test Structure (Arrange-Act-Assert)

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

### SOLID Principles for Spring Boot

| Principle                 | Application                             |
| ------------------------- | --------------------------------------- |
| **Single Responsibility** | One service = one domain                |
| **Open/Closed**           | Extend via interfaces, not modification |
| **Liskov Substitution**   | Consistent interface implementations    |
| **Interface Segregation** | Small, focused interfaces               |
| **Dependency Inversion**  | Inject interfaces, not implementations  |
