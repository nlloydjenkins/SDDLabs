# Calculator — Shared Requirements

**Version:** 2.0  
**Status:** Active  
**Applies to:** React (TypeScript) and Java (Spring Boot) implementations

---

## 1. Purpose & Scope

This document defines the **shared functional requirements** for all calculator implementations. Platform-specific requirements (UI framework, API structure) are defined in:

- **React/TypeScript**: [calcreqs/reqs.md](calcreqs/reqs.md)
- **Java/Spring Boot**: [java-calcreqs/reqs.md](java-calcreqs/reqs.md)

---

## 2. Core Arithmetic Operations

### 2.1 Supported Operations

| Operator       | Symbol     | Operation |
| -------------- | ---------- | --------- |
| Addition       | `+`        | a + b     |
| Subtraction    | `-` or `−` | a - b     |
| Multiplication | `*` or `×` | a × b     |
| Division       | `/` or `÷` | a ÷ b     |

### 2.2 Calculation Behaviour

- **Immediate execution model**: Standard calculator behaviour
- **Operator chaining**: Supported (e.g., `2 + 3 × 4`)
- **Double-precision**: Use floating-point arithmetic
- **Precision handling**: No visible floating-point artefacts
  - `0.1 + 0.2` must display `0.3`, not `0.30000000000000004`
- **Scientific notation**: Used only for very large/small numbers

### 2.3 Additional Functions

| Function    | Symbol | Behaviour                                   |
| ----------- | ------ | ------------------------------------------- |
| Clear All   | `AC`   | Reset calculator to initial state           |
| Sign Toggle | `±`    | Toggle positive/negative on current operand |
| Percentage  | `%`    | Convert current value to percentage         |
| Decimal     | `.`    | Add decimal point to current number         |

---

## 3. Edge Cases & Error Handling

### 3.1 Division by Zero

| Condition           | Behaviour     | Error Message               |
| ------------------- | ------------- | --------------------------- |
| `x ÷ 0` where x ≠ 0 | Display error | **"Cannot divide by zero"** |
| `0 ÷ 0`             | Display error | **"Cannot divide by zero"** |

**Requirements:**

- Error must be displayed clearly to user
- Error must be announced to screen readers (ARIA live region)
- Error state cleared by pressing `AC`
- No application crash or exception exposed

### 3.2 Numeric Overflow

| Condition               | Behaviour                            | Error Message          |
| ----------------------- | ------------------------------------ | ---------------------- |
| Result > MAX_SAFE_VALUE | Display error or scientific notation | **"Number too large"** |
| Result < MIN_SAFE_VALUE | Display error or scientific notation | **"Number too small"** |

### 3.3 Invalid Input

| Condition               | Behaviour                    | Error Message               |
| ----------------------- | ---------------------------- | --------------------------- |
| Multiple decimal points | Ignore second decimal        | (No message, just ignore)   |
| Leading zeros           | Strip from display           | (No message, auto-format)   |
| Empty operand on `=`    | Use 0 or repeat last operand | (No error)                  |
| Unknown operator (API)  | Return validation error      | **"Invalid operator: [x]"** |
| Missing field (API)     | Return validation error      | **"[field] is required"**   |

### 3.4 Precision Edge Cases

| Input                     | Expected Output              | Notes                     |
| ------------------------- | ---------------------------- | ------------------------- |
| `0.1 + 0.2`               | `0.3`                        | Not `0.30000000000000004` |
| `1 ÷ 3`                   | `0.333...`                   | Reasonable decimal places |
| `9999999999 × 9999999999` | Scientific notation or error | Handle gracefully         |

### 3.5 Operator Edge Cases

| Input Sequence | Behaviour                                   |
| -------------- | ------------------------------------------- |
| `5 + + 3`      | Last operator wins: `5 + 3 = 8`             |
| `5 + - 3`      | Last operator wins: `5 - 3 = 2`             |
| `= = =`        | Repeat last operation or no-op              |
| `5 +` then `=` | Either `5 + 5` or `5 + 0` (document choice) |

---

## 4. Error Message Reference

### 4.1 Standard Error Messages

All implementations **must** use these exact error messages for consistency:

| Error Code       | Message                  | When Displayed                    |
| ---------------- | ------------------------ | --------------------------------- |
| `ERR_DIV_ZERO`   | "Cannot divide by zero"  | Division by zero attempted        |
| `ERR_OVERFLOW`   | "Number too large"       | Result exceeds display capacity   |
| `ERR_UNDERFLOW`  | "Number too small"       | Result too small to display       |
| `ERR_INVALID_OP` | "Invalid operator: [op]" | Unknown operator (API only)       |
| `ERR_MISSING`    | "[field] is required"    | Missing required field (API only) |
| `ERR_GENERIC`    | "Calculation error"      | Unexpected calculation failure    |

### 4.2 Error Display Requirements

**UI Requirements:**

