import type { Cell } from './types';

function cellKey(cell: Cell): string {
  return `${cell.row},${cell.col}`;
}

function cellsEqual(a: Cell, b: Cell): boolean {
  return a.row === b.row && a.col === b.col;
}

function direction(from: Cell, to: Cell): { row: number; col: number } | null {
  const row = to.row - from.row;
  const col = to.col - from.col;

  if (Math.abs(row) + Math.abs(col) !== 1) {
    return null;
  }

  return { row: Math.sign(row), col: Math.sign(col) };
}

function countTurns(path: Cell[]): number {
  if (path.length < 3) {
    return 0;
  }

  let turns = 0;

  for (let i = 2; i < path.length; i += 1) {
    const prevDir = direction(path[i - 2], path[i - 1]);
    const moveDir = direction(path[i - 1], path[i]);

    if (
      prevDir &&
      moveDir &&
      (moveDir.row !== prevDir.row || moveDir.col !== prevDir.col)
    ) {
      turns += 1;
    }
  }

  return turns;
}

function splitIntoSegments(total: number, parts: number, minPart: number): number[] | null {
  if (parts <= 0 || total < parts * minPart) {
    return null;
  }

  const lengths = Array(parts).fill(minPart);
  let remaining = total - parts * minPart;

  while (remaining > 0) {
    const index = Math.floor(Math.random() * parts);
    lengths[index] += 1;
    remaining -= 1;
  }

  return lengths;
}

function buildStructuredPath(
  size: number,
  startCol: number,
  endCol: number,
  targetTurns: number,
): Cell[] | null {
  const segmentCount = targetTurns + 1;
  const verticalSegmentCount = Math.ceil(segmentCount / 2);
  const horizontalSegmentCount = Math.floor(segmentCount / 2);

  const verticalLengths = splitIntoSegments(size - 1, verticalSegmentCount, 1);
  if (!verticalLengths) {
    return null;
  }

  const horizontalLengths: number[] = [];
  let colOffset = 0;

  for (let i = 0; i < horizontalSegmentCount; i += 1) {
    const isLast = i === horizontalSegmentCount - 1;
    const maxStep = Math.min(3, size - 1);

    if (isLast) {
      const needed = endCol - (startCol + colOffset);
      if (Math.abs(needed) > maxStep * (horizontalSegmentCount - i)) {
        return null;
      }
      horizontalLengths.push(needed);
    } else {
      let step = 0;
      let attempts = 0;

      while (step === 0 && attempts < 10) {
        step = Math.floor(Math.random() * (maxStep * 2 + 1)) - maxStep;
        attempts += 1;
      }

      if (step === 0) {
        step = Math.random() < 0.5 ? -1 : 1;
      }

      horizontalLengths.push(step);
    }

    colOffset += horizontalLengths[i];
  }

  let projectedCol = startCol;
  for (const step of horizontalLengths) {
    projectedCol += step;
    if (projectedCol < 0 || projectedCol >= size) {
      return null;
    }
  }

  const path: Cell[] = [{ row: 0, col: startCol }];
  const visited = new Set([cellKey(path[0])]);
  let row = 0;
  let col = startCol;
  let verticalIndex = 0;
  let horizontalIndex = 0;

  for (let segment = 0; segment < segmentCount; segment += 1) {
    const isVertical = segment % 2 === 0;

    if (isVertical) {
      const length = verticalLengths[verticalIndex];
      verticalIndex += 1;

      for (let step = 0; step < length; step += 1) {
        row += 1;
        if (row >= size) {
          return null;
        }

        const cell = { row, col };
        const key = cellKey(cell);
        if (visited.has(key)) {
          return null;
        }

        path.push(cell);
        visited.add(key);
      }
    } else {
      const length = horizontalLengths[horizontalIndex];
      horizontalIndex += 1;
      const dir = Math.sign(length);

      for (let step = 0; step < Math.abs(length); step += 1) {
        col += dir;
        if (col < 0 || col >= size) {
          return null;
        }

        const cell = { row, col };
        const key = cellKey(cell);
        if (visited.has(key)) {
          return null;
        }

        path.push(cell);
        visited.add(key);
      }
    }
  }

  if (row !== size - 1 || col !== endCol) {
    return null;
  }

  return path;
}

function buildSimplePath(size: number, startCol: number, endCol: number): Cell[] {
  const path: Cell[] = [{ row: 0, col: startCol }];
  let row = 0;
  let col = startCol;

  while (row < size - 1) {
    row += 1;
    path.push({ row, col });
  }

  while (col !== endCol) {
    col += Math.sign(endCol - col);
    path.push({ row, col });
  }

  return path;
}

function buildFallbackPath(size: number, minTurns: number): Cell[] {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const startCol = Math.floor(Math.random() * size);
    const endCol = Math.floor(Math.random() * size);
    const targetTurns = minTurns + Math.floor(Math.random() * 2);
    const path = buildStructuredPath(size, startCol, endCol, targetTurns);

    if (path && countTurns(path) >= minTurns) {
      return path;
    }
  }

  const startCol = Math.floor(Math.random() * size);
  const endCol = Math.max(0, Math.min(size - 1, startCol + (Math.random() < 0.5 ? -1 : 1)));
  const path = buildStructuredPath(size, startCol, endCol, Math.max(minTurns, 1));

  if (path) {
    return path;
  }

  return buildSimplePath(size, startCol, endCol);
}

function turnCountDistance(
  turns: number,
  minTurns: number,
  maxTurns: number,
): number {
  if (turns >= minTurns && turns <= maxTurns) {
    return 0;
  }

  if (turns < minTurns) {
    return minTurns - turns;
  }

  return turns - maxTurns;
}

export function generatePath(
  size: number,
  minTurns: number,
  maxTurns: number,
): Cell[] {
  const targetTurns =
    minTurns + Math.floor(Math.random() * (maxTurns - minTurns + 1));

  let bestPath: Cell[] | null = null;
  let bestTurnDistance = Number.POSITIVE_INFINITY;

  for (let attempt = 0; attempt < 80; attempt += 1) {
    const startCol = Math.floor(Math.random() * size);
    const endCol = Math.floor(Math.random() * size);
    const path = buildStructuredPath(size, startCol, endCol, targetTurns);

    if (!path) {
      continue;
    }

    const turns = countTurns(path);
    const turnDistance = turnCountDistance(turns, minTurns, maxTurns);

    if (turnDistance < bestTurnDistance) {
      bestTurnDistance = turnDistance;
      bestPath = path;
    }

    if (turnDistance === 0) {
      break;
    }
  }

  if (bestPath) {
    return bestPath;
  }

  return buildFallbackPath(size, minTurns);
}

export { cellsEqual, countTurns };
