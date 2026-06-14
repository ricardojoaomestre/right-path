import { useGame } from './hooks/use-game';
import { GameBoard } from './components/game-board';
import { GameHud } from './components/game-hud';
import { DifficultySelect } from './components/difficulty-select';
import { SplashScreen } from './components/splash-screen';
import { StarsBackground } from './components/stars-background';
import {
  HighScoresTable,
  HighScoresTitle,
} from './components/high-scores-table';
import { getRouteAssets } from './game/route-assets';

function App() {
  const game = useGame();
  const routeAssets = getRouteAssets(game.difficulty);

  const showBoard =
    game.phase === 'revealing' ||
    game.phase === 'playing' ||
    game.phase === 'tokenRevealing' ||
    game.phase === 'wrongTile' ||
    game.phase === 'gameover' ||
    game.phase === 'victory';

  const boardDisabled =
    game.phase !== 'playing' || game.isMemorizing;

  const boardLocked =
    game.phase === 'revealing' ||
    game.phase === 'tokenRevealing' ||
    game.phase === 'wrongTile' ||
    game.phase === 'gameover' ||
    game.phase === 'victory' ||
    game.isMemorizing;

  return (
    <div className="app">
      <StarsBackground />
      <div className="scanlines" aria-hidden="true" />

      {game.phase === 'splash' && (
        <SplashScreen onPlay={game.showDifficultyMenu} />
      )}

      {game.phase === 'menu' && (
        <main className="screen screen--menu">
          <DifficultySelect
            value={game.difficulty}
            onChange={game.setDifficulty}
          />

          <button
            type="button"
            className="btn btn--primary btn--large"
            onClick={game.startGame}
          >
            Start Game
          </button>

          <p className="menu-hint">
            Watch the glowing path, then recreate it tile by tile from memory.
          </p>
        </main>
      )}

      {showBoard && (
        <main className="screen screen--game">
          <GameHud
            score={game.score}
            pathLength={game.path.length}
            tokensRemaining={game.tokensRemaining}
            phase={game.phase}
            startIcon={routeAssets.start}
            endIcon={routeAssets.end}
            entryLabel={game.entryLabel}
            exitLabel={game.exitLabel}
            revealProgress={game.revealProgress}
            memorizeSecondsLeft={game.memorizeSecondsLeft}
            isMemorizing={game.isMemorizing}
            canUseToken={game.canUseToken}
            onUseToken={game.useToken}
            onSkipMemorize={game.skipMemorize}
            onExit={game.returnToSplash}
          />

          <GameBoard
            cols={game.boardCols}
            rows={game.boardRows}
            routeAssets={routeAssets}
            startCell={game.entryCell}
            endCell={game.exitCell}
            pathVisible={
              game.showPath ||
              game.phase === 'playing' ||
              game.phase === 'wrongTile' ||
              game.phase === 'gameover' ||
              game.phase === 'victory'
            }
            locked={boardLocked}
            disabled={boardDisabled}
            isCellHighlighted={game.isCellHighlighted}
            isActiveRevealCell={game.isActiveRevealCell}
            isStartCell={game.isStartCell}
            isEndCell={game.isEndCell}
            isWrongTile={game.isWrongTile}
            onTileClick={game.handleTileClick}
          />
        </main>
      )}

      {game.phase === 'gameover' && (
        <div className="overlay overlay--result">
          <div className="modal">
            <h2 className="modal__title modal__title--fail">Game Over</h2>
            <p className="modal__score">
              Score: <strong>{game.score.toLocaleString()}</strong>
            </p>
            <p className="modal__detail">
              Wrong tile · {game.progress}/{game.path.length} tiles traced
            </p>

            <HighScoresTitle difficulty={game.difficulty} />
            <HighScoresTable scores={game.highScores} />

            <div className="modal__actions">
              <button
                type="button"
                className="btn btn--primary"
                onClick={game.startGame}
              >
                Try Again
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={game.returnToSplash}
              >
                Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {game.phase === 'victory' && (
        <div className="overlay overlay--result">
          <div className="modal modal--victory">
            <h2 className="modal__title modal__title--win">Path Complete</h2>
            <p className="modal__score modal__score--big">
              {game.score.toLocaleString()}
            </p>
            <p className="modal__detail">
              {game.path.length} tiles · {game.tokensUsed} tokens used
            </p>

            <HighScoresTitle difficulty={game.difficulty} />
            <HighScoresTable
              scores={game.highScores}
              currentScore={game.score}
            />

            <div className="modal__actions">
              <button
                type="button"
                className="btn btn--primary"
                onClick={game.startGame}
              >
                Play Again
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={game.returnToSplash}
              >
                Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
