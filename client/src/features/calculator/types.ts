/**
 * Calculator type definitions
 */

/** Supported arithmetic operators */
export type Operator = '+' | '-' | '×' | '÷';

/** Calculator state */
export type CalculatorState = {
  currentValue: string;
  previousValue: string | null;
  operator: Operator | null;
  waitingForOperand: boolean;
  expression: string;
  error: string | null;
};

/** Result of a calculation */
export type CalculationResult = {
  value: number;
  error: string | null;
};

/** Button types for styling and behaviour */
export type ButtonType = 'digit' | 'operator' | 'function' | 'equals';

/** Configuration for a calculator button */
export type ButtonConfig = {
  label: string;
  ariaLabel: string;
  type: ButtonType;
  value: string;
  span?: number;
};

/** Calculator actions for the reducer */
export type CalculatorAction =
  | { type: 'DIGIT'; payload: string }
  | { type: 'OPERATOR'; payload: Operator }
  | { type: 'EQUALS' }
  | { type: 'CLEAR' }
  | { type: 'TOGGLE_SIGN' }
  | { type: 'PERCENT' }
  | { type: 'DECIMAL' }
  | { type: 'BACKSPACE' };

/** Return type for useCalculator hook */
export interface UseCalculatorReturn {
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
  handleBackspace: () => void;
}

/** Props for CalculatorButton component */
export interface CalculatorButtonProps {
  config: ButtonConfig;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
}

/** Props for CalculatorDisplay component */
export interface CalculatorDisplayProps {
  value: string;
  expression: string;
  error: string | null;
}

/** Props for CalculatorKeypad component */
export interface CalculatorKeypadProps {
  onDigit: (digit: string) => void;
  onOperator: (operator: Operator) => void;
  onEquals: () => void;
  onClear: () => void;
  onToggleSign: () => void;
  onPercent: () => void;
  onDecimal: () => void;
  activeOperator: Operator | null;
}
