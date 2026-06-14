import type { Engine } from '@tsparticles/engine';
import { loadStarsPreset } from '@tsparticles/preset-stars';

export async function initStarsEngine(engine: Engine) {
  await loadStarsPreset(engine);
}
