# Calculator UI — React/TypeScript Requirements

**Version:** 2.0  
**Status:** Active  
**Framework:** React 18+ with TypeScript  
**Build Tool:** Vite  
**Testing:** Vitest + React Testing Library  
**Reference Screenshot:** [`calculator.png`](./calculator.png)

![iOS Calculator Reference](./calculator.png)

---

## 1. Scope

This document defines **React/TypeScript-specific** technical requirements.

**For functional requirements, see:** [../calculator-requirements.md](../calculator-requirements.md)

- Arithmetic operations and behaviour
- Edge cases and error messages
- Accessibility (WCAG 2.1 AAA)
- Security and performance targets

---

## 2. Project Structure

```
client/src/
├── features/
│   └── calculator/
│       ├── Calculator.tsx           # Main component
│       ├── Calculator.module.css    # Scoped styles
│       ├── CalculatorDisplay.tsx    # Display component
│       ├── CalculatorButton.tsx     # Button component
│       ├── CalculatorKeypad.tsx     # Button grid component
│       ├── useCalculator.ts         # State and logic hook
│       ├── calculatorEngine.ts      # Pure calculation functions
│       ├── constants.ts             # Button configs, limits
│       └── types.ts                 # TypeScript interfaces
├── App.tsx
└── main.tsx
```

---

## 3. Component Architecture

### 3.1 Component Breakdown

| Component           | Responsibility                             |
| ------------------- | ------------------------------------------ |
| `Calculator`        | Container, layout, keyboard event handling |
| `CalculatorDisplay` | Shows expression and result                |
| `CalculatorButton`  | Individual button with aria-label          |
| `CalculatorKeypad`  | Grid layout, button rendering from config  |

### 3.2 Custom Hook

`useCalculator` manages all state and exposes:

```typescript
interface UseCalculatorReturn {
  display: string;
  expression: string;
  error: string | null;
  handleDigit: (digit: string) => void;
  handleOperator: (operator: Operator) => void;
  handleEquals: () => void;
  handleClear: () => void;
  handleToggleSign: () => void;
  handlePercent: () => void;
  handleDecimal: () => void;
}
```

### 3.3 Pure Calculation Engine

`calculatorEngine.ts` contains pure functions with no side effects:

```typescript
export function calculate(
  a: number,
  b: number,
  operator: Operator,
): CalculationResult;

export function formatDisplay(value: number): string;

export function parseInput(input: string): number;
```

---

## 4. TypeScript Requirements

### 4.1 Strict Mode

Enable in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true
  }
}
```

### 4.2 Type Definitions

```typescript
// types.ts
export type Operator = "+" | "-" | "×" | "÷";

export type CalculatorState = {
  currentValue: string;
  previousValue: string | null;
  operator: Operator | null;
  waitingForOperand: boolean;
  expression: string;
  error: string | null;
};

export type CalculationResult = {
  value: number;
  error: string | null;
};

export type ButtonConfig = {
  label: string;
  ariaLabel: string;
  type: "digit" | "operator" | "function" | "equals";
  value: string;
  span?: number; // For wide buttons like "0"
};
```

### 4.3 Props Interfaces

```typescript
interface CalculatorButtonProps {
  config: ButtonConfig;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
}

interface CalculatorDisplayProps {
  value: string;
  expression: string;
  error: string | null;
}
```

---

## 5. Styling Requirements

### 5.1 CSS Modules

Use CSS Modules for scoped styling:

```typescript
import styles from './Calculator.module.css';

<div className={styles.calculator}>
```

### 5.2 CSS Custom Properties

Define theme in root:

```css
:root {
  --calc-bg: #000000;
  --calc-display-text: #ffffff;
  --calc-button-digit: #333333;
  --calc-button-operator: #ff9500;
  --calc-button-function: #a5a5a5;
  --calc-button-text: #ffffff;
  --calc-focus-ring: #4a90d9;
}
```

### 5.3 Responsive Design

```css
/* Mobile-first, scales up */
.calculator {
  width: 100%;
  max-width: 400px;
  aspect-ratio: 9 / 16;
}

