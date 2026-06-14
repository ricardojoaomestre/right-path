import type { GamePhase } from '../game/types';

interface GameHudProps {
  score: number;
  pathLength: number;
  tokensRemaining: number | 'infinite';
  phase: GamePhase;
  startIcon: string;
  endIcon: string;
  entryLabel: string;
  exitLabel: string;
  revealProgress: number;
  memorizeSecondsLeft: number | null;
  isMemorizing: boolean;
  canUseToken: boolean;
  onUseToken: () => void;
  onExit: () => void;
}

export function GameHud({
  score,
  pathLength,
  tokensRemaining,
  phase,
  startIcon,
  endIcon,
  entryLabel,
  exitLabel,
  revealProgress,
  memorizeSecondsLeft,
  isMemorizing,
  canUseToken,
  onUseToken,
  onExit,
}: GameHudProps) {
  const tokensLabel =
    tokensRemaining === 'infinite' ? '∞' : String(tokensRemaining);

  const showTokenButton =
    phase === 'playing' &&
    !isMemorizing &&
    (tokensRemaining === 'infinite' ||
      (typeof tokensRemaining === 'number' && tokensRemaining > 0));

  const showExitButton =
    phase === 'revealing' ||
    phase === 'playing' ||
    phase === 'tokenRevealing';

  const showStatusArea =
    phase === 'revealing' ||
    phase === 'tokenRevealing' ||
    phase === 'playing';

  const phaseLabel = isMemorizing
    ? 'Memorize the full path'
    : phase === 'revealing' || phase === 'tokenRevealing'
      ? phase === 'revealing'
        ? `Watch the path · step ${revealProgress}/${pathLength}`
        : `Path replay · step ${revealProgress}/${pathLength}`
      : '';

  return (
    <header className="hud">
      <div className="hud__route">
        {isMemorizing ? (
          <div className="hud__countdown" aria-live="polite">
            <span className="hud__countdown-value">
              {memorizeSecondsLeft ?? 0}
            </span>
            <span className="hud__countdown-label">
              {memorizeSecondsLeft === 1 ? 'second left' : 'seconds left'}
            </span>
          </div>
        ) : (
          <>
            <span className="hud__route-point hud__route-point--entry">
              <img
                className="hud__route-icon hud__route-icon--start"
                src={startIcon}
                alt=""
              />
              <span className="hud__route-tag">Entry</span>
              <strong>{entryLabel || '—'}</strong>
            </span>
            <span className="hud__route-arrow" aria-hidden="true">
              →
            </span>
            <span className="hud__route-point hud__route-point--exit">
              <img
                className="hud__route-icon hud__route-icon--end"
                src={endIcon}
                alt=""
              />
              <span className="hud__route-tag">Exit</span>
              <strong>{exitLabel || '—'}</strong>
            </span>
          </>
        )}
      </div>

      <div className="hud__toolbar">
        {showTokenButton && (
          <button
            type="button"
            className="btn btn--token"
            disabled={!canUseToken}
            aria-disabled={!canUseToken}
            onClick={() => {
              if (!canUseToken) return;
              onUseToken();
            }}
          >
            Use Token ({tokensLabel})
          </button>
        )}

        {showExitButton && (
          <button
            type="button"
            className="btn btn--exit"
            onClick={onExit}
          >
            Exit
          </button>
        )}

        <div className="hud__score">
          <span className="hud__score-label">Score</span>
          <span className="hud__score-value">{score.toLocaleString()}</span>
        </div>
      </div>

      {showStatusArea && phaseLabel && (
        <div className="hud__status">
          <p className={`hud__phase hud__phase--${phase}`}>{phaseLabel}</p>
        </div>
      )}
    </header>
  );
}
