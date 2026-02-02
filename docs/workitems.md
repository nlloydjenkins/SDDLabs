# Calculator Application — Work Items

## Project Goal

Deliver a simple, accessible, and reliable calculator application that enables users to perform basic arithmetic operations (addition, subtraction, multiplication, division) plus sign toggle (±), percentage (%), and clear (AC) functions, with a responsive, error-tolerant, and WCAG 2.1 AAA-compliant interface.

## Scope Boundaries

- **In scope:** Four arithmetic operations, sign toggle, percentage, decimal input, clear, error handling (division by zero, overflow), keyboard navigation, screen reader support, optional backend API
- **Out of scope:** Scientific functions, history persistence, user accounts, parentheses, memory functions (MC/MR/M+/M-)

## How to Run Items

Work items are numbered sequentially. Execute in order unless dependencies indicate otherwise. Each item targets 30–90 minutes. "Resolve" items must be completed before dependent items.

---

## WI-001 — Resolve: Clarify operator chaining behaviour

**Intent**
Determine the exact calculation model for chained operations (e.g., `2 + 3 × 4`).

**Traceability**
- HLD: Section 1.2 (core functionalities)
- Requirements: calculator-requirements.md Section 2.2 ("Operator chaining: Supported")

**Scope**
- In: Define whether chaining uses immediate execution (left-to-right) or operator precedence
- Out: Implementation

**Acceptance criteria**
1. Decision documented: either "immediate execution (left-to-right)" or "operator precedence"
2. Example documented: `2 + 3 × 4` produces either `20` (immediate) or `14` (precedence)
3. calculator-requirements.md updated to remove ambiguity

**Verification notes**
- Review updated requirements document and confirm single unambiguous interpretation

**Dependencies**
- None

**Notes**
- Requirements say "Immediate execution model" AND "Operator chaining: Supported" but does not clarify precedence. Must resolve before implementing calculation engine.

---

## WI-002 — Resolve: Clarify equals with pending operator behaviour

**Intent**
Determine behaviour when user presses `=` with a pending operator but no second operand.

**Traceability**
- HLD: n/a
- Requirements: calculator-requirements.md Section 3.3 (Empty operand on `=`) and Section 3.5 (`5 +` then `=`)

**Scope**
- In: Define exact behaviour for `5 + =`
- Out: Implementation

**Acceptance criteria**
1. Decision documented: either `5 + 5 = 10` (repeat first operand) or `5 + 0 = 5` (use zero)
2. calculator-requirements.md updated with explicit choice

**Verification notes**
- Review updated requirements document and confirm single unambiguous interpretation

**Dependencies**
- None

**Notes**
- Requirements explicitly state "(document choice)" — choice must be made.

---

## WI-003 — Resolve: Clarify repeated equals behaviour

**Intent**
Determine behaviour when user presses `=` multiple times.

**Traceability**
- HLD: n/a
- Requirements: calculator-requirements.md Section 3.5 (`= = =`)

**Scope**
- In: Define exact behaviour for repeated `=` presses
- Out: Implementation

**Acceptance criteria**
1. Decision documented: either "repeat last operation" (e.g., `5 + 3 = 8 = 11 = 14`) or "no-op"
2. calculator-requirements.md updated with explicit choice

**Verification notes**
- Review updated requirements document

**Dependencies**
- None

**Notes**
- Requirements say "Repeat last operation or no-op" — choice must be made.

---

## WI-004 — Define domain glossary

**Intent**
Establish shared vocabulary for all calculator concepts.

**Traceability**
- HLD: Section 1, Section 3
- Requirements: n/a

**Scope**
- In: Terms for operand, operator, expression, result, display value, error state, clear action, sign toggle, percentage
- Out: Implementation-specific terms

**Acceptance criteria**
1. Glossary contains at minimum: operand, operator, expression, result, display value, error state, pending operation, clear action, sign toggle, percentage
2. Each term has one-sentence plain-language definition
3. Glossary reviewed and approved by one stakeholder

**Verification notes**
- Non-technical reviewer can understand all terms without additional explanation

**Dependencies**
- None

**Notes**
- None

---

## WI-005 — Define supported operators and behaviour

**Intent**
Document exact behaviour of each arithmetic operator and function.

**Traceability**
- HLD: Section 1.2
- Requirements: calculator-requirements.md Section 2.1, 2.3

