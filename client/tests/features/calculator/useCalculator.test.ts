import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCalculator } from '../../../src/features/calculator/useCalculator';

describe('useCalculator', () => {
  it('initializes with display of 0', () => {
    const { result } = renderHook(() => useCalculator());
    expect(result.current.display).toBe('0');
    expect(result.current.expression).toBe('');
    expect(result.current.error).toBeNull();
  });

  describe('digit input', () => {
    it('handles single digit input', () => {
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.handleDigit('5');
      });

      expect(result.current.display).toBe('5');
    });

    it('handles multiple digit input', () => {
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.handleDigit('1');
        result.current.handleDigit('2');
        result.current.handleDigit('3');
      });

      expect(result.current.display).toBe('123');
    });

    it('replaces leading zero', () => {
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.handleDigit('5');
      });

      expect(result.current.display).toBe('5');
    });

    it('prevents multiple leading zeros', () => {
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.handleDigit('0');
        result.current.handleDigit('0');
        result.current.handleDigit('0');
      });

      expect(result.current.display).toBe('0');
    });
  });

  describe('decimal input', () => {
    it('adds decimal point', () => {
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.handleDigit('5');
        result.current.handleDecimal();
        result.current.handleDigit('3');
      });

      expect(result.current.display).toBe('5.3');
    });

    it('prevents multiple decimal points', () => {
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.handleDigit('5');
        result.current.handleDecimal();
        result.current.handleDecimal();
        result.current.handleDigit('3');
      });

      expect(result.current.display).toBe('5.3');
    });

    it('adds 0. when starting with decimal', () => {
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.handleDecimal();
      });

      expect(result.current.display).toBe('0.');
    });
  });

  describe('operations', () => {
    it('calculates 5 + 3 = 8', () => {
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.handleDigit('5');
        result.current.handleOperator('+');
        result.current.handleDigit('3');
        result.current.handleEquals();
      });

      expect(result.current.display).toBe('8');
    });

    it('calculates 10 - 4 = 6', () => {
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.handleDigit('1');
        result.current.handleDigit('0');
        result.current.handleOperator('-');
        result.current.handleDigit('4');
        result.current.handleEquals();
      });

      expect(result.current.display).toBe('6');
    });

    it('calculates 6 × 7 = 42', () => {
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.handleDigit('6');
        result.current.handleOperator('×');
        result.current.handleDigit('7');
        result.current.handleEquals();
      });

      expect(result.current.display).toBe('42');
    });

    it('calculates 20 ÷ 4 = 5', () => {
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.handleDigit('2');
        result.current.handleDigit('0');
        result.current.handleOperator('÷');
        result.current.handleDigit('4');
        result.current.handleEquals();
      });

      expect(result.current.display).toBe('5');
    });

    it('shows error for division by zero', () => {
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.handleDigit('5');
        result.current.handleOperator('÷');
        result.current.handleDigit('0');
        result.current.handleEquals();
      });

      expect(result.current.error).toBe('Cannot divide by zero');
    });

    it('chains operations correctly', () => {
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.handleDigit('5');
        result.current.handleOperator('+');
        result.current.handleDigit('3');
        result.current.handleOperator('×');
      });

      // Should calculate 5 + 3 = 8 before applying next operator
      expect(result.current.display).toBe('8');
    });

    it('handles operator replacement (5 + - becomes 5 -)', () => {
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.handleDigit('5');
        result.current.handleOperator('+');
        result.current.handleOperator('-');
        result.current.handleDigit('3');
        result.current.handleEquals();
      });

      expect(result.current.display).toBe('2');
    });
  });

  describe('clear', () => {
    it('clears all state', () => {
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.handleDigit('5');
        result.current.handleOperator('+');
        result.current.handleDigit('3');
        result.current.handleClear();
      });

      expect(result.current.display).toBe('0');
      expect(result.current.expression).toBe('');
      expect(result.current.error).toBeNull();
    });

    it('clears error state', () => {
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.handleDigit('5');
        result.current.handleOperator('÷');
        result.current.handleDigit('0');
        result.current.handleEquals();
      });

      expect(result.current.error).not.toBeNull();

      act(() => {
        result.current.handleClear();
      });

      expect(result.current.error).toBeNull();
      expect(result.current.display).toBe('0');
    });
  });

  describe('toggle sign', () => {
    it('toggles positive to negative', () => {
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.handleDigit('5');
        result.current.handleToggleSign();
      });

      expect(result.current.display).toBe('-5');
    });

    it('toggles negative to positive', () => {
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.handleDigit('5');
        result.current.handleToggleSign();
        result.current.handleToggleSign();
      });

      expect(result.current.display).toBe('5');
    });
  });

  describe('percent', () => {
    it('calculates percentage', () => {
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.handleDigit('5');
        result.current.handleDigit('0');
        result.current.handlePercent();
      });

      expect(result.current.display).toBe('0.5');
    });
  });

  describe('backspace', () => {
    it('removes last digit', () => {
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.handleDigit('1');
        result.current.handleDigit('2');
        result.current.handleDigit('3');
        result.current.handleBackspace();
      });

      expect(result.current.display).toBe('12');
    });

    it('returns to 0 when last digit removed', () => {
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.handleDigit('5');
        result.current.handleBackspace();
      });

      expect(result.current.display).toBe('0');
    });
  });

  describe('floating-point precision', () => {
    it('handles 0.1 + 0.2 = 0.3', () => {
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.handleDigit('0');
        result.current.handleDecimal();
        result.current.handleDigit('1');
        result.current.handleOperator('+');
        result.current.handleDigit('0');
        result.current.handleDecimal();
        result.current.handleDigit('2');
        result.current.handleEquals();
      });

      expect(result.current.display).toBe('0.3');
    });
  });
});
