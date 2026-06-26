import { Player, PlayerAttributes, Position } from '../types';

type WeightKey = 'GK' | 'CB' | 'FB' | 'CDM' | 'CM' | 'CAM' | 'WNG' | 'ST';

const POSITION_WEIGHTS: Record<WeightKey, Record<keyof PlayerAttributes, number>> = {
  GK:  { speed: 0.05, shooting: 0.02, passing: 0.10, dribbling: 0.03, defense: 0.15, physics: 0.15, stamina: 0.10, intelligence: 0.40 },
  CB:  { speed: 0.08, shooting: 0.03, passing: 0.10, dribbling: 0.05, defense: 0.25, physics: 0.20, stamina: 0.12, intelligence: 0.17 },
  FB:  { speed: 0.15, shooting: 0.05, passing: 0.12, dribbling: 0.10, defense: 0.20, physics: 0.12, stamina: 0.13, intelligence: 0.13 },
  CDM: { speed: 0.08, shooting: 0.05, passing: 0.15, dribbling: 0.05, defense: 0.22, physics: 0.15, stamina: 0.15, intelligence: 0.15 },
  CM:  { speed: 0.10, shooting: 0.10, passing: 0.20, dribbling: 0.12, defense: 0.12, physics: 0.10, stamina: 0.13, intelligence: 0.13 },
  CAM: { speed: 0.12, shooting: 0.15, passing: 0.18, dribbling: 0.15, defense: 0.05, physics: 0.08, stamina: 0.12, intelligence: 0.15 },
  WNG: { speed: 0.18, shooting: 0.15, passing: 0.15, dribbling: 0.18, defense: 0.05, physics: 0.08, stamina: 0.13, intelligence: 0.08 },
  ST:  { speed: 0.14, shooting: 0.25, passing: 0.08, dribbling: 0.15, defense: 0.03, physics: 0.12, stamina: 0.10, intelligence: 0.13 },
};

const POSITION_TO_GROUP: Record<Position, WeightKey> = {
  GK: 'GK',
  CB: 'CB',
  LB: 'FB',
  RB: 'FB',
  CDM: 'CDM',
  CM: 'CM',
  CAM: 'CAM',
  LM: 'WNG',
  RM: 'WNG',
  LW: 'WNG',
  RW: 'WNG',
  ST: 'ST',
};

const ADJACENCY: Record<WeightKey, WeightKey[]> = {
  GK:  ['CB'],
  CB:  ['GK', 'FB', 'CDM'],
  FB:  ['CB', 'WNG', 'CDM'],
  CDM: ['CB', 'FB', 'CM'],
  CM:  ['CDM', 'CAM', 'WNG'],
  CAM: ['CM', 'WNG', 'ST'],
  WNG: ['FB', 'CM', 'CAM', 'ST'],
  ST:  ['CAM', 'WNG'],
};

export function getPositionGroup(position: Position): string {
  return POSITION_TO_GROUP[position];
}

export function calculateOVR(attributes: PlayerAttributes, position: Position): number {
  const weights = POSITION_WEIGHTS[POSITION_TO_GROUP[position]];
  let total = 0;
  for (const key of Object.keys(weights) as (keyof PlayerAttributes)[]) {
    total += attributes[key] * weights[key];
  }
  return Math.round(total);
}

export function calculatePositionPenalty(primaryPosition: Position, assignedPosition: Position): number {
  const primaryGroup = POSITION_TO_GROUP[primaryPosition];
  const assignedGroup = POSITION_TO_GROUP[assignedPosition];

  if (primaryGroup === assignedGroup) return 0;
  if (ADJACENCY[primaryGroup].includes(assignedGroup)) return -5;
  return -15;
}

export function getEffectiveOVR(player: Player, assignedPosition: Position): number {
  const ovr = calculateOVR(player.attributes, assignedPosition);
  const penalty = calculatePositionPenalty(player.position, assignedPosition);
  const staminaPenalty = player.currentStamina < 30 ? -10 : 0;
  return ovr + penalty + staminaPenalty;
}