**Scope**
- In: +, −, ×, ÷, ±, %, with symbols, descriptions, example I/O
- Out: Implementation

**Acceptance criteria**
1. Document lists six operations: add, subtract, multiply, divide, sign toggle, percentage
2. Each includes: symbol(s), description, example input/output
3. Division by zero behaviour documented (error)
4. Percentage behaviour documented with example
5. Sign toggle behaviour documented with example

**Verification notes**
- Given sample inputs, manually verify expected outputs match specification

**Dependencies**
- WI-001 (chaining behaviour affects operator interaction)
- WI-004

**Notes**
- None

---

## WI-006 — Define input rules and constraints

**Intent**
Specify valid input and handling of invalid input.

**Traceability**
- HLD: Section 1.2 (input management)
- Requirements: calculator-requirements.md Section 3.3 (Invalid Input), Section 5.3 (Digit Limits)

**Scope**
- In: Valid digits (0-9), decimal point rules, maximum input digits (15), leading zeros, multiple decimal handling
- Out: Keyboard shortcuts (separate WI)

**Acceptance criteria**
1. Valid digit characters: 0-9
2. Decimal point: only one per operand; second ignored
3. Maximum input digits: 15; additional ignored
4. Leading zeros: stripped automatically
5. All rules have verification examples

**Verification notes**
- Review specification; no ambiguity for any documented input scenario

**Dependencies**
- WI-004

**Notes**
- None

---

## WI-007 — Define display states and transitions

**Intent**
Document all display states and what triggers transitions.

**Traceability**
- HLD: Section 5.1 (Frontend Data Flow)
- Requirements: calculator-requirements.md Section 5

**Scope**
- In: Initial, entering-first-operand, operator-selected, entering-second-operand, showing-result, error
- Out: Animation, styling

**Acceptance criteria**
1. At least six states defined with descriptions
2. Each transition has triggering event (digit, operator, equals, clear, error)
3. All transitions are deterministic
4. State table or diagram produced
5. Includes expression display behaviour (show above result)

**Verification notes**
- Walk through five user scenarios and trace through state diagram

**Dependencies**
- WI-001, WI-002, WI-003, WI-005, WI-006

**Notes**
- None

---

## WI-008 — Define error model

**Intent**
Specify all error conditions, causes, codes, and messages.

**Traceability**
- HLD: Section 4 (Error Boundary)
- Requirements: calculator-requirements.md Section 3.1, 3.2, 4.1, 4.2

**Scope**
- In: Division by zero, overflow, underflow, invalid operator (API), missing field (API), generic error
- Out: Network errors (backend-specific)

**Acceptance criteria**
1. Error codes match requirements: ERR_DIV_ZERO, ERR_OVERFLOW, ERR_UNDERFLOW, ERR_INVALID_OP, ERR_MISSING, ERR_GENERIC
2. Each error has: code, exact message text, trigger condition
3. Error display requirements: red/warning colour, visual change not colour alone, cleared by AC or new input
4. API error response format documented (HTTP codes, JSON structure)

**Verification notes**
- Compare document against calculator-requirements.md Section 4; all codes and messages match exactly

**Dependencies**
- WI-005

**Notes**
- None

---

## WI-009 — Define precision and display formatting rules

**Intent**
Specify how numbers are formatted for display, including precision handling.

**Traceability**
- HLD: n/a
- Requirements: calculator-requirements.md Section 2.2 (Precision handling), Section 3.4, Section 5.1, 5.2, 5.3

**Scope**
- In: Floating-point correction (0.1+0.2=0.3), scientific notation thresholds, decimal place limits (10), display digit limits (12), integer vs decimal formatting
- Out: Implementation

**Acceptance criteria**
1. 0.1 + 0.2 displays "0.3" (not 0.30000000000000004)
2. Integers display without decimal: 42 not 42.0
3. Decimals display minimal places: 3.14 not 3.14000
4. Scientific notation used for >12 display digits or very large/small numbers
5. Rounding rule for >10 decimal places documented

**Verification notes**
- Review examples in specification; all match requirements

**Dependencies**
- WI-006

**Notes**
- None

---

## WI-010 — Define clear action behaviour

**Intent**
Specify behaviour of AC (clear all) in each state.

**Traceability**
- HLD: Section 1.2
- Requirements: calculator-requirements.md Section 2.3

**Scope**
- In: AC behaviour from every state
- Out: CE (clear entry) if not in scope

