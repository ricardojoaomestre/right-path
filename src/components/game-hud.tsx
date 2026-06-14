import type { GamePhase } from '../game/types';

interface GameHudProps {
  score: number;
  progress: number;
  pathLength: number;
  pointsPerTile: number;
  tokensRemaining: number | 'infinite';
  tokensUsed: number;
  phase: GamePhase;
  entryLabel: string;
  exitLabel: string;
  revealProgress: number;
  memorizeSecondsLeft: number | null;
  isMemorizing: boolean;
  canUseToken: boolean;
  onUseToken: () => void;
}

export function GameHud({
  score,
  progress,
  pathLength,
  pointsPerTile,
  tokensRemaining,
  tokensUsed,
  phase,
  entryLabel,
  exitLabel,
  revealProgress,
  memorizeSecondsLeft,
  isMemorizing,
  canUseToken,
  onUseToken,
}: GameHudProps) {
  const tokensLabel =
    tokensRemaining === 'infinite' ? '∞' : String(tokensRemaining);

  const showTokenButton =
    tokensRemaining === 'infinite' ||
    (typeof tokensRemaining === 'number' && tokensRemaining > 0);

  const showStatusArea =
    phase === 'revealing' ||
    phase === 'tokenRevealing' ||
    phase === 'playing';

  const phaseLabel =
    isMemorizing
      ? 'Memorize the full path'
      : phase === 'revealing' || phase === 'tokenRevealing'
        ? phase === 'revealing'
          ? `Watch the path · step ${revealProgress}/${pathLength}`
          : `Path replay · step ${revealProgress}/${pathLength}`
        : phase === 'playing'
          ? `Trace from ${entryLabel} to ${exitLabel}`
          : '';

  return (
    <header className="hud">
      <div className="hud__route">
        <span className="hud__route-point hud__route-point--entry">
          <span className="hud__route-tag">Entry</span>
          <strong>{entryLabel || '—'}</strong>
        </span>
        <span className="hud__route-arrow" aria-hidden="true">
          →
        </span>
        <span className="hud__route-point hud__route-point--exit">
          <span className="hud__route-tag">Exit</span>
          <strong>{exitLabel || '—'}</strong>
        </span>
      </div>

      <div className="hud__stats">
        <div className="stat">
          <span className="stat__label">Score</span>
          <span className="stat__value">{score.toLocaleString()}</span>
        </div>
        <div className="stat">
          <span className="stat__label">Progress</span>
          <span className="stat__value">
            {progress}/{pathLength}
          </span>
        </div>
        <div className="stat">
          <span className="stat__label">Per tile</span>
          <span className="stat__value">{pointsPerTile}</span>
        </div>
        <div className="stat">
          <span className="stat__label">Tokens</span>
          <span className="stat__value">{tokensLabel}</span>
        </div>
      </div>

      {showStatusArea && (
        <div className="hud__status">
          {phaseLabel && (
            <p className={`hud__phase hud__phase--${phase}`}>{phaseLabel}</p>
          )}

          <div className="hud__status-body">
            <div
              className={`hud__countdown${isMemorizing ? ' hud__countdown--visible' : ''}`}
              aria-hidden={!isMemorizing}
              aria-live="polite"
            >
              <span className="hud__countdown-value">
                {memorizeSecondsLeft ?? 0}
              </span>
              <span className="hud__countdown-label">
                {memorizeSecondsLeft === 1 ? 'second left' : 'seconds left'}
              </span>
            </div>

            {phase === 'playing' && !isMemorizing && (
              <div className="hud__actions hud__actions--visible">
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
                    Use Token
                    {tokensUsed > 0 && (
                      <span className="btn__hint"> (−{tokensUsed} used)</span>
                    )}
                  </button>
                )}
                <p className="hud__hint">
                  Wrong tile = game over · Tap any tile to take a blind step
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
