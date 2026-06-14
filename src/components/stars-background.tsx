import { useCallback, useEffect, useMemo, useRef } from 'react';
import Particles from '@tsparticles/react';
import type { Container, ISourceOptions } from '@tsparticles/engine';
import { useDeviceTilt } from '../hooks/use-device-tilt';

const TILT_FORCE = 0.018;
const VELOCITY_DAMPING = 0.992;

export function StarsBackground() {
  const containerRef = useRef<Container | null>(null);
  const tiltRef = useDeviceTilt();

  const particlesLoaded = useCallback(async (container?: Container) => {
    containerRef.current = container ?? null;
  }, []);

  const options = useMemo<ISourceOptions>(
    () => ({
      preset: 'stars',
      fullScreen: {
        enable: true,
        zIndex: 0,
      },
      background: {
        color: 'transparent',
      },
      fpsLimit: 60,
      detectRetina: true,
      particles: {
        number: {
          value: 140,
        },
        move: {
          enable: true,
          speed: 0.12,
          random: true,
        },
      },
    }),
    [],
  );

  useEffect(() => {
    let frame = 0;

    const tick = () => {
      const container = containerRef.current;

      if (container && !container.destroyed) {
        const { x, y } = tiltRef.current;
        const count = container.particles.count;

        for (let i = 0; i < count; i++) {
          const particle = container.particles.get(i);

          if (!particle) {
            continue;
          }

          particle.velocity.x += x * TILT_FORCE;
          particle.velocity.y += y * TILT_FORCE;
          particle.velocity.multTo(VELOCITY_DAMPING);
        }
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [tiltRef]);

  return (
    <Particles
      id="stars-background"
      className="stars-background"
      options={options}
      particlesLoaded={particlesLoaded}
    />
  );
}
