# Right Path

**Memorize. Trace. Survive.**

Right Path is a memory puzzle game with a retro-futuristic aesthetic. Watch a glowing path snake across a grid, memorize it, then recreate the route tile by tile — one wrong step ends the run.

## How to Play

1. **Choose a difficulty** — grid size, reveal time, and token limits scale with each level.
2. **Watch the reveal** — the path animates from the entry tile (top row) to the exit tile (bottom row).
3. **Memorize** — after the full path is shown, you get a few seconds to commit it to memory.
4. **Trace blind** — tap tiles in the correct order without seeing the path. Your progress is shown, but future steps are hidden.
5. **Use tokens wisely** — spend a token to replay the path. Each token reduces your per-tile score.
6. **Win or lose** — complete the path for a high score, or hit a wrong tile for instant game over.

## Difficulty Levels

| Level | Grid | Tokens | Notes |
|-------|------|--------|-------|
| Easy | 8×8 | ∞ | Longer reveal, forgiving scoring |
| Medium | 12×12 | ∞ | Default challenge |
| Hard | 16×16 | 8 | Tighter reveal window |
| Very Hard | 20×20 | 5 | Largest grid, fewest tokens |

High scores are saved per difficulty in your browser's local storage.

## Scoring

- Points are awarded for each correct tile.
- Using tokens applies a penalty multiplier — fewer tokens means a higher score.
- Harder difficulties offer more base points per tile, but also steeper token penalties.

## Screenshots

### Main Menu

![Main menu with difficulty selection](docs/screenshots/menu.png)

### Path Reveal

![Full path shown during the memorization phase](docs/screenshots/path-reveal.png)

### Gameplay

![Tracing the path from entry to exit](docs/screenshots/gameplay.png)

### Victory

![Path complete screen with score and high scores](docs/screenshots/victory.png)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Other Scripts

```bash
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for dev and build tooling
- CSS custom properties for the neon terminal look
- Local storage for high-score persistence
