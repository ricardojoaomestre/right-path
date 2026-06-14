import type { Difficulty, HighScoreEntry } from './types';

const STORAGE_KEY = 'right-path-highscores';
const MAX_ENTRIES = 20;

export function loadHighScores(): HighScoreEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HighScoreEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHighScore(entry: Omit<HighScoreEntry, 'id' | 'date'>): HighScoreEntry[] {
  const scores = loadHighScores();
  const newEntry: HighScoreEntry = {
    ...entry,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };

  const updated = [...scores, newEntry]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_ENTRIES);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function getHighScoresForDifficulty(
  difficulty: Difficulty,
): HighScoreEntry[] {
  return loadHighScores()
    .filter((entry) => entry.difficulty === difficulty)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}
