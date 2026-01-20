# Calculator REST API — Requirements Document

**Version:** 1.0  
**Status:** Draft  
**Target Platform:** Spring Boot REST API  
**Port:** 8080

---

## 1. Purpose & Scope

This document defines the requirements for a REST API that performs arithmetic calculations. The API provides a stateless calculation service that can be consumed by any client (web, mobile, CLI).

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
|----------|----------------|--------|
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

## 5. Technical Requirements

### 5.1 Project Structure

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
├── src/test/java/com/sddlabs/calculator/
│   ├── controller/
│   │   └── CalculatorControllerTest.java
│   └── service/
│       └── CalculatorServiceTest.java
└── pom.xml
```

### 5.2 Technology Stack

- Java 17+
- Spring Boot 3.x
- Spring Web (REST)
- Spring Validation
- JUnit 5
- AssertJ
- Mockito

### 5.3 Coding Standards

- Follow `docs/javastyle/style-guide.md`
- Use Java records for DTOs
- Constructor injection for dependencies
- Comprehensive Javadoc on public APIs

---

## 6. Testing Requirements

### 6.1 Unit Tests

Test the service layer in isolation:

- Addition of positive numbers
- Addition of negative numbers
- Subtraction operations
- Multiplication operations
- Division operations
- Division by zero handling
- Floating-point precision handling

### 6.2 Integration Tests

Test the full HTTP request/response cycle:

- Valid calculation requests return 200
- Invalid operator returns 400
- Missing fields return 400
- Division by zero returns 200 with error in body

### 6.3 Test Coverage

- Minimum 80% coverage on service layer
- All edge cases documented and tested

---

## 7. Example Requests

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

## 8. Acceptance Criteria

- [ ] All four arithmetic operations work correctly
- [ ] Division by zero returns error response, not exception
- [ ] Invalid requests return 400 with details
- [ ] Health endpoint returns UP
- [ ] Unit tests pass with >80% coverage
- [ ] Integration tests verify HTTP layer
- [ ] Response time < 50ms
