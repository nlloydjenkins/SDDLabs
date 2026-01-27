import { describe, it, expect } from 'vitest';
import {
  calculate,
  formatDisplay,
  parseInput,
  toggleSign,
  calculatePercent,
  fixFloatingPointPrecision,
} from '../../../src/features/calculator/calculatorEngine';

describe('calculatorEngine', () => {
  describe('calculate', () => {
    describe('addition', () => {
      it('adds two positive numbers', () => {
        expect(calculate(5, 3, '+')).toEqual({ value: 8, error: null });
      });

      it('adds two negative numbers', () => {
        expect(calculate(-5, -3, '+')).toEqual({ value: -8, error: null });
      });

      it('adds positive and negative numbers', () => {
        expect(calculate(5, -3, '+')).toEqual({ value: 2, error: null });
      });

      it('adds zero', () => {
        expect(calculate(5, 0, '+')).toEqual({ value: 5, error: null });
      });

      it('handles floating-point precision (0.1 + 0.2)', () => {
        expect(calculate(0.1, 0.2, '+')).toEqual({ value: 0.3, error: null });
      });
    });

    describe('subtraction', () => {
      it('subtracts two positive numbers', () => {
        expect(calculate(5, 3, '-')).toEqual({ value: 2, error: null });
      });

      it('subtracts resulting in negative', () => {
        expect(calculate(3, 5, '-')).toEqual({ value: -2, error: null });
      });

      it('subtracts zero', () => {
        expect(calculate(5, 0, '-')).toEqual({ value: 5, error: null });
      });
    });

    describe('multiplication', () => {
      it('multiplies two positive numbers', () => {
        expect(calculate(5, 3, '×')).toEqual({ value: 15, error: null });
      });

      it('multiplies positive and negative', () => {
        expect(calculate(5, -3, '×')).toEqual({ value: -15, error: null });
      });

      it('multiplies by zero', () => {
        expect(calculate(5, 0, '×')).toEqual({ value: 0, error: null });
      });

      it('handles large numbers', () => {
        expect(calculate(1000000, 1000000, '×')).toEqual({ value: 1000000000000, error: null });
      });
    });

    describe('division', () => {
      it('divides two positive numbers', () => {
        expect(calculate(6, 3, '÷')).toEqual({ value: 2, error: null });
      });

      it('divides positive by negative', () => {
        expect(calculate(6, -3, '÷')).toEqual({ value: -2, error: null });
      });

      it('returns error for division by zero', () => {
        expect(calculate(5, 0, '÷')).toEqual({
          value: 0,
          error: 'Cannot divide by zero',
        });
      });

      it('returns error for 0 / 0', () => {
        expect(calculate(0, 0, '÷')).toEqual({
          value: 0,
          error: 'Cannot divide by zero',
        });
      });

      it('handles 1 / 3 precision', () => {
        const result = calculate(1, 3, '÷');
        expect(result.error).toBeNull();
        expect(result.value).toBeCloseTo(0.333333333333, 10);
      });
    });
  });

  describe('fixFloatingPointPrecision', () => {
    it('fixes 0.1 + 0.2 precision issue', () => {
      expect(fixFloatingPointPrecision(0.30000000000000004)).toBe(0.3);
    });

    it('preserves accurate values', () => {
      expect(fixFloatingPointPrecision(3.14159)).toBe(3.14159);
    });

    it('handles integers', () => {
      expect(fixFloatingPointPrecision(42)).toBe(42);
    });

    it('handles zero', () => {
      expect(fixFloatingPointPrecision(0)).toBe(0);
    });
  });

  describe('formatDisplay', () => {
    it('formats zero', () => {
      expect(formatDisplay(0)).toBe('0');
    });

    it('formats positive integer', () => {
      expect(formatDisplay(42)).toBe('42');
    });

    it('formats negative integer', () => {
      expect(formatDisplay(-42)).toBe('-42');
    });

    it('formats decimal without trailing zeros', () => {
      expect(formatDisplay(3.14)).toBe('3.14');
    });

    it('formats very large numbers with scientific notation', () => {
      const result = formatDisplay(1e15);
      expect(result).toContain('e');
    });

    it('formats very small numbers with scientific notation', () => {
      const result = formatDisplay(1e-12);
      expect(result).toContain('e');
    });
  });

  describe('parseInput', () => {
    it('parses positive integer', () => {
      expect(parseInput('42')).toBe(42);
    });

    it('parses negative integer', () => {
      expect(parseInput('-42')).toBe(-42);
    });

    it('parses decimal', () => {
      expect(parseInput('3.14')).toBe(3.14);
    });

    it('returns 0 for empty string', () => {
      expect(parseInput('')).toBe(0);
    });

    it('returns 0 for just minus sign', () => {
      expect(parseInput('-')).toBe(0);
    });

    it('returns 0 for invalid input', () => {
      expect(parseInput('abc')).toBe(0);
    });
  });

  describe('toggleSign', () => {
    it('toggles positive to negative', () => {
      expect(toggleSign('42')).toBe('-42');
    });

    it('toggles negative to positive', () => {
      expect(toggleSign('-42')).toBe('42');
    });

    it('keeps zero as zero', () => {
      expect(toggleSign('0')).toBe('0');
    });

    it('handles empty string', () => {
      expect(toggleSign('')).toBe('0');
    });
  });

  describe('calculatePercent', () => {
    it('calculates 50 percent', () => {
      expect(calculatePercent(50)).toBe(0.5);
    });

    it('calculates 100 percent', () => {
      expect(calculatePercent(100)).toBe(1);
    });

    it('calculates 0 percent', () => {
      expect(calculatePercent(0)).toBe(0);
    });

    it('handles decimal percentages', () => {
      expect(calculatePercent(33.33)).toBeCloseTo(0.3333, 4);
    });
  });
});
