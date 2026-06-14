import type { Difficulty, DifficultyConfig } from './types';

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: {
    label: 'Easy',
    size: 8,
    revealTimeMs: 7000,
    revealStepMs: 150,
    tokenRevealTimeMs: 5500,
    tokens: 'infinite',
    basePoints: 10,
    tokenPenalty: 0.1,
  },
  medium: {
    label: 'Medium',
    size: 12,
    revealTimeMs: 5500,
    revealStepMs: 120,
    tokenRevealTimeMs: 4500,
    tokens: 'infinite',
    basePoints: 12,
    tokenPenalty: 0.12,
  },
  hard: {
    label: 'Hard',
    size: 16,
    revealTimeMs: 4500,
    revealStepMs: 95,
    tokenRevealTimeMs: 3500,
    tokens: 8,
    basePoints: 13,
    tokenPenalty: 0.17,
  },
  veryHard: {
    label: 'Very Hard',
    size: 20,
    revealTimeMs: 3500,
    revealStepMs: 70,
    tokenRevealTimeMs: 2500,
    tokens: 5,
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
