# Calculator Application — Requirements Document

**Version:** 1.1  
**Status:** Draft  
**Target Platform:** Spring Boot (REST API + Web UI)  
**Port:** 8080  
**Reference UI:** iOS-style calculator (dark theme, circular buttons, right-aligned display)

---

## 1. Purpose & Scope

This document defines the requirements for a calculator application with both a REST API backend and a web-based frontend UI. The application provides:

- A stateless REST API for arithmetic calculations
- A web UI matching the iOS calculator design (dark theme, circular buttons)

---

## 2. API Endpoints

### 2.1 Calculate

**Endpoint:** `POST /api/calculator/calculate`

**Request Body:**

```json
{
  "firstOperand": 5.0,
  "secondOperand": 3.0,
  "operator": "+"
}
```

**Response Body (Success):**

```json
{
  "result": 8.0,
  "expression": "5.0 + 3.0",
  "hasError": false,
  "errorMessage": null
}
```

**Response Body (Error):**

```json
{
  "result": 0.0,
  "expression": "5.0 / 0.0",
  "hasError": true,
  "errorMessage": "Division by zero"
}
```

### 2.2 Health Check

**Endpoint:** `GET /actuator/health`

**Response:**

```json
{
  "status": "UP"
}
```

---

## 3. Functional Requirements

### 3.1 Supported Operations

| Operator | Operation      | Symbol |
| -------- | -------------- | ------ |
| `+`      | Addition       | Plus   |
| `-`      | Subtraction    | Minus  |
| `*`      | Multiplication | Star   |
| `/`      | Division       | Slash  |

### 3.2 Calculation Behaviour

- All operations use double-precision floating-point arithmetic
- Division by zero returns an error response (not an exception)
- Results should handle floating-point precision (e.g., `0.1 + 0.2 = 0.3`, not `0.30000000000000004`)
- Very large or small numbers should use scientific notation when appropriate

### 3.3 Input Validation

- `firstOperand` - Required, must be a valid number
- `secondOperand` - Required, must be a valid number
- `operator` - Required, must be one of: `+`, `-`, `*`, `/`

Invalid requests should return HTTP 400 with validation error details.

---

## 4. Non-Functional Requirements

### 4.1 Performance

- Response time < 50ms for calculation requests
- No external dependencies for core calculation
- Stateless design for horizontal scalability

### 4.2 Security

- Input validation on all request parameters
- No arbitrary code execution
- No sensitive data logging
- CORS configuration for web clients (configurable)

### 4.3 Reliability

- Graceful error handling (no stack traces in responses)
- Consistent error response format
- Application health endpoint for monitoring

---

## 5. Frontend UI Requirements

### 5.1 Visual Design

- Dark-themed user interface
- High-contrast colour palette
- Circular buttons with consistent sizing
- Distinct visual separation between:
  - Numeric keys (dark grey)
  - Operators (orange/highlight colour)
  - Function keys (AC, %, ±) (light grey)
- Numbers and results displayed in white on black background
- Subtle shadows or depth effects to indicate clickable elements

### 5.2 Layout

- Portrait-first layout optimised for mobile and desktop
- Right-aligned calculation display
- Large result text, scalable for long numbers
- Fixed grid layout for buttons (4 columns)
- Consistent spacing and alignment across all rows
- Responsive design that works on desktop and mobile browsers

### 5.3 Calculator Controls

| Button | Function       | Description                       |
| ------ | -------------- | --------------------------------- |
| `0-9`  | Numeric input  | Enter digits                      |
| `.`    | Decimal point  | Add decimal to current number     |
| `+`    | Addition       | Add two numbers                   |
| `-`    | Subtraction    | Subtract second from first        |
| `×`    | Multiplication | Multiply two numbers              |
| `÷`    | Division       | Divide first by second            |
| `=`    | Equals         | Calculate and display result      |
| `AC`   | All Clear      | Reset calculator to initial state |
| `±`    | Sign toggle    | Toggle positive/negative          |
| `%`    | Percentage     | Convert to percentage             |