**Acceptance criteria**
1. AC resets to initial state from any state
2. Display shows "0" after AC
3. Error state cleared by AC
4. Expression cleared by AC

**Verification notes**
- Trace AC from each state in WI-007; verify outcome

**Dependencies**
- WI-007

**Notes**
- Requirements only mention AC; CE out of scope unless added.

---

## WI-011 — Define calculation engine contract

**Intent**
Specify interface contract for calculation logic.

**Traceability**
- HLD: Section 3.1 (calculatorEngine)
- Requirements: calculator-requirements.md Section 2, 3

**Scope**
- In: Input format, output format, error signalling, precision handling
- Out: Internal algorithms

**Acceptance criteria**
1. Input: two operands (numeric), one operator symbol
2. Output: result (numeric) OR error (code + message)
3. Precision: floating-point artefacts corrected before return
4. Examples for each operator included
5. Examples for each error condition included

**Verification notes**
- Provide ten sample inputs; manually verify expected outputs; contract is unambiguous

**Dependencies**
- WI-005, WI-008, WI-009

**Notes**
- None

---

## WI-012 — Define display component contract

**Intent**
Specify what display component receives and renders.

**Traceability**
- HLD: Section 3.1 (CalculatorDisplay)
- Requirements: calculator-requirements.md Section 5

**Scope**
- In: Display value, expression, error state, accessibility attributes
- Out: Styling details

**Acceptance criteria**
1. Input: current display value, current expression (optional), error object (optional)
2. Output: rendered display showing value or error, expression above result
3. Overflow handling: scale font or truncate or scientific notation
4. ARIA: role="region", aria-label, aria-live="polite", aria-atomic="true"

**Verification notes**
- Provide sample inputs (long number, error, normal); verify specification covers each

**Dependencies**
- WI-007, WI-008, WI-009

**Notes**
- None

---

## WI-013 — Define button component contract

**Intent**
Specify interface for calculator buttons.

**Traceability**
- HLD: Section 3.1 (CalculatorButton)
- Requirements: accessibility.md Section 3.5 (Target Size), Section 5.1 (ARIA)

**Scope**
- In: Label, type (digit/operator/action), press event, accessibility
- Out: Styling

**Acceptance criteria**
1. Input: label text, button type, optional disabled state
2. Output: triggers press event with button value
3. Accessibility: focusable, aria-label, 44×44px minimum target
4. Focus indicator: 3px ring, 3:1 contrast

**Verification notes**
- Review against accessibility.md checklist

**Dependencies**
- WI-004

**Notes**
- None

---

## WI-014 — Define keypad layout specification

**Intent**
Document button arrangement on keypad.

**Traceability**
- HLD: Section 3.1 (CalculatorKeypad), Section 4 (Data-Driven UI)
- Requirements: calculator-requirements.md Section 2.1, 2.3

**Scope**
- In: Grid positions for all buttons (0-9, +, −, ×, ÷, =, AC, ±, %, .)
- Out: Visual styling, responsive layout

**Acceptance criteria**
1. Grid layout defined (rows × columns)
2. Each cell specifies: label, type, position
3. All required buttons included: digits 0-9, operators, equals, AC, ±, %, decimal
4. Layout renderable from configuration data

**Verification notes**
- Sketch layout on paper; matches standard calculator

**Dependencies**
- WI-005, WI-010, WI-013

**Notes**
- None

---

## WI-015 — Define state management contract

**Intent**
Specify state structure and actions for calculator state.

**Traceability**
- HLD: Section 3.1 (useCalculator)
- Requirements: calculator-requirements.md Section 3.5 (Operator Edge Cases)

**Scope**
- In: State shape, action types, transitions
- Out: Implementation approach

**Acceptance criteria**
1. State: display value, first operand, operator, second operand, error, expression, last operation (for repeat =)
2. Actions: digit-pressed, operator-pressed, equals-pressed, clear-pressed, decimal-pressed, sign-toggle-pressed, percent-pressed
3. Each action's state modification documented (per WI-007)
4. Operator replacement rule: last operator wins (per requirements Section 3.5)

**Verification notes**
- Trace three user scenarios through specification; verify correct state after each action

**Dependencies**
- WI-001, WI-002, WI-003, WI-007, WI-011

**Notes**
- None

---

## WI-016 — Define keyboard mapping specification

**Intent**
Document keyboard shortcuts for calculator operation.

