import type { CalculatorButtonProps } from './types';
import styles from './Calculator.module.css';

/**
 * Individual calculator button component.
 * Handles different button types (digit, operator, function, equals) with appropriate styling.
 */
export function CalculatorButton({
  config,
  onClick,
  isActive = false,
  disabled = false,
}: CalculatorButtonProps) {
  const buttonClasses = [
    styles.button,
    styles[config.type],
    config.span === 2 ? styles.wide : '',
    isActive ? styles.active : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      aria-label={config.ariaLabel}
      aria-pressed={isActive ? 'true' : undefined}
      style={config.span === 2 ? { gridColumn: 'span 2' } : undefined}
    >
      {config.label}
    </button>
  );
}
