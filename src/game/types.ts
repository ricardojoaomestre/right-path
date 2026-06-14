export type Difficulty = 'easy' | 'medium' | 'hard' | 'veryHard';

export type GamePhase =
  | 'splash'
  | 'menu'
  | 'revealing'
  | 'playing'
  | 'tokenRevealing'
  | 'wrongTile'
  | 'gameover'
  | 'victory';

export interface Cell {
  row: number;
  col: number;
}

export interface DifficultyConfig {
  label: string;
  size: number;
  minTurns: number;
  maxTurns: number;
  revealTimeMs: number;
  revealStepMs: number;
  tokenRevealTimeMs: number;
  tokens: number | 'infinite';
  basePoints: number;
  tokenPenalty: number;
}

export interface HighScoreEntry {
  id: string;
  difficulty: Difficulty;
  score: number;
  tokensUsed: number;
  pathLength: number;
  date: string;
}

export interface GameSnapshot {
  difficulty: Difficulty;
  path: Cell[];
  progress: number;
  score: number;
  tokensRemaining: number | 'infinite';
  tokensUsed: number;
  phase: GamePhase;
}
