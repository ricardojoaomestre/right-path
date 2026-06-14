import { memo } from 'react';
import { formatCellLabel } from '../game/cell-labels';
import type { Cell } from '../game/types';

interface TileProps {
  cell: Cell;
  highlighted: boolean;
  activeReveal: boolean;
  isStart: boolean;
  isEnd: boolean;
  isWrong: boolean;
  disabled: boolean;
  onClick: (cell: Cell) => void;
}

export const Tile = memo(function Tile({
  cell,
  highlighted,
  activeReveal,
  isStart,
  isEnd,
  isWrong,
  disabled,
  onClick,
}: TileProps) {
  const classes = ['tile'];
  if (highlighted) classes.push('tile--highlighted');
  if (activeReveal) classes.push('tile--active-reveal');
  if (isWrong) classes.push('tile--wrong');
  if (isStart) classes.push('tile--start');
  if (isEnd) classes.push('tile--end');

  const label = formatCellLabel(cell);

  return (
    <button
      type="button"
      className={classes.join(' ')}
      disabled={disabled}
      onClick={() => onClick(cell)}
      aria-label={
        isStart
          ? `Entry tile ${label}`
          : isEnd
            ? `Exit tile ${label}`
            : `Tile ${label}`
      }
    >
      {(isStart || isEnd) && (
        <span className="tile__marker" aria-hidden="true">
          <span className="tile__marker-coord">{label}</span>
        </span>
      )}
    </button>
  );
});
