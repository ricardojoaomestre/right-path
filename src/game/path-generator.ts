import type { Cell } from './types';

function cellKey(cell: Cell): string {
  return `${cell.row},${cell.col}`;
}

function cellsEqual(a: Cell, b: Cell): boolean {
  return a.row === b.row && a.col === b.col;
}

function neighbors(cell: Cell, size: number): Cell[] {
  const result: Cell[] = [];
  const dirs = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
  ];

  for (const dir of dirs) {
    const next = { row: cell.row + dir.row, col: cell.col + dir.col };
    if (
      next.row >= 0 &&
      next.row < size &&
      next.col >= 0 &&
      next.col < size
    ) {
      result.push(next);
    }
  }

  return result;
}

type Direction = { row: number; col: number };

function direction(from: Cell, to: Cell): Direction | null {
  const row = to.row - from.row;
  const col = to.col - from.col;

  if (Math.abs(row) + Math.abs(col) !== 1) {
    return null;
  }

  return { row: Math.sign(row), col: Math.sign(col) };
}

function isAdjacent(a: Cell, b: Cell): boolean {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1;
}

function scoreMove(
  cell: Cell,
  current: Cell,
  previous: Cell | null,
  path: Cell[],
  endCol: number,
  size: number,
): number {
  let score = (size - 1 - cell.row) * -2;
  score += Math.abs(endCol - cell.col);

  const moveDir = direction(current, cell);

  if (previous && moveDir) {
    const prevDir = direction(previous, current);

    if (prevDir) {
      if (moveDir.row === -prevDir.row && moveDir.col === -prevDir.col) {
        score += 60;
      }

      if (moveDir.row === prevDir.row && moveDir.col === prevDir.col) {
        score -= 10;
      }
    }
  }

  for (let i = 0; i < path.length - 1; i += 1) {
    const pathCell = path[i];
    if (cellsEqual(pathCell, current)) continue;
    if (isAdjacent(cell, pathCell)) {
      score += 20;
    }
  }

  score += Math.random() * 2;
  return score;
}

function pickNextCell(
  current: Cell,
  previous: Cell | null,
  path: Cell[],
  visited: Set<string>,
  endCol: number,
  size: number,
  preferDown: boolean,
): Cell | null {
  const candidates = neighbors(current, size)
    .filter((cell) => !visited.has(cellKey(cell)))
    .sort(
      (a, b) => scoreMove(a, current, previous, path, endCol, size) -
        scoreMove(b, current, previous, path, endCol, size),
    );

  if (candidates.length === 0) {
    return null;
  }

  const poolSize = Math.min(preferDown ? 2 : 3, candidates.length);
  const pickIndex = Math.floor(Math.random() * poolSize);
  return candidates[pickIndex];
}

function buildPath(size: number): Cell[] | null {
  const startCol = Math.floor(Math.random() * size);
  const endCol = Math.floor(Math.random() * size);

  const path: Cell[] = [{ row: 0, col: startCol }];
  const visited = new Set([cellKey(path[0])]);
  let current = path[0];
  let previous: Cell | null = null;

  const maxSteps = size * size * 2;
  let steps = 0;

  while (
    (current.row !== size - 1 || current.col !== endCol) &&
    steps < maxSteps
  ) {
    const preferDown = current.row < size - 1;
    const next = pickNextCell(
      current,
      previous,
      path,
      visited,
      endCol,
      size,
      preferDown,
    );

    if (!next) {
      break;
    }

    path.push(next);
    visited.add(cellKey(next));
    previous = current;
    current = next;
    steps += 1;
  }

  let safety = size * size;
  while ((current.row !== size - 1 || current.col !== endCol) && safety > 0) {
    safety -= 1;

    const next = pickNextCell(
      current,
      previous,
      path,
      visited,
      endCol,
      size,
      true,
    );

    if (!next) {
      return null;
    }

    path.push(next);
    visited.add(cellKey(next));
    previous = current;
    current = next;
  }

  if (current.row !== size - 1 || current.col !== endCol) {
    return null;
  }

  return path;
}

function pathAdjacencyPenalty(path: Cell[]): number {
  let penalty = 0;

  for (let i = 1; i < path.length; i += 1) {
    const prevDir = i >= 2 ? direction(path[i - 2], path[i - 1]) : null;
    const moveDir = direction(path[i - 1], path[i]);

    if (prevDir && moveDir) {
      if (moveDir.row === -prevDir.row && moveDir.col === -prevDir.col) {
        penalty += 3;
      }
    }

    for (let j = 0; j < i - 1; j += 1) {
      if (isAdjacent(path[i], path[j])) {
        penalty += 1;
      }
    }
  }

  return penalty;
}

export function generatePath(size: number): Cell[] {
  let bestPath: Cell[] | null = null;
  let bestPenalty = Number.POSITIVE_INFINITY;

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const path = buildPath(size);
    if (!path) continue;

    const penalty = pathAdjacencyPenalty(path);
    if (penalty < bestPenalty) {
      bestPenalty = penalty;
      bestPath = path;
    }

    if (penalty === 0) {
      break;
    }
  }

  if (bestPath) {
    return bestPath;
  }

  const fallbackCol = Math.floor(Math.random() * size);
  const fallback: Cell[] = [{ row: 0, col: fallbackCol }];

  for (let row = 1; row < size; row += 1) {
    fallback.push({ row, col: fallbackCol });
  }

  return fallback;
}

export { cellsEqual };
