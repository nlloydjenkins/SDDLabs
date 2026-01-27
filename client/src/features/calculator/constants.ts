import type { ButtonConfig, Operator } from './types';

/** Maximum number of input digits allowed */
export const MAX_INPUT_DIGITS = 15;

/** Maximum display digits before using scientific notation */
export const MAX_DISPLAY_DIGITS = 12;

/** Maximum decimal places to show */
export const MAX_DECIMAL_PLACES = 10;

/** Safe numeric limits */
export const MAX_SAFE_VALUE = Number.MAX_SAFE_INTEGER;
export const MIN_SAFE_VALUE = Number.MIN_SAFE_INTEGER;

/** Error messages - must match shared requirements */
export const ERROR_MESSAGES = {
  DIV_ZERO: 'Cannot divide by zero',
  OVERFLOW: 'Number too large',
  UNDERFLOW: 'Number too small',
  INVALID_OP: 'Invalid operator',
  GENERIC: 'Calculation error',
} as const;

/** Operator display symbols */
export const OPERATOR_SYMBOLS: Record<Operator, string> = {
  '+': '+',
  '-': '−',
  '×': '×',
  '÷': '÷',
} as const;

/** Keyboard key to operator mapping */
export const KEY_TO_OPERATOR: Record<string, Operator> = {
  '+': '+',
  '-': '-',
  '*': '×',
  '/': '÷',
} as const;

/** Button configurations for the calculator keypad */
export const BUTTON_CONFIGS: ButtonConfig[] = [
  // Row 1: AC, ±, %, ÷
  { label: 'AC', ariaLabel: 'Clear all', type: 'function', value: 'clear' },
  { label: '±', ariaLabel: 'Toggle sign', type: 'function', value: 'toggleSign' },
  { label: '%', ariaLabel: 'Percent', type: 'function', value: 'percent' },
  { label: '÷', ariaLabel: 'Divide', type: 'operator', value: '÷' },

  // Row 2: 7, 8, 9, ×
  { label: '7', ariaLabel: '7', type: 'digit', value: '7' },
  { label: '8', ariaLabel: '8', type: 'digit', value: '8' },
  { label: '9', ariaLabel: '9', type: 'digit', value: '9' },
  { label: '×', ariaLabel: 'Multiply', type: 'operator', value: '×' },

  // Row 3: 4, 5, 6, -
  { label: '4', ariaLabel: '4', type: 'digit', value: '4' },
  { label: '5', ariaLabel: '5', type: 'digit', value: '5' },
  { label: '6', ariaLabel: '6', type: 'digit', value: '6' },
  { label: '-', ariaLabel: 'Subtract', type: 'operator', value: '-' },

  // Row 4: 1, 2, 3, +
  { label: '1', ariaLabel: '1', type: 'digit', value: '1' },
  { label: '2', ariaLabel: '2', type: 'digit', value: '2' },
  { label: '3', ariaLabel: '3', type: 'digit', value: '3' },
  { label: '+', ariaLabel: 'Add', type: 'operator', value: '+' },

  // Row 5: 0 (wide), ., =
  { label: '0', ariaLabel: '0', type: 'digit', value: '0', span: 2 },
  { label: '.', ariaLabel: 'Decimal point', type: 'digit', value: '.' },
  { label: '=', ariaLabel: 'Equals', type: 'equals', value: 'equals' },
] as const;
