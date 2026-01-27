import type { CalculatorDisplayProps } from "./types";
import styles from "./Calculator.module.css";

/**
 * Calculator display component.
 * Shows the current expression and result, with error handling.
 */
export function CalculatorDisplay({
  value,
  expression,
  error,
}: CalculatorDisplayProps) {
  return (
    <div
      className={styles.display}
      role="region"
      aria-label="Calculator display"
    >
      {/* Expression display */}
      <div className={styles.expression} aria-live="polite">
        {expression || "\u00A0"}
      </div>

      {/* Main value display */}
      <div
        className={`${styles.value} ${error ? styles.errorValue : ""}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {error ? value : value}
      </div>

      {/* Error display */}
      {error && (
        <div className={styles.error} role="alert" aria-live="assertive">
          {error}
        </div>
      )}
    </div>
  );
}
