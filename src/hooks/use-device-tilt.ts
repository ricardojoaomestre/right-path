import { useEffect, useRef } from 'react';

export interface DeviceTilt {
  x: number;
  y: number;
}

const GRAVITY = 9.81;
const SMOOTHING = 0.12;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

async function requestMotionPermission() {
  const orientationEvent = DeviceOrientationEvent as typeof DeviceOrientationEvent & {
    requestPermission?: () => Promise<'granted' | 'denied'>;
  };

  if (typeof orientationEvent.requestPermission !== 'function') {
    return true;
  }

  const result = await orientationEvent.requestPermission();
  return result === 'granted';
}

export function useDeviceTilt() {
  const tiltRef = useRef<DeviceTilt>({ x: 0, y: 0 });
  const smoothed = useRef<DeviceTilt>({ x: 0, y: 0 });
  const permissionRequested = useRef(false);
  const listening = useRef(false);

  useEffect(() => {
    const supportsMotion =
      typeof window !== 'undefined' && 'DeviceMotionEvent' in window;

    if (!supportsMotion) {
      return;
    }

    const applyTilt = (x: number, y: number) => {
      smoothed.current = {
        x: smoothed.current.x + (x - smoothed.current.x) * SMOOTHING,
        y: smoothed.current.y + (y - smoothed.current.y) * SMOOTHING,
      };

      tiltRef.current = {
        x: clamp(smoothed.current.x, -1, 1),
        y: clamp(smoothed.current.y, -1, 1),
      };
    };

    const handleMotion = (event: DeviceMotionEvent) => {
      const acceleration =
        event.accelerationIncludingGravity ?? event.acceleration;

      if (!acceleration) {
        return;
      }

      applyTilt(
        clamp((acceleration.x ?? 0) / GRAVITY, -1, 1),
        clamp((acceleration.y ?? 0) / GRAVITY, -1, 1),
      );
    };

    const startListening = () => {
      if (listening.current) {
        return;
      }

      listening.current = true;
      window.addEventListener('devicemotion', handleMotion, { passive: true });
    };

    const enableSensors = async () => {
      if (permissionRequested.current) {
        return;
      }

      permissionRequested.current = true;

      try {
        const granted = await requestMotionPermission();
        if (granted) {
          startListening();
        }
      } catch {
        permissionRequested.current = false;
      }
    };

    const handleGesture = () => {
      void enableSensors();
    };

    window.addEventListener('pointerdown', handleGesture, { once: true });
    window.addEventListener('touchstart', handleGesture, { once: true });

    if (!('requestPermission' in DeviceOrientationEvent)) {
      startListening();
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
    };
  }, []);

  return tiltRef;
}
