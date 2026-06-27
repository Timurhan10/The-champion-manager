import { Player, PlayerAttributes, Tactic } from '../types';
import { TACTIC_DEFINITIONS } from './tactics';
import { calculateOVR } from './rating';

export type TrainingType = 'tactic' | 'physical' | 'technical' | 'defensive';

export interface TrainingResult {
  playerId: string;
  changes: Partial<Record<keyof PlayerAttributes, number>>;
}

const TRAINING_TARGETS: Record<Exclude<TrainingType, 'tactic'>, Partial<Record<keyof PlayerAttributes, number>>> = {
  physical: { speed: 0.5, physics: 0.5, stamina: 0.5 },
  technical: { shooting: 0.5, passing: 0.5, dribbling: 0.5 },
  defensive: { defense: 0.5, intelligence: 0.5 },
};

function getAgeMultiplier(age: number): number {
  if (age <= 20) return 1.5;
  if (age <= 24) return 1.2;
  if (age <= 28) return 1.0;
  if (age <= 31) return 0.6;
  return 0.3;
}

function getLevelMultiplier(value: number): number {
  if (value < 50) return 1.3;
  if (value <= 70) return 1.0;
  if (value <= 85) return 0.7;
  return 0.3;
}

export function applyTraining(
  players: Record<string, Player>,
  playerIds: string[],
  trainingType: TrainingType,
  tactic?: Tactic
): TrainingResult[] {
  const results: TrainingResult[] = [];

  let targets: Partial<Record<keyof PlayerAttributes, number>>;
  if (trainingType === 'tactic' && tactic) {
    const def = TACTIC_DEFINITIONS[tactic];
    targets = {};
    for (const [attr, weight] of Object.entries(def.attributeWeights)) {
      targets[attr as keyof PlayerAttributes] = (weight as number) * 2.0;
    }
  } else {
    targets = TRAINING_TARGETS[trainingType as Exclude<TrainingType, 'tactic'>] ?? {};
  }

  for (const id of playerIds) {
    const player = players[id];
    if (!player || player.injured) continue;

    const ageMult = getAgeMultiplier(player.age);
    const changes: Partial<Record<keyof PlayerAttributes, number>> = {};

    for (const [attr, baseIncrease] of Object.entries(targets)) {
      const key = attr as keyof PlayerAttributes;
      const current = player.attributes[key];
      const levelMult = getLevelMultiplier(current);
      const increase = Math.round((baseIncrease as number) * ageMult * levelMult * 10) / 10;
      if (increase > 0) {
        const newVal = Math.min(99, Math.round((current + increase) * 10) / 10);
        if (newVal > current) {
          player.attributes[key] = Math.round(newVal);
          changes[key] = Math.round(newVal) - current;
        }
      }
    }

    if (Object.keys(changes).length > 0) {
      player.overallRating = calculateOVR(player.attributes, player.position);
      results.push({ playerId: id, changes });
    }
  }

  return results;
}