@media (min-width: 768px) {
  .calculator {
    max-width: 320px;
  }
}
```

---

## 6. State Management

### 6.1 Local State Only

Use `useState` and `useReducer` — no external state library required.

### 6.2 Reducer Pattern (Recommended)

```typescript
type CalculatorAction =
  | { type: "DIGIT"; payload: string }
  | { type: "OPERATOR"; payload: Operator }
  | { type: "EQUALS" }
  | { type: "CLEAR" }
  | { type: "TOGGLE_SIGN" }
  | { type: "PERCENT" }
  | { type: "DECIMAL" };

function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState;
```

---

## 7. Testing Requirements

### 7.1 Test Structure

```
client/tests/
├── features/
│   └── calculator/
│       ├── Calculator.test.tsx      # Integration tests
│       ├── calculatorEngine.test.ts # Unit tests
│       └── useCalculator.test.ts    # Hook tests
└── setup.ts
```

### 7.2 Unit Tests (calculatorEngine)

Test pure functions in isolation:

```typescript
describe("calculate", () => {
  it("adds two positive numbers", () => {
    expect(calculate(5, 3, "+")).toEqual({ value: 8, error: null });
  });

  it("returns error for division by zero", () => {
    expect(calculate(5, 0, "÷")).toEqual({
      value: 0,
      error: "Cannot divide by zero",
    });
  });

  it("handles floating-point precision", () => {
    expect(calculate(0.1, 0.2, "+")).toEqual({ value: 0.3, error: null });
  });
});
```

### 7.3 Integration Tests (Calculator)

Test user interactions:

```typescript
describe('Calculator', () => {
  it('calculates 5 + 3 = 8', async () => {
    render(<Calculator />);
    await userEvent.click(screen.getByLabelText('5'));
    await userEvent.click(screen.getByLabelText('Add'));
    await userEvent.click(screen.getByLabelText('3'));
    await userEvent.click(screen.getByLabelText('Equals'));
    expect(screen.getByRole('status')).toHaveTextContent('8');
  });

  it('shows error for division by zero', async () => {
    render(<Calculator />);
    await userEvent.click(screen.getByLabelText('5'));
    await userEvent.click(screen.getByLabelText('Divide'));
    await userEvent.click(screen.getByLabelText('0'));
    await userEvent.click(screen.getByLabelText('Equals'));
    expect(screen.getByRole('alert')).toHaveTextContent('Cannot divide by zero');
  });
});
```

### 7.4 Accessibility Tests

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

it('has no accessibility violations', async () => {
  const { container } = render(<Calculator />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### 7.5 Coverage Target

- `calculatorEngine.ts`: 100%
- `useCalculator.ts`: ≥ 90%
- Components: ≥ 80%

---

## 8. Keyboard Support

Handle in `Calculator.tsx`:

```typescript
useEffect(
  () => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") handleDigit(e.key);
      else if (e.key === "+") handleOperator("+");
      else if (e.key === "-") handleOperator("-");
      else if (e.key === "*") handleOperator("×");
      else if (e.key === "/") handleOperator("÷");
      else if (e.key === "Enter" || e.key === "=") handleEquals();
      else if (e.key === "Escape" || e.key === "Delete") handleClear();
      else if (e.key === "Backspace") handleBackspace();
      else if (e.key === ".") handleDecimal();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  },
  [
    /* dependencies */
  ],
);
```

---

## 9. Route Configuration

Add to `App.tsx`:

```typescript
<Routes>
  <Route path="/calculator" element={<Calculator />} />
</Routes>
```

---

## 10. Acceptance Criteria

### Technical

- [ ] TypeScript strict mode enabled, no `any` types
- [ ] All components use CSS Modules
- [ ] Calculation logic separated into pure functions
- [ ] Custom hook manages all state
- [ ] Keyboard navigation works
- [ ] Tests pass with required coverage

### Code Quality

- [ ] Follows `docs/tsstyle/` style guide
- [ ] No ESLint errors or warnings
- [ ] Components under 250 lines
- [ ] Props interfaces defined for all components
