import type { CalculatorKeypadProps, Operator } from './types';
import { BUTTON_CONFIGS } from './constants';
import { CalculatorButton } from './CalculatorButton';
import styles from './Calculator.module.css';

/**
 * Calculator keypad component.
 * Renders the button grid and handles button click routing.
 */
export function CalculatorKeypad({
  onDigit,
  onOperator,
  onEquals,
  onClear,
  onToggleSign,
  onPercent,
  onDecimal,
  activeOperator,
}: CalculatorKeypadProps) {
  const handleButtonClick = (config: (typeof BUTTON_CONFIGS)[number]) => {
    switch (config.type) {
      case 'digit':
        if (config.value === '.') {
          onDecimal();
        } else {
          onDigit(config.value);
        }
        break;
      case 'operator':
        onOperator(config.value as Operator);
        break;
      case 'function':
        if (config.value === 'clear') {
          onClear();
        } else if (config.value === 'toggleSign') {
          onToggleSign();
        } else if (config.value === 'percent') {
          onPercent();
        }
        break;
      case 'equals':
        onEquals();
        break;
    }
  };

  return (
    <div className={styles.keypad} role="group" aria-label="Calculator keypad">
      {BUTTON_CONFIGS.map((config) => (
        <CalculatorButton
          key={config.label}
          config={config}
          onClick={() => handleButtonClick(config)}
          isActive={config.type === 'operator' && config.value === activeOperator}
        />
      ))}
    </div>
  );
}
