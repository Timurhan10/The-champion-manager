import { Formation, Tactic } from '../types';
import { FORMATIONS, POSITION_GROUPS } from '../utils/constants';

export const TACTIC_MODIFIERS: Record<Tactic, { attackMult: number; defenseMult: number }> = {
  attack:   { attackMult: 1.15, defenseMult: 0.85 },
  balanced: { attackMult: 1.0,  defenseMult: 1.0 },
  defense:  { attackMult: 0.85, defenseMult: 1.15 },
};

export function getFormationBalance(formation: Formation): {
  attackCount: number;
  defenseCount: number;
  midfieldCount: number;
} {
  const positions = FORMATIONS[formation];
  let attackCount = 0;
  let defenseCount = 0;
  let midfieldCount = 0;

  for (const pos of positions) {
    const group = POSITION_GROUPS[pos];
    if (group === 'attack') attackCount++;
    else if (group === 'defense') defenseCount++;
    else if (group === 'midfield') midfieldCount++;
  }

  return { attackCount, defenseCount, midfieldCount };
}
