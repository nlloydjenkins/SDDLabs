# Calculator Application — Requirements Document

**Version:** 1.1  
**Status:** Draft  
**Target Platforms:** Mobile (iOS primary), Web (responsive)  
**Reference UI:** iOS-style calculator (dark theme, circular buttons, right-aligned display)  
**Reference Screenshot:** [`calculator.png`](./calculator.png)

![iOS Calculator Reference](./calculator.png)

---

## 1. Purpose & Scope

The purpose of this document is to define the functional, non-functional, and design requirements for a basic arithmetic calculator application. The calculator is intended to provide fast, reliable, and accessible calculation of common arithmetic expressions for everyday use.

This document covers:

- Visual and interaction design
- Core calculation logic
- Accessibility and usability
- Security and data handling
- Performance and quality attributes

---

## 2. Design Requirements

### 2.1 Visual Design

- Dark-themed user interface by default
- High-contrast colour palette
- Circular buttons with consistent sizing
- Distinct visual separation between:
  - Numeric keys
  - Operators
  - Function keys (AC, %, ±)
- Operators displayed in a highlight colour (e.g. orange)
- Numbers and results displayed in white on black background
- Subtle shadows or depth effects to indicate tappable elements

### 2.2 Layout

- Portrait-first layout optimised for one-handed use
- Right-aligned calculation display
- Large result text, scalable for long numbers
- Fixed grid layout for buttons (4 columns)
- Consistent spacing and alignment across all rows
- Safe-area awareness for modern devices (notch, home indicator)

### 2.3 Responsiveness

- Adaptive scaling for:
  - Different screen sizes
  - Accessibility text scaling
- No horizontal scrolling
- Buttons remain reachable without stretching on mobile devices

---

## 3. Functional Requirements

### 3.1 Core Arithmetic

The calculator must support:

- Addition (+)
- Subtraction (−)
- Multiplication (×)
- Division (÷)
- Equals (=)

### 3.2 Input Handling

- Numeric input (0–9)
- Decimal point input
- Clear all (AC)
- Sign toggle (±)
- Percentage (%)

### 3.3 Calculation Behaviour

- Immediate execution model (standard calculator behaviour)
- Operator chaining supported (e.g. `2 + 3 × 4`)
- Division by zero handled gracefully
- Percentage behaves relative to the current value
- Sign toggle applies to the current operand
- Decimal precision handled consistently (no floating-point artefacts visible)

### 3.4 Display Behaviour

- Current expression shown subtly above the main result (e.g. `8×2` displayed above `16`)
- Result updates in real time where applicable
- Maximum digit length enforced with intelligent scaling
- Scientific notation used only when necessary
- Clear feedback when input is reset or invalid

### 3.5 Error Handling

- Division by zero displays an error state
- Overflow conditions handled gracefully
- Error state cleared by pressing AC
- Calculator never crashes due to malformed input

---

## 4. Accessibility Requirements

### 4.1 WCAG Compliance

- Target compliance: WCAG 2.1 AA
- Minimum contrast ratio of 4.5:1 for text and controls
- Colour is not the sole indicator of meaning

### 4.2 Screen Reader Support

- All buttons have descriptive accessibility labels
  - Example: “Add”, “Equals”, “Clear”
- Current value announced when updated
- Error states announced clearly

### 4.3 Input Accessibility

- Fully operable via:
  - Touch
  - Keyboard (web)
  - Assistive technologies
- Logical focus order
- Visible focus indicators

### 4.4 Motor & Cognitive Accessibility

- Large touch targets (minimum 44x44px)
- No time-based interactions
- Predictable, consistent behaviour
- No hidden gestures required

---

## 5. Security Requirements

### 5.1 Data Handling

- No personal data collected or stored
- No analytics by default
- No network calls required for core functionality

### 5.2 Input Safety

- Input sanitisation to prevent crashes or injection-style attacks (web)
- Calculation engine isolated from UI layer
- No arbitrary code execution

### 5.3 Platform Security

- Adheres to platform sandboxing rules
- No access to device sensors or user data
- Minimal permissions footprint

---

## 6. Performance Requirements

- Instant response to button presses (<50ms perceived latency)
- Calculations performed synchronously on-device
- No noticeable lag when entering long numbers
- Low memory footprint
- Battery-efficient (no background activity)

---

## 7. Reliability & Quality

- Deterministic calculation results
- Consistent behaviour across platforms
- Comprehensive unit tests for calculation logic
- Edge cases covered:
  - Large numbers
  - Repeated operators
  - Decimal precision

---

## 8. Internationalisation & Localisation

- Support for different decimal separators (e.g. `.` vs `,`)
- Localised accessibility labels
- RTL layout support where applicable
- Numeric formatting based on locale

---

## 9. Maintainability & Extensibility

- Separation of concerns:
  - UI
  - Calculation engine
  - State management
- Calculation logic implemented as a reusable module
- Clear interfaces for adding future features:
  - Memory keys (M+, M−, MR)
  - Scientific functions
  - History view

---

## 10. Non-Goals (Out of Scope)

- Scientific calculator functions
- Graphing
- Cloud sync
- User accounts
- Advertising or monetisation

### 10.1 Deferred Features

The following features are visible in the iOS reference design but explicitly deferred for future implementation:

- **Calculator mode toggle button** — Bottom-left icon for switching calculator modes (basic/scientific)
- **History/menu button** — Top-left icon for viewing calculation history
- **Calculation history view** — List of previous calculations

---

## 11. Acceptance Criteria

- All arithmetic operations function correctly
- Calculator usable with screen readers
- No crashes under normal or edge-case usage
- Visual design matches reference style
- Meets accessibility and performance targets