### 5.4 Display Behaviour

- Current expression shown above the main result
- Result updates after pressing equals
- Maximum digit length enforced with scaling
- Error state displayed for division by zero
- Clear feedback when input is reset

### 5.5 Accessibility

- All buttons have descriptive accessibility labels
- Keyboard support for desktop users
- Minimum touch target size of 44x44px
- Visible focus indicators
- High contrast ratios (WCAG 2.1 AA compliant)

### 5.6 Technology Stack (Frontend)

- HTML5, CSS3, JavaScript (vanilla or framework)
- Served as static resources from Spring Boot
- No additional build tools required
- Responsive CSS for mobile/desktop

---

## 6. Technical Requirements

### 6.1 Project Structure

```
java-server/
├── src/main/java/com/sddlabs/
│   ├── Application.java
│   └── calculator/
│       ├── controller/
│       │   └── CalculatorController.java
│       ├── service/
│       │   └── CalculatorService.java
│       ├── model/
│       │   ├── CalculationRequest.java
│       │   └── CalculationResult.java
│       └── exception/
│           └── GlobalExceptionHandler.java
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
│   │   └── CalculatorControllerTest.java
│   └── service/
│       └── CalculatorServiceTest.java
└── pom.xml
```

### 6.2 Technology Stack

- Java 17+
- Spring Boot 3.x
- Spring Web (REST + Static Resources)
- Spring Validation
- HTML5 / CSS3 / JavaScript (Frontend)
- JUnit 5
- AssertJ
- Mockito

### 6.3 Coding Standards

- Follow `docs/javastyle/style-guide.md`
- Use Java records for DTOs
- Constructor injection for dependencies
- Comprehensive Javadoc on public APIs

---

## 7. Testing Requirements

### 7.1 Unit Tests

Test the service layer in isolation:

- Addition of positive numbers
- Addition of negative numbers
- Subtraction operations
- Multiplication operations
- Division operations
- Division by zero handling
- Floating-point precision handling

### 7.2 Integration Tests

Test the full HTTP request/response cycle:

- Valid calculation requests return 200
- Invalid operator returns 400
- Missing fields return 400
- Division by zero returns 200 with error in body

### 7.3 Test Coverage

- Minimum 80% coverage on service layer
- All edge cases documented and tested

---

## 8. Example Requests

### Addition

```bash
curl -X POST http://localhost:8080/api/calculator/calculate \
  -H "Content-Type: application/json" \
  -d '{"firstOperand": 5, "secondOperand": 3, "operator": "+"}'
```

### Division by Zero

```bash
curl -X POST http://localhost:8080/api/calculator/calculate \
  -H "Content-Type: application/json" \
  -d '{"firstOperand": 5, "secondOperand": 0, "operator": "/"}'
```

---

## 9. Acceptance Criteria

### API Acceptance Criteria

- [ ] All four arithmetic operations work correctly
- [ ] Division by zero returns error response, not exception
- [ ] Invalid requests return 400 with details
- [ ] Health endpoint returns UP
- [ ] Unit tests pass with >80% coverage
- [ ] Integration tests verify HTTP layer
- [ ] Response time < 50ms

### UI Acceptance Criteria

- [ ] Calculator UI accessible at http://localhost:8080/
- [ ] Dark theme with iOS-style design
- [ ] All numeric buttons (0-9) work correctly
- [ ] All operator buttons (+, -, ×, ÷) work correctly
- [ ] Equals button calculates and displays result
- [ ] AC button clears all input
- [ ] Sign toggle (±) works correctly
- [ ] Percentage (%) works correctly
- [ ] Decimal point input works correctly
- [ ] Division by zero displays error state
- [ ] Responsive design works on mobile and desktop
- [ ] Keyboard input supported (desktop)