- Error text displayed in red or warning colour
- Error does not replace last valid result until acknowledged
- Error state indicated by visual change (not colour alone)
- Error cleared by `AC` or new valid input

**API Requirements:**

- HTTP 200 with error in response body (for calculation errors)
- HTTP 400 for validation errors
- Consistent error response format:

```json
{
  "result": 0,
  "expression": "5 / 0",
  "hasError": true,
  "errorMessage": "Cannot divide by zero"
}
```

### 4.3 Accessibility for Errors

- Error message announced via `aria-live="assertive"`
- Error state communicated via `role="alert"`
- Error not conveyed by colour alone
- Focus moved to error or error context

---

## 5. Display Behaviour

### 5.1 Number Display

| Scenario          | Display Format                         |
| ----------------- | -------------------------------------- |
| Integer result    | No decimal point: `42`                 |
| Decimal result    | Minimal decimals: `3.14` not `3.14000` |
| Long number       | Scale font or truncate with `...`      |
| Very large number | Scientific notation: `1.23e+15`        |
| Very small number | Scientific notation: `1.23e-10`        |
| Negative number   | Prefix with minus: `-42`               |

### 5.2 Expression Display

- Show current expression above result (e.g., `8 × 2` above `16`)
- Expression cleared after `=` is pressed
- Expression shows running calculation during input

### 5.3 Digit Limits

| Element        | Limit | Overflow Behaviour                |
| -------------- | ----- | --------------------------------- |
| Input digits   | 15    | Ignore additional input           |
| Display digits | 12    | Scale font or scientific notation |
| Decimal places | 10    | Round to fit                      |

---

## 6. Security Requirements

### 6.1 Input Validation

- Validate all inputs before processing
- Sanitise inputs to prevent injection (web context)
- No arbitrary code execution
- Reject malformed requests with clear errors

### 6.2 Error Exposure

- Never expose stack traces to users
- Log errors server-side with correlation IDs
- Return generic messages for unexpected errors
- No sensitive system information in responses

### 6.3 Data Handling

- No personal data collected
- No persistent storage of calculations
- No analytics without consent
- Stateless calculation (no session required)

---

## 7. Performance Requirements

| Metric            | Target                   |
| ----------------- | ------------------------ |
| Button response   | < 50ms perceived latency |
| Calculation time  | < 10ms for any operation |
| API response time | < 50ms end-to-end        |
| Memory footprint  | Minimal, no leaks        |
| CPU usage         | No background activity   |

---

## 8. Accessibility Requirements

See [accessibility.md](accessibility.md) for full WCAG 2.1 AAA requirements.

### Summary

| Requirement           | Target                |
| --------------------- | --------------------- |
| Contrast ratio (text) | 7:1 minimum           |
| Contrast ratio (UI)   | 3:1 minimum           |
| Touch/click targets   | 44×44px minimum       |
| Keyboard access       | Full functionality    |
| Screen reader         | All actions announced |
| Focus indicators      | Always visible        |

---

## 9. Testing Requirements

### 9.1 Required Unit Tests

| Category       | Test Cases                                                                         |
| -------------- | ---------------------------------------------------------------------------------- |
| Addition       | Positive + positive, negative + negative, positive + negative, zero                |
| Subtraction    | Positive - positive, result negative, zero                                         |
| Multiplication | Positive × positive, negative × positive, zero, large numbers                      |
| Division       | Positive ÷ positive, negative ÷ positive, **zero ÷ non-zero**, **non-zero ÷ zero** |
| Precision      | `0.1 + 0.2 = 0.3`, `1 ÷ 3` precision                                               |
| Edge cases     | Max number, min number, repeated operators                                         |

### 9.2 Required Integration Tests

| Scenario          | Expected Outcome                   |
| ----------------- | ---------------------------------- |
| Valid calculation | Correct result returned            |
| Division by zero  | Error message, no crash            |
| Invalid operator  | 400 response (API) or ignored (UI) |
| Missing field     | 400 response (API)                 |
| Rapid input       | All inputs processed correctly     |

### 9.3 Coverage Target

- **Business logic**: ≥ 80% line coverage
- **Edge cases**: 100% of documented cases covered
- **Error paths**: All error conditions tested

---

## 10. Acceptance Criteria

### Functional

- [ ] All four arithmetic operations work correctly
- [ ] Division by zero displays "Cannot divide by zero"
- [ ] No floating-point artefacts visible (e.g., 0.1 + 0.2 = 0.3)
- [ ] AC clears all state
- [ ] Sign toggle (±) works correctly
- [ ] Percentage (%) works correctly
- [ ] Calculator never crashes

### Accessibility

- [ ] All buttons keyboard accessible
- [ ] Screen reader announces results and errors
- [ ] Focus indicators always visible
- [ ] Contrast ratios meet WCAG 2.1 AAA

### Quality

- [ ] Tests pass with ≥ 80% coverage
- [ ] All edge cases from this document tested
- [ ] No errors in browser console / application logs
- [ ] Follows project style guide
