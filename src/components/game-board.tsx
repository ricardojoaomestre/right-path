import { useMemo } from 'react';
import { colToLabel } from '../game/cell-labels';
import type { Cell } from '../game/types';
import type { RouteAssets } from '../game/route-assets';
import { Tile } from './tile';

interface GameBoardProps {
  size: number;
  routeAssets: RouteAssets;
  startCell: Cell | null;
  endCell: Cell | null;
  pathVisible: boolean;
  locked: boolean;
  disabled: boolean;
  isCellHighlighted: (cell: Cell) => boolean;
  isActiveRevealCell: (cell: Cell) => boolean;
  isStartCell: (cell: Cell) => boolean;
  isEndCell: (cell: Cell) => boolean;
  isWrongTile: (cell: Cell) => boolean;
  onTileClick: (cell: Cell) => void;
}

export function GameBoard({
  size,
  routeAssets,
  startCell,
  endCell,
  pathVisible,
  locked,
  disabled,
  isCellHighlighted,
  isActiveRevealCell,
  isStartCell,
  isEndCell,
  isWrongTile,
  onTileClick,
}: GameBoardProps) {
  const tiles = useMemo(() => {
    const result: Cell[] = [];
    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        result.push({ row, col });
      }
    }
    return result;
  }, [size]);

  const colLabels = useMemo(
    () => Array.from({ length: size }, (_, col) => colToLabel(col)),
    [size],
  );

  const rowLabels = useMemo(
    () => Array.from({ length: size }, (_, row) => String(row + 1)),
    [size],
  );

  const boardClass = pathVisible ? 'board board--path-visible' : 'board';
  const markersClass = pathVisible
    ? 'board-with-markers board-with-markers--path-visible'
    : 'board-with-markers';

  return (
    <div className={`board-scroll${locked ? ' board-scroll--locked' : ''}`}>
      <div
        className={`board-frame${pathVisible ? ' board-frame--path-visible' : ''}`}
        style={{ ['--grid-size' as string]: size }}
      >
        <div className="board-corner" aria-hidden="true" />
        <div
          className="board-col-labels"
          aria-hidden="true"
        >
          {colLabels.map((label) => (
            <span key={label} className="board-axis-label">
              {label}
            </span>
          ))}
        </div>
        <div
          className="board-row-labels"
          aria-hidden="true"
        >
          {rowLabels.map((label) => (
            <span key={label} className="board-axis-label">
              {label}
            </span>
          ))}
        </div>
        <div
          className={markersClass}
          style={{
            ['--start-col' as string]: startCell?.col ?? 0,
            ['--end-col' as string]: endCell?.col ?? 0,
          }}
        >
          {startCell && (
            <img
              className="route-marker route-marker--start"
              src={routeAssets.start}
              alt="Entry spaceship"
            />
          )}
          <div className={boardClass}>
            {tiles.map((cell) => {
              const highlighted = isCellHighlighted(cell);
              return (
                <Tile
                  key={`${cell.row}-${cell.col}`}
                  cell={cell}
                  highlighted={highlighted}
                  activeReveal={isActiveRevealCell(cell)}
                  isStart={isStartCell(cell)}
                  isEnd={isEndCell(cell)}
                  isWrong={isWrongTile(cell)}
                  disabled={disabled || highlighted}
                  onClick={onTileClick}
                />
              );
            })}
          </div>
          {endCell && (
            <img
              className="route-marker route-marker--end"
              src={routeAssets.end}
              alt="Exit planet"
            />
          )}
        </div>
      </div>
    </div>
  );
}
