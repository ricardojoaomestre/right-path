import type { HighScoreEntry } from '../game/types';
import { DIFFICULTY_CONFIG } from '../game/config';

interface HighScoresTableProps {
  scores: HighScoreEntry[];
  currentScore?: number;
}

export function HighScoresTable({ scores, currentScore }: HighScoresTableProps) {
  if (scores.length === 0 && currentScore === undefined) {
    return (
      <p className="highscores-empty">No scores yet. Be the first!</p>
    );
  }

  return (
    <div className="highscores">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Score</th>
            <th>Path</th>
            <th>Tokens</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((entry, index) => (
            <tr key={entry.id}>
              <td>{index + 1}</td>
              <td className="score-cell">{entry.score.toLocaleString()}</td>
              <td>{entry.pathLength}</td>
              <td>{entry.tokensUsed}</td>
            </tr>
          ))}
          {currentScore !== undefined &&
            !scores.some((s) => s.score === currentScore) && (
              <tr className="highscores-current">
                <td>—</td>
                <td className="score-cell">{currentScore.toLocaleString()}</td>
                <td>—</td>
                <td>—</td>
              </tr>
            )}
        </tbody>
      </table>
    </div>
  );
}

export function HighScoresTitle({ difficulty }: { difficulty: string }) {
  const label =
    DIFFICULTY_CONFIG[difficulty as keyof typeof DIFFICULTY_CONFIG]?.label ??
    difficulty;
  return <h2 className="highscores-title">{label} High Scores</h2>;
}
