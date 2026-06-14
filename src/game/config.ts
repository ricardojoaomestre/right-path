import type { Difficulty, DifficultyConfig } from './types';

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: {
    label: 'Easy',
    size: 8,
    minTurns: 1,
    maxTurns: 3,
    revealTimeMs: 7000,
    revealStepMs: 150,
    tokenRevealTimeMs: 5500,
    tokens: 'infinite',
    basePoints: 10,
    tokenPenalty: 0.1,
  },
  medium: {
    label: 'Medium',
    size: 8,
    minTurns: 3,
    maxTurns: 6,
    revealTimeMs: 3500,
    revealStepMs: 120,
    tokenRevealTimeMs: 4500,
    tokens: 3,
    basePoints: 12,
    tokenPenalty: 0.12,
  },
  hard: {
    label: 'Hard',
    size: 10,
    minTurns: 6,
    maxTurns: 12,
    revealTimeMs: 2500,
    revealStepMs: 95,
    tokenRevealTimeMs: 3500,
    tokens: 1,
    basePoints: 13,
    tokenPenalty: 0.17,
  },
  veryHard: {
    label: 'Very Hard',
    size: 10,
    minTurns: 10,
    maxTurns: 15,
    revealTimeMs: 1500,
    revealStepMs: 70,
    tokenRevealTimeMs: 2500,
    tokens: 0,
    basePoints: 15,
    tokenPenalty: 0.2,
  },
};

export const DEFAULT_DIFFICULTY: Difficulty = 'medium';

export const DIFFICULTY_ORDER: Difficulty[] = [
  'easy',
  'medium',
  'hard',
  'veryHard',
];
