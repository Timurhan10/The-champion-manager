import { Tactic, Formation } from '../types';
import { Player, PlayerAttributes } from '../types';
import { FORMATIONS, POSITION_GROUPS } from '../utils/constants';

export interface TacticDefinition {
  id: Tactic;
  name: string;
  description: string;
  attackMult: number;
  defenseMult: number;
  attributeWeights: Partial<Record<keyof PlayerAttributes, number>>;
  counters: Tactic[];
  weakTo: Tactic[];
}

export const TACTIC_DEFINITIONS: Record<Tactic, TacticDefinition> = {
  tikiTaka: {
    id: 'tikiTaka',
    name: 'Tiki-Taka',
    description: 'Kısa pas ve topa sahip olma odaklı. Pas ve dribling yeteneği yüksek oyuncularla etkili.',
    attackMult: 1.05,
    defenseMult: 1.00,
    attributeWeights: { passing: 0.35, dribbling: 0.30, intelligence: 0.20, stamina: 0.15 },
    counters: ['parkTheBus', 'longBall'],
    weakTo: ['gegenpressing', 'highPress'],
  },
  gegenpressing: {
    id: 'gegenpressing',
    name: 'Gegenpressing',
    description: 'Top kaybında anında baskı. Yüksek dayanıklılık ve savunma refleksi gerektirir.',
    attackMult: 1.15,
    defenseMult: 0.95,
    attributeWeights: { stamina: 0.30, defense: 0.25, speed: 0.25, intelligence: 0.20 },
    counters: ['tikiTaka', 'falseNine'],
    weakTo: ['counterAttack', 'wingPlay'],
  },
  counterAttack: {
    id: 'counterAttack',
    name: 'Kontra Atak',
    description: 'Savunmadan hızlı geçişlerle gol arayışı. Hızlı kanat ve forvetlerle parlıyor.',
    attackMult: 1.10,
    defenseMult: 1.05,
    attributeWeights: { speed: 0.35, shooting: 0.25, defense: 0.20, passing: 0.20 },
    counters: ['gegenpressing', 'highPress'],
    weakTo: ['parkTheBus', 'longBall'],
  },
  parkTheBus: {
    id: 'parkTheBus',
    name: 'Otobüs Park',
    description: 'Ultra savunmacı, kaleyi kapatma taktiği. Güçlü stoperler ve fiziksel oyuncular şart.',
    attackMult: 0.70,
    defenseMult: 1.30,
    attributeWeights: { defense: 0.35, physics: 0.30, intelligence: 0.20, stamina: 0.15 },
    counters: ['counterAttack', 'direktOyun'],
    weakTo: ['tikiTaka', 'wingPlay'],
  },
  longBall: {
    id: 'longBall',
    name: 'Uzun Top',
    description: 'Direkt uzun paslarla hücum. Fiziksel güçlü ve şut yeteneği olan forvetler gerekir.',
    attackMult: 1.10,
    defenseMult: 0.95,
    attributeWeights: { physics: 0.30, shooting: 0.25, passing: 0.25, speed: 0.20 },
    counters: ['wingPlay', 'falseNine'],
    weakTo: ['tikiTaka', 'counterAttack'],
  },
  wingPlay: {
    id: 'wingPlay',
    name: 'Kanat Oyunu',
    description: 'Kanatlardan hücum ve orta yapma taktiği. Hızlı ve dribling yeteneği olan kanatçılar şart.',
    attackMult: 1.15,
    defenseMult: 0.90,
    attributeWeights: { speed: 0.30, dribbling: 0.25, passing: 0.25, shooting: 0.20 },
    counters: ['parkTheBus', 'gegenpressing'],
    weakTo: ['longBall', 'falseNine'],
  },
  falseNine: {
    id: 'falseNine',
    name: 'Sahte 9',
    description: 'Forvetin geri çekilip yaratıcı rol üstlenmesi. Zeki, dribling ve pas yeteneği yüksek oyuncular ideal.',
    attackMult: 1.05,
    defenseMult: 1.00,
    attributeWeights: { dribbling: 0.30, intelligence: 0.30, passing: 0.25, shooting: 0.15 },
    counters: ['wingPlay', 'longBall'],
    weakTo: ['gegenpressing', 'direktOyun'],
  },
  highPress: {
    id: 'highPress',
    name: 'Yüksek Pres',
    description: 'Rakip yarı alanda sürekli baskı. Dayanıklılık ve hız çok önemli.',
    attackMult: 1.10,
    defenseMult: 0.90,
    attributeWeights: { stamina: 0.30, speed: 0.25, defense: 0.25, intelligence: 0.20 },
    counters: ['tikiTaka', 'falseNine'],
    weakTo: ['counterAttack', 'direktOyun'],
  },
  direktOyun: {
    id: 'direktOyun',
    name: 'Direkt Oyun',
    description: 'Hızlı ve doğrudan hücum, az pas ile gol arayışı. Şut ve fizik gücü ön planda.',
    attackMult: 1.05,
    defenseMult: 1.05,
    attributeWeights: { shooting: 0.30, physics: 0.25, speed: 0.25, passing: 0.20 },
    counters: ['parkTheBus', 'highPress'],
    weakTo: ['wingPlay', 'falseNine'],
  },
};

export function calculateTacticFit(playerList: Player[], tactic: TacticDefinition): number {
  if (playerList.length === 0) return 1.0;
  let totalFit = 0;
  for (const player of playerList) {
    let playerFit = 0;
    for (const [attr, weight] of Object.entries(tactic.attributeWeights)) {
      playerFit += (player.attributes[attr as keyof PlayerAttributes] ?? 50) * (weight as number);
    }
    totalFit += playerFit;
  }
  const avgFit = totalFit / playerList.length;
  return 0.85 + (avgFit / 100) * 0.30;
}

export function getCounterModifier(myTactic: Tactic, opponentTactic: Tactic): number {
  const def = TACTIC_DEFINITIONS[myTactic];
  if (def.counters.includes(opponentTactic)) return 1.12;
  if (def.weakTo.includes(opponentTactic)) return 0.88;
  return 1.0;
}

export function getBestTacticForSquad(playerList: Player[]): Tactic {
  let bestTactic: Tactic = 'direktOyun';
  let bestFit = 0;
  for (const [id, def] of Object.entries(TACTIC_DEFINITIONS)) {
    const fit = calculateTacticFit(playerList, def);
    if (fit > bestFit) {
      bestFit = fit;
      bestTactic = id as Tactic;
    }
  }
  return bestTactic;
}

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
