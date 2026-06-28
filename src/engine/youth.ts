import { Player, Position, PlayerAttributes } from '../types';
import { calculateOVR } from './rating';
import { getNamePool } from '../data/name-pools';

const ALL_POSITIONS: Position[] = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'ST'];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

export function generateYouthPlayer(teamId: string, seed: number, namePoolRegion: string = 'turkic'): Player {
  const rng = seededRandom(seed);

  const pool = getNamePool(namePoolRegion);
  const firstName = pool.firstNames[Math.floor(rng() * pool.firstNames.length)];
  const lastName = pool.lastNames[Math.floor(rng() * pool.lastNames.length)];
  const age = 17 + Math.floor(rng() * 3);
  const position = ALL_POSITIONS[Math.floor(rng() * ALL_POSITIONS.length)];
  const baseOVR = 40 + Math.floor(rng() * 16);

  const attrs: PlayerAttributes = {
    speed: Math.max(30, baseOVR + Math.floor(rng() * 15) - 7),
    shooting: Math.max(30, baseOVR + Math.floor(rng() * 15) - 7),
    passing: Math.max(30, baseOVR + Math.floor(rng() * 15) - 7),
    dribbling: Math.max(30, baseOVR + Math.floor(rng() * 15) - 7),
    defense: Math.max(30, baseOVR + Math.floor(rng() * 15) - 7),
    physics: Math.max(30, baseOVR + Math.floor(rng() * 15) - 7),
    stamina: Math.max(40, baseOVR + Math.floor(rng() * 15) - 5),
    intelligence: Math.max(30, baseOVR + Math.floor(rng() * 15) - 7),
  };

  return {
    id: `youth_${teamId}_${seed}`,
    name: `${firstName} ${lastName}`,
    age,
    nationality: namePoolRegion === 'turkic' ? 'TR' : namePoolRegion,
    position,
    secondaryPositions: [],
    attributes: attrs,
    overallRating: calculateOVR(attrs, position),
    currentStamina: 100,
    wage: 5000 + Math.floor(rng() * 10000),
    marketValue: 100000 + Math.floor(rng() * 400000),
    teamId,
    injured: false,
    injuryWeeks: 0,
    consecutiveStarts: 0,
    seasonStats: { goals: 0, assists: 0, yellowCards: 0, matchesPlayed: 0 },
  };
}

export function generateYouthPlayersForTeam(teamId: string, seasonYear: number, teamIndex: number, namePoolRegion: string = 'turkic'): Player[] {
  const baseSeed = seasonYear * 100000 + teamIndex * 1000;
  const count = 1 + Math.floor(((baseSeed * 1664525 + 1013904223) & 0x7fffffff) / 0x7fffffff * 3);
  const players: Player[] = [];
  for (let i = 0; i < count; i++) {
    players.push(generateYouthPlayer(teamId, baseSeed + i, namePoolRegion));
  }
  return players;
}

export function applyPlayerDevelopment(player: Player): void {
  const attrs = player.attributes;
  const keys: (keyof PlayerAttributes)[] = ['speed', 'shooting', 'passing', 'dribbling', 'defense', 'physics', 'stamina', 'intelligence'];

  if (player.age <= 23) {
    for (const key of keys) {
      const gain = 1 + Math.floor(Math.random() * 3);
      attrs[key] = Math.min(99, attrs[key] + gain);
    }
  } else if (player.age >= 30 && player.age <= 32) {
    for (const key of keys) {
      const loss = 1 + Math.floor(Math.random() * 2);
      attrs[key] = Math.max(20, attrs[key] - loss);
    }
  } else if (player.age >= 33) {
    for (const key of keys) {
      const loss = 2 + Math.floor(Math.random() * 3);
      attrs[key] = Math.max(20, attrs[key] - loss);
    }
  }

  player.overallRating = calculateOVR(attrs, player.position);
}