**Traceability**
- HLD: n/a
- Requirements: accessibility.md Section 3.1 (Required Keyboard Mappings)

**Scope**
- In: All required key mappings from accessibility.md
- Out: Custom shortcuts beyond requirements

**Acceptance criteria**
1. Keys 0-9 → enter digit
2. . → decimal point
3. + → addition
4. - → subtraction
5. * → multiplication
6. / → division
7. Enter or = → calculate
8. Escape or Delete → clear all
9. Backspace → clear last digit
10. Tab → navigate between controls

**Verification notes**
- Review against accessibility.md Section 3.1 table; all mappings present

**Dependencies**
- WI-014

**Notes**
- None

---

## WI-017 — Define screen reader announcement specification

**Intent**
Document what is announced to screen readers and when.

**Traceability**
- HLD: n/a
- Requirements: accessibility.md Section 6 (Required Announcements)

**Scope**
- In: All required announcements from accessibility.md
- Out: Verbose announcements beyond requirements

**Acceptance criteria**
1. Result calculated → "Result: [value]" (polite)
2. Error occurred → "Error: [message]" (assertive)
3. Calculator cleared → "Calculator cleared" (polite)
4. Operator selected → "[Operator name] selected" (polite)
5. Sign toggled → "Negative" or "Positive" (polite)
6. Error announced via role="alert" and aria-live="assertive"

**Verification notes**
- Compare against accessibility.md Section 6 table; all announcements present

**Dependencies**
- WI-008

**Notes**
- None

---

## WI-018 — Define API contract for backend calculation

**Intent**
Specify request/response contract for optional backend endpoint.

**Traceability**
- HLD: Section 5.2 (Backend API Flow)
- Requirements: calculator-requirements.md Section 4.2 (API Requirements)

**Scope**
- In: Request format, success response, error response, HTTP codes
- Out: Authentication, rate limiting

**Acceptance criteria**
1. Endpoint: POST /api/calculate
2. Request: { firstOperand: number, secondOperand: number, operator: string }
3. Success response (HTTP 200): { result: number, expression: string, hasError: false, errorMessage: null }
4. Calculation error response (HTTP 200): { result: 0, expression: string, hasError: true, errorMessage: string }
5. Validation error response (HTTP 400): { result: 0, expression: null, hasError: true, errorMessage: string }
6. Example payloads included

**Verification notes**
- Review contract; matches calculator-requirements.md Section 4.2 exactly

**Dependencies**
- WI-011

**Notes**
- Backend is optional per HLD; this WI defines contract only if backend is implemented.

---

## WI-019 — Implement calculation engine (happy path)

**Intent**
Implement calculation logic for all operators with valid inputs.

**Traceability**
- HLD: Section 3.1 (calculatorEngine)
- Requirements: calculator-requirements.md Section 2

**Scope**
- In: +, −, ×, ÷ with valid numeric operands
- Out: Error handling, ±, %

**Acceptance criteria**
1. 5 + 3 = 8
2. 10 − 4 = 6
3. 7 × 6 = 42
4. 20 ÷ 5 = 4
5. 2.5 + 1.5 = 4
6. 0.1 + 0.2 = 0.3 (precision corrected)

**Verification notes**
- Execute each as test case; all pass

**Dependencies**
- WI-011

**Notes**
- None

---

## WI-020 — Implement calculation engine (division by zero)

**Intent**
Implement division by zero error handling.

**Traceability**
- HLD: Section 4 (Error Boundary)
- Requirements: calculator-requirements.md Section 3.1

**Scope**
- In: x ÷ 0 (any x)
- Out: Other errors

**Acceptance criteria**
1. 10 ÷ 0 returns error with code ERR_DIV_ZERO
2. 0 ÷ 0 returns error with code ERR_DIV_ZERO
3. Error message is exactly "Cannot divide by zero"

**Verification notes**
- Execute both cases; verify error code and message match

**Dependencies**
- WI-019

**Notes**
- None

---

## WI-021 — Implement calculation engine (overflow/underflow)

**Intent**
Implement overflow and underflow error handling.

**Traceability**
- HLD: n/a
- Requirements: calculator-requirements.md Section 3.2

**Scope**
- In: Results exceeding safe numeric range
- Out: Normal large numbers within range

