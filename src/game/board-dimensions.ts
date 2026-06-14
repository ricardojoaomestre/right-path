import { DIFFICULTY_CONFIG } from './config';
import type { Difficulty } from './types';

export interface BoardDimensions {
  cols: number;
  rows: number;
}

export const MOBILE_BOARD_BREAKPOINT = 767;

const MOBILE_PORTRAIT_BOARD: Record<Difficulty, BoardDimensions> = {
  easy: { cols: 8, rows: 10 },
  medium: { cols: 8, rows: 11 },
  hard: { cols: 8, rows: 12 },
  veryHard: { cols: 8, rows: 14 },
};

export function isMobileBoardViewport(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia(`(max-width: ${MOBILE_BOARD_BREAKPOINT}px)`).matches;
}

export function getBoardDimensions(
  difficulty: Difficulty,
  mobilePortrait = isMobileBoardViewport(),
): BoardDimensions {
  if (mobilePortrait) {
    return MOBILE_PORTRAIT_BOARD[difficulty];
  }

  const config = DIFFICULTY_CONFIG[difficulty];
  return { cols: config.cols, rows: config.rows };
}

export function formatBoardDimensions({ cols, rows }: BoardDimensions): string {
  return `${cols}×${rows}`;
}

const mobileBoardQuery =
  typeof window !== 'undefined'
    ? window.matchMedia(`(max-width: ${MOBILE_BOARD_BREAKPOINT}px)`)
    : null;

export function subscribeMobileBoardViewport(onStoreChange: () => void): () => void {
  if (!mobileBoardQuery) {
    return () => {};
  }

  mobileBoardQuery.addEventListener('change', onStoreChange);
  return () => mobileBoardQuery.removeEventListener('change', onStoreChange);
}
