import { useEffect, useCallback } from "react";
import { useCalculator } from "./useCalculator";
import { CalculatorDisplay } from "./CalculatorDisplay";
import { CalculatorKeypad } from "./CalculatorKeypad";
import { KEY_TO_OPERATOR } from "./constants";
import type { Operator } from "./types";
import styles from "./Calculator.module.css";

/**
 * Main Calculator component.
 * Handles keyboard events and orchestrates the calculator UI.
 */
export function Calculator() {
  const {
    display,
    expression,
    error,
    handleDigit,
    handleOperator,
    handleEquals,
    handleClear,
    handleToggleSign,
    handlePercent,
    handleDecimal,
    handleBackspace,
  } = useCalculator();

  // Extract the active operator from expression for button highlighting
  const activeOperator = expression.endsWith("+")
    ? "+"
    : expression.endsWith("−")
      ? "-"
      : expression.endsWith("×")
        ? "×"
        : expression.endsWith("÷")
          ? "÷"
          : null;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Prevent default for calculator keys to avoid conflicts
      const key = event.key;

      // Digits 0-9
      if (key >= "0" && key <= "9") {
        event.preventDefault();
        handleDigit(key);
        return;
      }

      // Operators
      const operator = KEY_TO_OPERATOR[key];
      if (operator) {
        event.preventDefault();
        handleOperator(operator);
        return;
      }

      // Equals
      if (key === "Enter" || key === "=") {
        event.preventDefault();
        handleEquals();
        return;
      }

      // Clear
      if (key === "Escape" || key === "Delete") {
        event.preventDefault();
        handleClear();
        return;
      }

      // Backspace
      if (key === "Backspace") {
        event.preventDefault();
        handleBackspace();
        return;
      }

      // Decimal
      if (key === ".") {
        event.preventDefault();
        handleDecimal();
        return;
      }

      // Percent
      if (key === "%") {
        event.preventDefault();
        handlePercent();
        return;
      }
    },
    [
      handleDigit,
      handleOperator,
      handleEquals,
      handleClear,
      handleBackspace,
      handleDecimal,
      handlePercent,
    ],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className={styles.calculator}
      role="application"
      aria-label="Calculator"
      tabIndex={0}
    >
      <CalculatorDisplay
        value={display}
        expression={expression}
        error={error}
      />
      <CalculatorKeypad
        onDigit={handleDigit}
        onOperator={handleOperator}
        onEquals={handleEquals}
        onClear={handleClear}
        onToggleSign={handleToggleSign}
        onPercent={handlePercent}
        onDecimal={handleDecimal}
        activeOperator={activeOperator as Operator | null}
      />
    </div>
  );
}
