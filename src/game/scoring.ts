import type { DifficultyConfig } from './types';

export function getPointsPerTile(
  config: DifficultyConfig,
  tokensUsed: number,
): number {
  const multiplier = Math.max(0.1, 1 - config.tokenPenalty * tokensUsed);
  return Math.max(1, Math.round(config.basePoints * multiplier));
}

export function calculateTileScore(
  config: DifficultyConfig,
  tokensUsed: number,
): number {
  return getPointsPerTile(config, tokensUsed);
}
