import { useReducer, useCallback } from 'react';
import type {
  CalculatorState,
  CalculatorAction,
  UseCalculatorReturn,
  Operator,
} from './types';
import {
  calculate,
  formatDisplay,
  parseInput,
  toggleSign,
  calculatePercent,
} from './calculatorEngine';
import { MAX_INPUT_DIGITS, OPERATOR_SYMBOLS } from './constants';

/** Initial calculator state */
const initialState: CalculatorState = {
  currentValue: '0',
  previousValue: null,
  operator: null,
  waitingForOperand: false,
  expression: '',
  error: null,
};

/**
 * Reducer function for calculator state management.
 */
function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction
): CalculatorState {
  switch (action.type) {
    case 'DIGIT': {
      const digit = action.payload;

      // Clear error on new input
      if (state.error) {
        return {
          ...initialState,
          currentValue: digit === '0' ? '0' : digit,
        };
      }

      // If waiting for operand, start fresh
      if (state.waitingForOperand) {
        return {
          ...state,
          currentValue: digit,
          waitingForOperand: false,
        };
      }

      // Prevent too many digits
      const currentDigits = state.currentValue.replace(/[-.]/g, '');
      if (currentDigits.length >= MAX_INPUT_DIGITS) {
        return state;
      }

      // Handle leading zero
      if (state.currentValue === '0' && digit !== '0') {
        return { ...state, currentValue: digit };
      }

      // Prevent multiple leading zeros
      if (state.currentValue === '0' && digit === '0') {
        return state;
      }

      return {
        ...state,
        currentValue: state.currentValue + digit,
      };
    }

    case 'DECIMAL': {
      // Clear error on new input
      if (state.error) {
        return {
          ...initialState,
          currentValue: '0.',
        };
      }

      // If waiting for operand, start with "0."
      if (state.waitingForOperand) {
        return {
          ...state,
          currentValue: '0.',
          waitingForOperand: false,
        };
      }

      // Prevent multiple decimal points
      if (state.currentValue.includes('.')) {
        return state;
      }

      return {
        ...state,
        currentValue: state.currentValue + '.',
      };
    }

    case 'OPERATOR': {
      const nextOperator = action.payload;
      const currentValue = parseInput(state.currentValue);

      // Clear error on new operator
      if (state.error) {
        return {
          ...initialState,
          currentValue: state.currentValue,
          previousValue: state.currentValue,
          operator: nextOperator,
          waitingForOperand: true,
          expression: `${formatDisplay(currentValue)} ${OPERATOR_SYMBOLS[nextOperator]}`,
        };
      }

      // If we have a previous value and operator, calculate first
      if (state.previousValue !== null && state.operator && !state.waitingForOperand) {
        const previousValue = parseInput(state.previousValue);
        const result = calculate(previousValue, currentValue, state.operator);

        if (result.error) {
          return {
            ...state,
            error: result.error,
            expression: '',
          };
        }

        const formattedResult = formatDisplay(result.value);
        return {
          ...state,
          currentValue: formattedResult,
          previousValue: formattedResult,
          operator: nextOperator,
          waitingForOperand: true,
          expression: `${formattedResult} ${OPERATOR_SYMBOLS[nextOperator]}`,
        };
      }

      // Just set the operator
      const formattedCurrent = formatDisplay(currentValue);
      return {
        ...state,
        previousValue: formattedCurrent,
        operator: nextOperator,
        waitingForOperand: true,
        expression: `${formattedCurrent} ${OPERATOR_SYMBOLS[nextOperator]}`,
      };
    }

    case 'EQUALS': {
      // Clear error on equals
      if (state.error) {
        return initialState;
      }

      // Nothing to calculate
      if (state.operator === null || state.previousValue === null) {
        return state;
      }

      const previousValue = parseInput(state.previousValue);
      const currentValue = parseInput(state.currentValue);
      const result = calculate(previousValue, currentValue, state.operator);

      if (result.error) {
        return {
          ...state,
          error: result.error,
          expression: `${state.previousValue} ${OPERATOR_SYMBOLS[state.operator]} ${state.currentValue}`,
        };
      }

      const formattedResult = formatDisplay(result.value);
      return {
        ...state,
        currentValue: formattedResult,
        previousValue: null,
        operator: null,
        waitingForOperand: true,
        expression: '',
      };
    }

    case 'CLEAR': {
      return initialState;
    }

    case 'TOGGLE_SIGN': {
      if (state.error) {
        return state;
      }

      return {
        ...state,
        currentValue: toggleSign(state.currentValue),
      };
    }

    case 'PERCENT': {
      if (state.error) {
        return state;
      }

      const currentValue = parseInput(state.currentValue);
      const percentValue = calculatePercent(currentValue);
      return {
        ...state,
        currentValue: formatDisplay(percentValue),
      };
    }

    case 'BACKSPACE': {
      if (state.error) {
        return initialState;
      }

      if (state.waitingForOperand) {
        return state;
      }

      if (state.currentValue.length === 1 || 
          (state.currentValue.length === 2 && state.currentValue.startsWith('-'))) {
        return {
          ...state,
          currentValue: '0',
        };
      }

      return {
        ...state,
        currentValue: state.currentValue.slice(0, -1),
      };
    }

    default:
      return state;
  }
}

/**
 * Custom hook for calculator state management.
 * Provides all the handlers and state needed for the calculator UI.
 */
export function useCalculator(): UseCalculatorReturn {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  const handleDigit = useCallback((digit: string) => {
    dispatch({ type: 'DIGIT', payload: digit });
  }, []);

  const handleOperator = useCallback((operator: Operator) => {
    dispatch({ type: 'OPERATOR', payload: operator });
  }, []);

  const handleEquals = useCallback(() => {
    dispatch({ type: 'EQUALS' });
  }, []);

  const handleClear = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  const handleToggleSign = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIGN' });
  }, []);

  const handlePercent = useCallback(() => {
    dispatch({ type: 'PERCENT' });
  }, []);

  const handleDecimal = useCallback(() => {
    dispatch({ type: 'DECIMAL' });
  }, []);

  const handleBackspace = useCallback(() => {
    dispatch({ type: 'BACKSPACE' });
  }, []);

  return {
    display: state.currentValue,
    expression: state.expression,
    error: state.error,
    handleDigit,
    handleOperator,
    handleEquals,
    handleClear,
    handleToggleSign,
    handlePercent,
    handleDecimal,
    handleBackspace,
  };
}