**Acceptance criteria**
1. Result > MAX_SAFE_VALUE returns error or scientific notation
2. Result < MIN_SAFE_VALUE returns error or scientific notation
3. Error codes ERR_OVERFLOW / ERR_UNDERFLOW used if error returned
4. Large but representable numbers compute correctly

**Verification notes**
- Test boundary values; verify correct behaviour

**Dependencies**
- WI-019

**Notes**
- None

---

## WI-022 — Implement sign toggle function

**Intent**
Implement the ± function to toggle positive/negative.

**Traceability**
- HLD: n/a
- Requirements: calculator-requirements.md Section 2.3

**Scope**
- In: Toggle sign of current operand
- Out: Other functions

**Acceptance criteria**
1. Pressing ± on positive number makes it negative
2. Pressing ± on negative number makes it positive
3. Pressing ± on 0 has no visible effect or shows -0 briefly then 0
4. Works during input and on result

**Verification notes**
- Execute scenarios; verify sign changes correctly

**Dependencies**
- WI-019

**Notes**
- None

---

## WI-023 — Implement percentage function

**Intent**
Implement the % function.

**Traceability**
- HLD: n/a
- Requirements: calculator-requirements.md Section 2.3

**Scope**
- In: Convert current value to percentage
- Out: Other functions

**Acceptance criteria**
1. 50 then % displays 0.5
2. Percentage applied to current operand (divides by 100)
3. Works during input

**Verification notes**
- Execute scenarios; verify correct conversion

**Dependencies**
- WI-019

**Notes**
- None

---

## WI-024 — Implement display component

**Intent**
Implement display that shows value, expression, and errors.

**Traceability**
- HLD: Section 3.1 (CalculatorDisplay)
- Requirements: calculator-requirements.md Section 5, accessibility.md Section 5

**Scope**
- In: Render display value, expression, error per WI-012
- Out: Detailed styling

**Acceptance criteria**
1. Displays "0" in initial state
2. Displays current value during input
3. Displays expression above result (e.g., "8 × 2" above "16")
4. Displays error message when in error state
5. ARIA attributes present: role="region", aria-label, aria-live="polite"
6. Long values handled per WI-009

**Verification notes**
- Provide sample inputs; visually verify; check ARIA with accessibility inspector

**Dependencies**
- WI-012

**Notes**
- None

---

## WI-025 — Implement button component

**Intent**
Implement reusable button with accessibility.

**Traceability**
- HLD: Section 3.1 (CalculatorButton)
- Requirements: accessibility.md Section 3.1, 3.4, 3.5

**Scope**
- In: Render button, emit event, accessibility per WI-013
- Out: Detailed styling

**Acceptance criteria**
1. Button renders with label
2. Click/keyboard triggers press event with value
3. Button is keyboard-focusable
4. Button has aria-label
5. Touch target is 44×44px minimum
6. Focus indicator: 3px ring, visible, 3:1 contrast

**Verification notes**
- Activate via click and keyboard; measure target size; verify ARIA

**Dependencies**
- WI-013

**Notes**
- None

---

## WI-026 — Implement keypad component

**Intent**
Implement keypad that renders buttons from configuration.

**Traceability**
- HLD: Section 3.1 (CalculatorKeypad), Section 4 (Data-Driven UI)
- Requirements: n/a

**Scope**
- In: Render grid of buttons per WI-014
- Out: Responsive layout

**Acceptance criteria**
1. All buttons from layout specification rendered
2. Buttons in correct grid positions
3. Each button press triggers appropriate event
4. Keypad navigable via Tab

**Verification notes**
- Compare rendered keypad to WI-014; navigate via keyboard

**Dependencies**
- WI-014, WI-025

**Notes**
- None

---

## WI-027 — Implement state management

**Intent**
Implement state handling for all calculator actions.

**Traceability**
- HLD: Section 3.1 (useCalculator)
- Requirements: calculator-requirements.md Section 3.5

**Scope**
- In: All actions from WI-015
- Out: Persistence

**Acceptance criteria**
1. Initial state: display "0"
2. Digit input updates display
3. Operator stores first operand and operator
4. Equals computes and displays result
5. Clear resets to initial state
6. Operator replacement: last operator wins (5 + - 3 = 2)
7. Error state entered on calculation error
8. Repeated equals behaviour per WI-003 decision

**Verification notes**
- Execute scenarios from WI-007; verify state correctness

**Dependencies**
- WI-001, WI-002, WI-003, WI-015, WI-019, WI-020

**Notes**
- None

---

