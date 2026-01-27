# Evaluation Criteria — Calculator Implementation

**Version:** 1.0  
**Status:** Active  
**Industry Context:** Financial Services, Compliance-Heavy Environments

---

## 1. Overview

This document defines the grading criteria for evaluating AI-generated calculator implementations. The criteria reflect standards expected in regulated financial services environments where accuracy, auditability, and compliance are paramount.

Use this document when evaluating implementations in Copilot Chat:

```
Evaluate this implementation against the criteria in docs/grading.md.
Provide a grade (A, B, C, D, F) with detailed justification for each category.
```

---

## 2. Grading Scale

| Grade | Score   | Description                                |
| ----- | ------- | ------------------------------------------ |
| **A** | 90-100% | Production-ready for regulated environment |
| **B** | 80-89%  | Minor issues, acceptable with review       |
| **C** | 70-79%  | Significant gaps, requires remediation     |
| **D** | 60-69%  | Major deficiencies, not deployable         |
| **F** | <60%    | Fails basic requirements                   |

---

## 3. Evaluation Categories

### 3.1 Functional Correctness (25%)

#### Requirements

| Criterion          | Weight | Pass Criteria                                 |
| ------------------ | ------ | --------------------------------------------- |
| Basic arithmetic   | 8%     | All four operations produce correct results   |
| Edge case handling | 7%     | Division by zero, overflow, precision handled |
| Input validation   | 5%     | Invalid input rejected with clear feedback    |
| State management   | 5%     | Calculator state consistent and predictable   |

#### Financial Industry Considerations

- **Decimal precision**: No floating-point artefacts visible (e.g., `0.1 + 0.2 = 0.3`, not `0.30000000000000004`)
- **Rounding**: Consistent rounding strategy documented
- **Determinism**: Same inputs always produce same outputs
- **Auditability**: All calculations traceable

#### Edge Cases That Must Be Tested

| Case                    | Expected Behaviour                       |
| ----------------------- | ---------------------------------------- |
| Division by zero        | Error message: "Cannot divide by zero"   |
| Very large numbers      | Scientific notation or graceful overflow |
| Very small decimals     | Precision maintained to reasonable limit |
| Repeated operators      | Last operator takes precedence           |
| Leading zeros           | Stripped from display (except "0.x")     |
| Multiple decimal points | Second decimal ignored                   |
| Empty operand           | Clear error, not crash                   |
| Max digit length        | Number scaled or truncated gracefully    |

---

### 3.2 Security (20%)

#### Requirements

| Criterion           | Weight | Pass Criteria                      |
| ------------------- | ------ | ---------------------------------- |
| Input sanitisation  | 6%     | No injection vulnerabilities       |
| Error handling      | 5%     | No stack traces exposed to users   |
| Data protection     | 5%     | No sensitive data logged or leaked |
| Dependency security | 4%     | No known vulnerable dependencies   |

#### Financial Industry Considerations

- **Audit logging**: All errors logged with correlation IDs
- **PII protection**: No personal data in logs or error messages
- **Secure defaults**: Restrictive CORS, no debug endpoints in production
- **Vulnerability scanning**: No high/critical CVEs in dependencies

#### Security Checklist

- [ ] Input validated server-side (not just client)
- [ ] Error responses do not reveal implementation details
- [ ] No `eval()` or dynamic code execution
- [ ] CORS configured appropriately (not `*` in production)
- [ ] Rate limiting considered (documented if not implemented)
- [ ] No secrets in source code
- [ ] Dependencies audited for vulnerabilities

---

### 3.3 Accessibility (15%)

#### Requirements

| Criterion             | Weight | Pass Criteria                     |
| --------------------- | ------ | --------------------------------- |
| WCAG 2.1 AAA contrast | 5%     | 7:1 ratio for text, 3:1 for UI    |
| Keyboard navigation   | 4%     | Full functionality via keyboard   |
| Screen reader support | 4%     | Announcements correct and timely  |
| Focus management      | 2%     | Visible, logical focus indicators |

#### Financial Industry Considerations

- **Legal compliance**: Many jurisdictions mandate accessibility
- **Inclusive design**: Financial tools must be usable by all customers
- **Documentation**: Accessibility statement required

#### Accessibility Checklist

See [docs/accessibility.md](accessibility.md) for full requirements.

- [ ] All interactive elements keyboard accessible
- [ ] Focus order logical and visible
- [ ] Screen reader announces results and errors
- [ ] Contrast ratios verified with tool
- [ ] Touch targets ≥ 44×44px
- [ ] No colour-only indicators

---

### 3.4 Code Quality & Maintainability (15%)

#### Requirements

| Criterion              | Weight | Pass Criteria                       |
| ---------------------- | ------ | ----------------------------------- |
| Separation of concerns | 5%     | UI, logic, state properly separated |
| Code style compliance  | 4%     | Follows project style guide         |
| Documentation          | 3%     | Public APIs documented              |
| Naming conventions     | 3%     | Clear, consistent naming            |

#### Financial Industry Considerations

- **Regulatory audits**: Code must be explainable to non-technical auditors
- **Knowledge transfer**: New team members can understand quickly
- **Change tracking**: All changes traceable in version control

