interface SplashScreenProps {
  onPlay: () => void;
}

export function SplashScreen({ onPlay }: SplashScreenProps) {
  return (
    <main className="screen screen--splash">
      <img
        className="splash-screen__art"
        src="/splash-screen.png"
        alt=""
        aria-hidden="true"
      />

      <div className="splash-screen__content">
        <div className="logo-block">
          <div className="logo-glow" aria-hidden="true" />
          <h1 className="title">Right Path</h1>
          <p className="tagline">Memorize. Trace. Survive.</p>
        </div>

        <button
          type="button"
          className="btn btn--primary btn--large"
          onClick={onPlay}
        >
          Play
        </button>
      </div>
    </main>
  );
}