## WI-028 — Integrate main calculator container

**Intent**
Wire display, keypad, and state into main component.

**Traceability**
- HLD: Section 3.1 (Calculator), Section 5.1

**Scope**
- In: Composition and event wiring
- Out: Styling

**Acceptance criteria**
1. Calculator displays initial state
2. User can enter multi-digit number
3. User can perform complete calculation (5 + 3 = 8)
4. User can clear and start new calculation
5. Division by zero shows error; clear dismisses
6. ± and % functions work

**Verification notes**
- Perform end-to-end scenarios manually

**Dependencies**
- WI-024, WI-026, WI-027

**Notes**
- None

---

## WI-029 — Implement keyboard navigation

**Intent**
Enable full keyboard operation.

**Traceability**
- HLD: n/a
- Requirements: accessibility.md Section 3.1

**Scope**
- In: All key mappings from WI-016
- Out: Custom shortcuts

**Acceptance criteria**
1. Keys 0-9 input digits
2. Operators (+, -, *, /) select operation
3. Enter/= triggers calculation
4. Escape/Delete clears all
5. Backspace clears last digit
6. Tab navigates between controls
7. Focus visible at all times

**Verification notes**
- Complete full calculation using only keyboard

**Dependencies**
- WI-016, WI-028

**Notes**
- None

---

## WI-030 — Implement screen reader announcements

**Intent**
Ensure state changes announced to screen readers.

**Traceability**
- HLD: n/a
- Requirements: accessibility.md Section 6

**Scope**
- In: All announcements from WI-017
- Out: Verbose announcements

**Acceptance criteria**
1. Result announced as "Result: [value]" (polite)
2. Error announced as "Error: [message]" (assertive, role="alert")
3. Clear announced as "Calculator cleared"
4. Operator announced as "[Operator] selected"
5. Sign toggle announced as "Negative"/"Positive"

**Verification notes**
- Use screen reader to perform calculation; verify all announcements

**Dependencies**
- WI-017, WI-028

**Notes**
- None

---

## WI-031 — Implement focus management

**Intent**
Ensure logical focus order and visible focus indicators.

**Traceability**
- HLD: n/a
- Requirements: accessibility.md Section 3.4

**Scope**
- In: Focus order, focus indicator, no keyboard traps
- Out: Skip links (if single-page)

**Acceptance criteria**
1. Tab order is logical (left-to-right, top-to-bottom)
2. Focus indicator always visible: 3px ring, 3:1 contrast
3. No keyboard traps
4. Focus not lost after action (stays on button or moves predictably)

**Verification notes**
- Navigate entire calculator via keyboard; verify focus visible at all times

**Dependencies**
- WI-029

**Notes**
- None

---

## WI-032 — Implement reduced motion support

**Intent**
Respect user's reduced motion preference.

**Traceability**
- HLD: n/a
- Requirements: accessibility.md Section 3.3

**Scope**
- In: Disable/reduce animations when prefers-reduced-motion is set
- Out: Other preferences

**Acceptance criteria**
1. When prefers-reduced-motion: reduce is set, animations are disabled or minimized
2. Calculator remains fully functional

**Verification notes**
- Set OS/browser to reduced motion; verify no distracting animations

**Dependencies**
- WI-028

**Notes**
- None

---

## WI-033 — Implement backend request validation

**Intent**
Validate incoming API requests.

**Traceability**
- HLD: Section 5.2
- Requirements: calculator-requirements.md Section 3.3, 4.1

**Scope**
- In: Validate operands numeric, operator valid, fields present
- Out: Calculation logic

**Acceptance criteria**
1. Non-numeric operand → HTTP 400, ERR_MISSING or appropriate error
2. Unsupported operator → HTTP 400, ERR_INVALID_OP
3. Missing required field → HTTP 400, ERR_MISSING
4. Valid request passes validation

**Verification notes**
- Submit invalid requests; verify 400 responses with correct error messages

**Dependencies**
- WI-018

**Notes**
- Only if backend implemented

---

## WI-034 — Implement backend calculation endpoint

**Intent**
Implement POST /api/calculate endpoint.

**Traceability**
- HLD: Section 5.2
- Requirements: calculator-requirements.md Section 4.2

**Scope**
- In: Accept valid request, perform calculation, return response
- Out: Logging, metrics