#### SOLID Principles Assessment

| Principle             | React                          | Java                      | Pass Criteria                 |
| --------------------- | ------------------------------ | ------------------------- | ----------------------------- |
| Single Responsibility | Hooks separate from components | Service per domain        | Each unit does one thing      |
| Open/Closed           | Props-based extension          | Interface-based extension | Extend without modifying      |
| Liskov Substitution   | Consistent prop types          | Interface implementations | Substitutable implementations |
| Interface Segregation | Focused prop interfaces        | Small, focused interfaces | No forced dependencies        |
| Dependency Inversion  | Context/props injection        | Constructor injection     | Depend on abstractions        |

---

### 3.5 Testing (15%)

#### Requirements

| Criterion          | Weight | Pass Criteria                     |
| ------------------ | ------ | --------------------------------- |
| Unit test coverage | 5%     | ≥80% coverage on business logic   |
| Edge case coverage | 4%     | All edge cases have tests         |
| Test quality       | 3%     | Tests are maintainable and clear  |
| Integration tests  | 3%     | Happy path and error paths tested |

#### Financial Industry Considerations

- **Regulatory requirement**: Automated tests mandatory for financial software
- **Audit evidence**: Test reports retained as compliance evidence
- **Regression prevention**: No silent breaks to critical calculations

#### Required Test Cases

| Category       | Test Cases Required                                            |
| -------------- | -------------------------------------------------------------- |
| Arithmetic     | Add, subtract, multiply, divide with positive/negative/decimal |
| Edge cases     | Zero division, overflow, precision, empty input                |
| UI/API         | Button clicks/requests produce correct state changes           |
| Accessibility  | Focus management, ARIA announcements                           |
| Error handling | Invalid input shows correct error message                      |

---

### 3.6 Error Handling & Resilience (10%)

#### Requirements

| Criterion            | Weight | Pass Criteria                     |
| -------------------- | ------ | --------------------------------- |
| Graceful degradation | 4%     | Errors don't crash application    |
| User feedback        | 3%     | Clear, actionable error messages  |
| Recovery             | 3%     | User can recover from error state |

#### Error Message Standards

All error messages must be:

1. **User-friendly**: No technical jargon
2. **Specific**: State what went wrong
3. **Actionable**: Tell user how to fix
4. **Accessible**: Announced to screen readers

| Error Condition     | Required Message Format                 |
| ------------------- | --------------------------------------- |
| Division by zero    | "Cannot divide by zero"                 |
| Invalid operator    | "Unknown operator: [operator]"          |
| Number overflow     | "Number too large to display"           |
| Invalid input (API) | "Invalid request: [field] is required"  |
| Server error (API)  | "Calculation failed. Please try again." |

---

## 4. Scoring Worksheet

### TypeScript/React Implementation

| Category               | Weight   | Score (0-100) | Weighted  |
| ---------------------- | -------- | ------------- | --------- |
| Functional Correctness | 25%      |               |           |
| Security               | 20%      |               |           |
| Accessibility          | 15%      |               |           |
| Code Quality           | 15%      |               |           |
| Testing                | 15%      |               |           |
| Error Handling         | 10%      |               |           |
| **Total**              | **100%** |               | **\_\_%** |

### Java/Spring Boot Implementation

| Category               | Weight   | Score (0-100) | Weighted  |
| ---------------------- | -------- | ------------- | --------- |
| Functional Correctness | 25%      |               |           |
| Security               | 20%      |               |           |
| Accessibility (UI)     | 15%      |               |           |
| Code Quality           | 15%      |               |           |
| Testing                | 15%      |               |           |
| Error Handling         | 10%      |               |           |
| **Total**              | **100%** |               | **\_\_%** |

---

## 5. Deductions

### Automatic Grade Reductions

| Issue                                       | Deduction            |
| ------------------------------------------- | -------------------- |
| Application crashes on any input            | -20%                 |
| Incorrect arithmetic result                 | -10% per case        |
| Stack trace exposed to user                 | -15%                 |
| No tests                                    | -25%                 |
| WCAG A failures                             | -10%                 |
| WCAG AA failures                            | -5% (if AAA claimed) |
| Known vulnerable dependency (high/critical) | -15%                 |
| Secrets in source code                      | Automatic F          |

---

## 6. Compliance Attestation

For financial services deployments, the following attestations are required:

- [ ] All arithmetic operations verified against known-good calculator
- [ ] Accessibility audit completed by qualified assessor
- [ ] Security review completed
- [ ] No high/critical vulnerabilities in dependency scan
- [ ] Test coverage meets minimum threshold
- [ ] Error handling tested for all edge cases
- [ ] Code review completed by senior developer

---

## 7. Sample Evaluation Prompt

Use this prompt in Copilot Chat:

```
Evaluate this calculator implementation against docs/grading.md.

For each category, provide:
1. Score (0-100)
2. Specific evidence from the code
3. Issues found with line numbers
4. Recommendations for improvement

Calculate the weighted total and assign a final grade (A, B, C, D, F).

Pay special attention to:
- Decimal precision in calculations
- Division by zero handling
- Accessibility compliance
- Test coverage of edge cases
- Error message clarity
```
