import { Position, Formation } from '../types';

export const POSITIONS: Position[] = [
  'GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'ST',
];

export const FORMATIONS: Record<Formation, Position[]> = {
  '4-4-2': ['GK', 'LB', 'CB', 'CB', 'RB', 'LM', 'CM', 'CM', 'RM', 'ST', 'ST'],
  '4-3-3': ['GK', 'LB', 'CB', 'CB', 'RB', 'CM', 'CM', 'CM', 'LW', 'ST', 'RW'],
  '4-2-3-1': ['GK', 'LB', 'CB', 'CB', 'RB', 'CDM', 'CDM', 'LW', 'CAM', 'RW', 'ST'],
  '3-5-2': ['GK', 'CB', 'CB', 'CB', 'LM', 'CM', 'CDM', 'CM', 'RM', 'ST', 'ST'],
  '5-3-2': ['GK', 'LB', 'CB', 'CB', 'CB', 'RB', 'CM', 'CM', 'CM', 'ST', 'ST'],
};

export const POSITION_GROUPS: Record<Position, 'goalkeeper' | 'defense' | 'midfield' | 'attack'> = {
  GK: 'goalkeeper',
  CB: 'defense',
  LB: 'defense',
  RB: 'defense',
  CDM: 'midfield',
  CM: 'midfield',
  CAM: 'midfield',
  LM: 'midfield',
  RM: 'midfield',
  LW: 'attack',
  RW: 'attack',
  ST: 'attack',
};

export const PROMOTION_RELEGATION_COUNT = 3;

export const MATCH_WEEKS = 34;
