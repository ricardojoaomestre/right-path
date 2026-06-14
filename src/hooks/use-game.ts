import { useCallback, useEffect, useRef, useState } from 'react';
import { formatCellLabel } from '../game/cell-labels';
import { getBoardDimensions } from '../game/board-dimensions';
import { DIFFICULTY_CONFIG, DEFAULT_DIFFICULTY } from '../game/config';
import { cellsEqual, generatePath } from '../game/path-generator';
import { calculateTileScore } from '../game/scoring';
import { getHighScoresForDifficulty, saveHighScore } from '../game/storage';
import type {
  Cell,
  Difficulty,
  GamePhase,
  HighScoreEntry,
} from '../game/types';

interface GameState {
  phase: GamePhase;
  difficulty: Difficulty;
  path: Cell[];
  progress: number;
  revealProgress: number;
  memorizeSecondsLeft: number | null;
  score: number;
  tokensRemaining: number | 'infinite';
  tokensUsed: number;
  highScores: HighScoreEntry[];
  showPath: boolean;
  wrongTile: Cell | null;
  boardCols: number;
  boardRows: number;
}

const WRONG_TILE_FLASH_MS = 2000;

const initialState: GameState = {
  phase: 'splash',
  difficulty: DEFAULT_DIFFICULTY,
  path: [],
  progress: 0,
  revealProgress: 0,
  memorizeSecondsLeft: null,
  score: 0,
  tokensRemaining: DIFFICULTY_CONFIG[DEFAULT_DIFFICULTY].tokens,
  tokensUsed: 0,
  highScores: [],
  showPath: false,
  wrongTile: null,
  boardCols: DIFFICULTY_CONFIG[DEFAULT_DIFFICULTY].cols,
  boardRows: DIFFICULTY_CONFIG[DEFAULT_DIFFICULTY].rows,
};

