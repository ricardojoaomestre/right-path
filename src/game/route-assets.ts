import type { Difficulty } from './types';

import easySpaceship from '../assets/spaceships/easy.png';
import mediumSpaceship from '../assets/spaceships/medium.png';
import hardSpaceship from '../assets/spaceships/hard.png';
import veryHardSpaceship from '../assets/spaceships/very-hard.png';

import easyPlanet from '../assets/planets/easy.png';
import mediumPlanet from '../assets/planets/medium.png';
import hardPlanet from '../assets/planets/hard.png';
import veryHardPlanet from '../assets/planets/very-hard.png';

export interface RouteAssets {
  start: string;
  end: string;
}

export const ROUTE_ASSETS: Record<Difficulty, RouteAssets> = {
  easy: {
    start: easySpaceship,
    end: easyPlanet,
  },
  medium: {
    start: mediumSpaceship,
    end: mediumPlanet,
  },
  hard: {
    start: hardSpaceship,
    end: hardPlanet,
  },
  veryHard: {
    start: veryHardSpaceship,
    end: veryHardPlanet,
  },
};

export function getRouteAssets(difficulty: Difficulty): RouteAssets {
  return ROUTE_ASSETS[difficulty];
}