**Acceptance criteria**
1. 5 + 3 returns { result: 8, expression: "5 + 3", hasError: false }
2. 10 ÷ 0 returns { result: 0, expression: "10 / 0", hasError: true, errorMessage: "Cannot divide by zero" }
3. Response format matches WI-018 exactly
4. Invalid requests rejected per WI-033

**Verification notes**
- Send sample requests; verify responses

**Dependencies**
- WI-018, WI-033, WI-019, WI-020

**Notes**
- Only if backend implemented

---

## WI-035 — Implement backend error response handling

**Intent**
Ensure all backend errors return structured responses.

**Traceability**
- HLD: Section 5.2
- Requirements: calculator-requirements.md Section 4.2, 6.2

**Scope**
- In: Calculation errors, validation errors, unexpected errors
- Out: Logging, alerting

**Acceptance criteria**
1. Calculation errors → HTTP 200 with hasError: true
2. Validation errors → HTTP 400 with hasError: true
3. Unexpected errors → HTTP 500 with generic message (no stack trace)
4. All responses use same format from WI-018

**Verification notes**
- Trigger each error type; verify response format

**Dependencies**
- WI-033, WI-034

**Notes**
- Only if backend implemented

---

## WI-036 — Write acceptance tests for calculation engine

**Intent**
Create tests verifying calculation engine behaviour.

**Traceability**
- HLD: Section 9
- Requirements: calculator-requirements.md Section 9.1

**Scope**
- In: Happy path, error cases, precision, edge cases
- Out: Performance tests

**Acceptance criteria**
1. Tests cover all four operators with positive, negative, zero operands
2. Tests cover division by zero (both x÷0 and 0÷0)
3. Tests cover overflow/underflow
4. Tests cover precision (0.1 + 0.2 = 0.3)
5. Tests cover ± and %
6. All tests automated and repeatable
7. Coverage ≥ 80% for calculation engine

**Verification notes**
- Run test suite; all pass; coverage report shows ≥80%

**Dependencies**
- WI-019, WI-020, WI-021, WI-022, WI-023

**Notes**
- None

---

## WI-037 — Write acceptance tests for user scenarios

**Intent**
Create end-to-end tests for complete workflows.

**Traceability**
- HLD: Section 9
- Requirements: calculator-requirements.md Section 9.2, 10

**Scope**
- In: Multi-step calculations, error recovery, chaining
- Out: Performance tests

**Acceptance criteria**
1. Test: enter number, perform addition, verify result
2. Test: operator chaining (per WI-001 decision)
3. Test: division by zero → error → clear → continue
4. Test: decimal input and calculation
5. Test: ± toggle and % function
6. All tests automated and repeatable

**Verification notes**
- Run test suite; all pass

**Dependencies**
- WI-028

**Notes**
- None

---

## WI-038 — Write acceptance tests for keyboard navigation

**Intent**
Create tests verifying keyboard accessibility.

**Traceability**
- HLD: n/a
- Requirements: accessibility.md Section 7 (Manual Testing Checklist)

**Scope**
- In: All keyboard mappings, focus order
- Out: Screen reader tests (separate)

**Acceptance criteria**
1. Test: complete calculation using only keyboard
2. Test: all key mappings from WI-016 work
3. Test: focus visible throughout
4. Test: no keyboard traps
5. All tests automated where possible; manual checklist for rest

**Verification notes**
- Run automated tests; complete manual checklist

**Dependencies**
- WI-029, WI-031

**Notes**
- None

---

## WI-039 — Write acceptance tests for screen reader

**Intent**
Create tests/checklist for screen reader accessibility.

**Traceability**
- HLD: n/a
- Requirements: accessibility.md Section 6, 7

**Scope**
- In: All required announcements
- Out: Full screen reader compatibility matrix

**Acceptance criteria**
1. Test with at least one screen reader (NVDA or VoiceOver)
2. Verify result announcement
3. Verify error announcement (assertive)
4. Verify clear announcement
5. Verify operator announcement
6. Manual testing checklist completed

**Verification notes**
- Complete manual testing checklist with screen reader

**Dependencies**
- WI-030

**Notes**
- None

---

## WI-040 — Write acceptance tests for API

**Intent**
Create tests for backend API.

**Traceability**
- HLD: Section 9
- Requirements: calculator-requirements.md Section 9.2

**Scope**
- In: Valid requests, validation errors, calculation errors
- Out: Performance, security testing