export function useGame() {
  const [state, setState] = useState<GameState>(initialState);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const config = DIFFICULTY_CONFIG[state.difficulty];

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  const setDifficulty = useCallback((difficulty: Difficulty) => {
    setState((prev) => ({
      ...prev,
      difficulty,
      tokensRemaining: DIFFICULTY_CONFIG[difficulty].tokens,
    }));
  }, []);

  const beginPathReveal = useCallback(
    (
      path: Cell[],
      holdMs: number,
      stepMs: number,
      onComplete: () => void,
    ) => {
      clearTimer();

      if (path.length === 0) {
        onComplete();
        return;
      }

      const holdFullPath = () => {
        const holdEndsAt = Date.now() + holdMs;

        setState((prev) => ({
          ...prev,
          memorizeSecondsLeft: Math.max(1, Math.ceil(holdMs / 1000)),
        }));

        intervalRef.current = setInterval(() => {
          const remaining = Math.max(
            0,
            Math.ceil((holdEndsAt - Date.now()) / 1000),
          );

          setState((prev) => ({
            ...prev,
            memorizeSecondsLeft: remaining > 0 ? remaining : null,
          }));
        }, 100);

        timeoutRef.current = setTimeout(() => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          setState((prev) => ({
            ...prev,
            memorizeSecondsLeft: null,
          }));
          onComplete();
        }, holdMs);
      };

      setState((prev) => ({
        ...prev,
        revealProgress: 1,
        showPath: true,
        memorizeSecondsLeft: null,
      }));

      if (path.length === 1) {
        holdFullPath();
        return;
      }

      intervalRef.current = setInterval(() => {
        setState((prev) => {
          const nextReveal = prev.revealProgress + 1;

          if (nextReveal >= path.length) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }

            holdFullPath();
            return { ...prev, revealProgress: path.length };
          }

          return { ...prev, revealProgress: nextReveal };
        });
      }, stepMs);
    },
    [clearTimer],
  );

  const startGame = useCallback(() => {
    clearTimer();
    const { cols, rows } = getBoardDimensions(state.difficulty);
    const path = generatePath(cols, rows, config.minTurns, config.maxTurns);

    setState((prev) => ({
      ...prev,
      phase: 'revealing',
      path,
      progress: 0,
      revealProgress: 0,
      memorizeSecondsLeft: null,
      score: 0,
      tokensRemaining: config.tokens,
      tokensUsed: 0,
      showPath: false,
      highScores: [],
      wrongTile: null,
      boardCols: cols,
      boardRows: rows,
    }));

    beginPathReveal(
      path,
      config.revealTimeMs,
      config.revealStepMs,
      () => {
        setState((prev) => ({
          ...prev,
          phase: 'playing',
          showPath: false,
          revealProgress: 0,
          memorizeSecondsLeft: null,
        }));
      },
    );
  }, [clearTimer, config, beginPathReveal, state.difficulty]);

  const finishTokenReveal = useCallback(() => {
    clearTimer();
    setState((prev) => ({
      ...prev,
      phase: 'playing',
      progress: 0,
      revealProgress: 0,
      memorizeSecondsLeft: null,
      showPath: false,
    }));
  }, [clearTimer]);

  const skipMemorize = useCallback(() => {
    clearTimer();
    setState((prev) => {
      const memorizing =
        prev.showPath &&
        prev.path.length > 0 &&
        prev.revealProgress >= prev.path.length &&
        prev.memorizeSecondsLeft !== null;

      if (!memorizing) {
        return prev;
      }

      if (prev.phase === 'tokenRevealing') {
        return {
          ...prev,
          phase: 'playing',
          progress: 0,
          revealProgress: 0,
          memorizeSecondsLeft: null,
          showPath: false,
        };
      }

      return {
        ...prev,
        phase: 'playing',
        revealProgress: 0,
        memorizeSecondsLeft: null,
        showPath: false,
      };
    });
  }, [clearTimer]);

  const useToken = useCallback(() => {
    if (state.phase !== 'playing') return;
    if (state.tokensRemaining === 0) return;

    clearTimer();

    const newTokensRemaining =
      state.tokensRemaining === 'infinite'
        ? 'infinite'
        : state.tokensRemaining - 1;

    const path = state.path;

    setState((prev) => ({
      ...prev,
      phase: 'tokenRevealing',
      tokensRemaining: newTokensRemaining,
      tokensUsed: prev.tokensUsed + 1,
      progress: 0,
      revealProgress: 0,
      memorizeSecondsLeft: null,
      showPath: false,
    }));

    beginPathReveal(
      path,
      config.tokenRevealTimeMs,
      config.revealStepMs,
      finishTokenReveal,
    );
  }, [
    state.phase,
    state.tokensRemaining,
    state.path,
    clearTimer,
    config,
    beginPathReveal,
    finishTokenReveal,
  ]);

  const handleTileClick = useCallback(
    (cell: Cell) => {
      if (state.phase !== 'playing') return;

      const expected = state.path[state.progress];
      if (!expected) return;

      const alreadyTraced = state.path
        .slice(0, state.progress)
        .some((traced) => cellsEqual(traced, cell));
      if (alreadyTraced) return;

      if (cellsEqual(cell, expected)) {
        const tileScore = calculateTileScore(config, state.tokensUsed);
        const newProgress = state.progress + 1;
        const isVictory = newProgress >= state.path.length;

        if (isVictory) {
          const finalScore = state.score + tileScore;
          saveHighScore({
            difficulty: state.difficulty,
            score: finalScore,
            tokensUsed: state.tokensUsed,
            pathLength: state.path.length,
          });

          setState((prev) => ({
            ...prev,
            phase: 'victory',
            progress: newProgress,
            score: finalScore,
            highScores: getHighScoresForDifficulty(prev.difficulty),
          }));
        } else {
          setState((prev) => ({
            ...prev,
            progress: newProgress,
            score: prev.score + tileScore,
          }));
        }
      } else {
        setState((prev) => ({
          ...prev,
          phase: 'wrongTile',
          wrongTile: cell,
        }));

        timeoutRef.current = setTimeout(() => {
          setState((prev) => ({
            ...prev,
            phase: 'gameover',
            wrongTile: null,
            highScores: getHighScoresForDifficulty(prev.difficulty),
          }));
        }, WRONG_TILE_FLASH_MS);
      }
    },
    [
      state.phase,
      state.path,
      state.progress,
      state.score,
      state.tokensUsed,
      state.difficulty,
      config,
    ],
  );

  const showDifficultyMenu = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase: 'menu',
    }));
  }, []);

  const returnToSplash = useCallback(() => {
    clearTimer();
    setState((prev) => ({
      ...initialState,
      difficulty: prev.difficulty,
      tokensRemaining: DIFFICULTY_CONFIG[prev.difficulty].tokens,
    }));
  }, [clearTimer]);

  const isCellHighlighted = useCallback(
    (cell: Cell): boolean => {
      if (state.showPath) {
        return state.path
          .slice(0, state.revealProgress)
          .some((p) => cellsEqual(p, cell));
      }

      if (
        state.phase === 'playing' ||
        state.phase === 'wrongTile' ||
        state.phase === 'gameover' ||
        state.phase === 'victory'
      ) {
        return state.path
          .slice(0, state.progress)
          .some((p) => cellsEqual(p, cell));
      }

      return false;
    },
    [state.showPath, state.path, state.revealProgress, state.progress, state.phase],
  );

  const isActiveRevealCell = useCallback(
    (cell: Cell): boolean => {
      if (!state.showPath || state.revealProgress === 0) {
        return false;
      }

      const active = state.path[state.revealProgress - 1];
      return active ? cellsEqual(cell, active) : false;
    },
    [state.showPath, state.path, state.revealProgress],
  );

  const isStartCell = useCallback(
    (cell: Cell): boolean => {
      const start = state.path[0];
      return start ? cellsEqual(cell, start) : false;
    },
    [state.path],
  );

  const isEndCell = useCallback(
    (cell: Cell): boolean => {
      const end = state.path[state.path.length - 1];
      return end ? cellsEqual(cell, end) : false;
    },
    [state.path],
  );

  const isWrongTile = useCallback(
    (cell: Cell): boolean => {
      return state.wrongTile ? cellsEqual(state.wrongTile, cell) : false;
    },
    [state.wrongTile],
  );

  const entryCell = state.path[0] ?? null;
  const exitCell = state.path[state.path.length - 1] ?? null;
  const entryLabel = entryCell ? formatCellLabel(entryCell) : '';
  const exitLabel = exitCell ? formatCellLabel(exitCell) : '';

  const isMemorizing =
    state.showPath &&
    state.path.length > 0 &&
    state.revealProgress >= state.path.length &&
    state.memorizeSecondsLeft !== null;

  const canUseToken =
    state.phase === 'playing' &&
    (state.tokensRemaining === 'infinite' ||
      (typeof state.tokensRemaining === 'number' && state.tokensRemaining > 0));

  const pointsPerTile = calculateTileScore(config, state.tokensUsed);

  return {
    ...state,
    config,
    entryLabel,
    exitLabel,
    entryCell,
    exitCell,
    setDifficulty,
    startGame,
    useToken,
    skipMemorize,
    handleTileClick,
    showDifficultyMenu,
    returnToSplash,
    isCellHighlighted,
    isActiveRevealCell,
    isStartCell,
    isEndCell,
    isWrongTile,
    isMemorizing,
    canUseToken,
    pointsPerTile,
  };
}
