import { useSyncExternalStore } from 'react';
import type { Difficulty } from '../game/types';
import {
  formatBoardDimensions,
  getBoardDimensions,
  isMobileBoardViewport,
  subscribeMobileBoardViewport,
} from '../game/board-dimensions';
import { DIFFICULTY_CONFIG, DIFFICULTY_ORDER } from '../game/config';

interface DifficultySelectProps {
  value: Difficulty;
  onChange: (difficulty: Difficulty) => void;
}

export function DifficultySelect({ value, onChange }: DifficultySelectProps) {
  const isMobileBoard = useSyncExternalStore(
    subscribeMobileBoardViewport,
    isMobileBoardViewport,
    () => false,
  );

  return (
    <div className="difficulty-select">
      <span className="label">Difficulty</span>
      <div className="difficulty-options" role="radiogroup" aria-label="Difficulty">
        {DIFFICULTY_ORDER.map((key) => {
          const config = DIFFICULTY_CONFIG[key];
          const tokensLabel =
            config.tokens === 'infinite'
              ? '∞ tokens'
              : config.tokens === 0
                ? 'No tokens'
                : `${config.tokens} tokens`;

          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={value === key}
              className={`difficulty-option${value === key ? ' difficulty-option--active' : ''}`}
              onClick={() => onChange(key)}
            >
              <span className="difficulty-option__name">{config.label}</span>
              <span className="difficulty-option__meta">
                {formatBoardDimensions(getBoardDimensions(key, isMobileBoard))} ·{' '}
                {tokensLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