**Acceptance criteria**
1. Test: valid addition returns correct result
2. Test: division by zero returns error response
3. Test: invalid operand returns 400
4. Test: missing field returns 400
5. All tests automated and repeatable

**Verification notes**
- Run test suite; all pass

**Dependencies**
- WI-034, WI-035

**Notes**
- Only if backend implemented

---

## WI-041 — Verify contrast ratios meet WCAG AAA

**Intent**
Verify all colour contrasts meet requirements.

**Traceability**
- HLD: n/a
- Requirements: accessibility.md Section 2.4

**Scope**
- In: Text contrast (7:1), large text (4.5:1), UI components (3:1)
- Out: Colour palette selection

**Acceptance criteria**
1. Normal text: ≥ 7:1 contrast ratio
2. Large text: ≥ 4.5:1 contrast ratio
3. UI components/focus indicators: ≥ 3:1 contrast ratio
4. Error text meets 7:1 on background
5. Contrast ratios measured and documented

**Verification notes**
- Use contrast checker tool; document all ratios

**Dependencies**
- WI-024, WI-025

**Notes**
- None

---

## WI-042 — Verify touch target sizes

**Intent**
Verify all interactive elements meet minimum size.

**Traceability**
- HLD: n/a
- Requirements: accessibility.md Section 3.5

**Scope**
- In: All buttons
- Out: Non-interactive elements

**Acceptance criteria**
1. All buttons are at least 44×44px
2. Measurement documented

**Verification notes**
- Measure each button; document results

**Dependencies**
- WI-025, WI-026

**Notes**
- None

---

## WI-043 — Create accessibility statement

**Intent**
Document accessibility conformance and contact information.

**Traceability**
- HLD: n/a
- Requirements: accessibility.md Section 7 (Accessibility Statement)

**Scope**
- In: Conformance level, known limitations, contact, review date
- Out: Implementation changes

**Acceptance criteria**
1. Statement includes: WCAG 2.1 AAA conformance claimed
2. Statement includes: any known limitations
3. Statement includes: contact information for accessibility issues
4. Statement includes: date of last accessibility review

**Verification notes**
- Review statement for completeness

**Dependencies**
- WI-041, WI-042, WI-038, WI-039

**Notes**
- None

---

## WI-044 — Document user guide

**Intent**
Create end-user documentation.

**Traceability**
- HLD: Section 6
- Requirements: n/a

**Scope**
- In: How to use functions, keyboard shortcuts, error messages
- Out: Developer documentation

**Acceptance criteria**
1. Guide explains basic calculation
2. Guide lists all operations including ±, %
3. Guide documents keyboard shortcuts
4. Guide explains error messages and recovery
5. Guide written in plain language

**Verification notes**
- Non-technical person follows guide to complete calculation

**Dependencies**
- WI-028, WI-029

**Notes**
- None

---

## WI-045 — Verify performance requirements

**Intent**
Verify calculator meets performance targets.

**Traceability**
- HLD: n/a
- Requirements: calculator-requirements.md Section 7

**Scope**
- In: Button response < 50ms, calculation < 10ms, API response < 50ms
- Out: Load testing

**Acceptance criteria**
1. Button press to visual feedback: < 50ms perceived
2. Calculation time: < 10ms
3. API response (if applicable): < 50ms
4. No memory leaks during extended use
5. No CPU activity when idle

**Verification notes**
- Measure with performance tools; document results

**Dependencies**
- WI-028, WI-034 (if API)

**Notes**
- None

---

## WI-046 — Final acceptance checklist

**Intent**
Verify all functional and quality acceptance criteria from requirements.

**Traceability**
- HLD: Section 11
- Requirements: calculator-requirements.md Section 10

**Scope**
- In: All acceptance criteria from requirements Section 10
- Out: Future enhancements

**Acceptance criteria**
1. All four arithmetic operations work correctly
2. Division by zero displays "Cannot divide by zero"
3. No floating-point artefacts (0.1 + 0.2 = 0.3)
4. AC clears all state
5. ± works correctly
6. % works correctly
7. Calculator never crashes
8. All buttons keyboard accessible
9. Screen reader announces results and errors
10. Focus indicators always visible
11. Contrast ratios meet WCAG 2.1 AAA
12. Tests pass with ≥ 80% coverage
13. All edge cases from requirements tested
14. No console/log errors

**Verification notes**
- Complete checklist; all items checked

**Dependencies**
- All previous WIs

**Notes**
- None
