import type { CalculationResult, Operator } from './types';
import {
  ERROR_MESSAGES,
  MAX_DECIMAL_PLACES,
  MAX_DISPLAY_DIGITS,
  MAX_SAFE_VALUE,
} from './constants';

/**
 * Performs arithmetic calculation between two numbers.
 * Returns a CalculationResult with either the value or an error.
 */
export function calculate(
  a: number,
  b: number,
  operator: Operator
): CalculationResult {
  let result: number;

  switch (operator) {
    case '+':
      result = a + b;
      break;
    case '-':
      result = a - b;
      break;
    case '×':
      result = a * b;
      break;
    case '÷':
      if (b === 0) {
        return { value: 0, error: ERROR_MESSAGES.DIV_ZERO };
      }
      result = a / b;
      break;
    default:
      return { value: 0, error: ERROR_MESSAGES.INVALID_OP };
  }

  // Check for overflow/underflow
  if (!Number.isFinite(result)) {
    return { value: 0, error: ERROR_MESSAGES.OVERFLOW };
  }

  if (Math.abs(result) > MAX_SAFE_VALUE) {
    return { value: 0, error: ERROR_MESSAGES.OVERFLOW };
  }

  if (result !== 0 && Math.abs(result) < Number.MIN_VALUE) {
    return { value: 0, error: ERROR_MESSAGES.UNDERFLOW };
  }

  // Fix floating-point precision issues
  result = fixFloatingPointPrecision(result);

  return { value: result, error: null };
}

/**
 * Fixes common floating-point precision issues.
 * For example, 0.1 + 0.2 should equal 0.3, not 0.30000000000000004
 */
export function fixFloatingPointPrecision(value: number): number {
  // Round to 12 significant digits to eliminate floating-point artifacts
  const rounded = Number(value.toPrecision(12));
  // If the rounded value is close enough to the original, use it
  if (Math.abs(rounded - value) < Number.EPSILON * Math.abs(value)) {
    return rounded;
  }
  return value;
}

/**
 * Formats a number for display in the calculator.
 * Handles scientific notation for very large/small numbers.
 */
export function formatDisplay(value: number): string {
  if (value === 0) {
    return '0';
  }

  const absValue = Math.abs(value);

  // Use scientific notation for very large or very small numbers
  if (absValue >= 1e12 || (absValue !== 0 && absValue < 1e-10)) {
    return value.toExponential(MAX_DECIMAL_PLACES - 5);
  }

  // Check if the number is an integer
  if (Number.isInteger(value)) {
    const intStr = value.toString();
    if (intStr.length <= MAX_DISPLAY_DIGITS) {
      return intStr;
    }
    return value.toExponential(MAX_DECIMAL_PLACES - 5);
  }

  // Format decimal numbers
  let formatted = value.toString();

  // Limit decimal places
  if (formatted.includes('.')) {
    const [intPart, decPart] = formatted.split('.');
    const intPartStr = intPart ?? '0';
    const decPartStr = decPart ?? '';
    const maxDecPlaces = Math.max(0, MAX_DISPLAY_DIGITS - intPartStr.length - 1);
    const truncatedDec = decPartStr.slice(0, Math.min(maxDecPlaces, MAX_DECIMAL_PLACES));
    
    // Remove trailing zeros
    const trimmedDec = truncatedDec.replace(/0+$/, '');
    formatted = trimmedDec ? `${intPartStr}.${trimmedDec}` : intPartStr;
  }

  // If still too long, use scientific notation
  if (formatted.length > MAX_DISPLAY_DIGITS) {
    return value.toExponential(MAX_DECIMAL_PLACES - 5);
  }

  return formatted;
}

/**
 * Parses a string input into a number.
 * Handles edge cases like empty strings and invalid input.
 */
export function parseInput(input: string): number {
  if (!input || input === '' || input === '-') {
    return 0;
  }

  const parsed = parseFloat(input);
  return Number.isNaN(parsed) ? 0 : parsed;
}

/**
 * Checks if a string represents a valid number input.
 */
export function isValidNumberInput(input: string): boolean {
  if (!input || input === '' || input === '-' || input === '.') {
    return false;
  }
  const num = parseFloat(input);
  return !Number.isNaN(num) && Number.isFinite(num);
}

/**
 * Calculates percentage of a number.
 * Returns the value divided by 100.
 */
export function calculatePercent(value: number): number {
  return fixFloatingPointPrecision(value / 100);
}

/**
 * Toggles the sign of a number (positive to negative or vice versa).
 */
export function toggleSign(value: string): string {
  if (!value || value === '0') {
    return '0';
  }

  if (value.startsWith('-')) {
    return value.slice(1);
  }

  return `-${value}`;
}
