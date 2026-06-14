import type { Cell } from './types';

export function colToLabel(col: number): string {
  let n = col;
  let label = '';

  do {
    label = String.fromCharCode(65 + (n % 26)) + label;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);

  return label;
}

export function formatCellLabel(cell: Cell): string {
  return `${colToLabel(cell.col)}${cell.row + 1}`;
}
