import { Player, Team, League, Position, PlayerAttributes } from '../types';
import { Country, LeagueMeta } from '../types/league';
import { calculateOVR } from '../engine/rating';
import { getNamePool } from './name-pools';
import { getTeamNamePool, getColorPair } from './team-name-pools';
import { getCountry } from './countries';

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) & 0x7fffffff;
  }
  return h;
}

const SQUAD_POSITIONS: Position[] = [
  'GK','GK','GK',
  'CB','CB','CB','CB','CB',
  'LB','LB','RB','RB',
  'CDM','CDM','CM','CM','CM',
  'CAM',
  'LW','RW','LM','RM',
  'ST','ST','ST',
];

interface TierConfig {
  ovrMin: number;
  ovrMax: number;
  budgetBase: number;
  wageMultiplier: number;
  valueMultiplier: number;
}

const TIER_CONFIGS: Record<number, TierConfig> = {
  1: { ovrMin: 60, ovrMax: 85, budgetBase: 15_000_000, wageMultiplier: 1.0, valueMultiplier: 1.0 },
  2: { ovrMin: 50, ovrMax: 75, budgetBase: 5_000_000, wageMultiplier: 0.6, valueMultiplier: 0.5 },
  3: { ovrMin: 45, ovrMax: 65, budgetBase: 2_000_000, wageMultiplier: 0.3, valueMultiplier: 0.25 },
  4: { ovrMin: 40, ovrMax: 60, budgetBase: 800_000, wageMultiplier: 0.15, valueMultiplier: 0.12 },
};

function generateAttributes(rng: () => number, targetOvr: number, position: Position): PlayerAttributes {
  const attrs: PlayerAttributes = {
    speed: 50, shooting: 50, passing: 50, dribbling: 50,
    defense: 50, physics: 50, stamina: 50, intelligence: 50,
  };

  const posBoosts: Partial<Record<Position, (keyof PlayerAttributes)[]>> = {
    GK: ['intelligence','defense','physics'],
    CB: ['defense','physics','intelligence'],
    LB: ['speed','defense','stamina'],
    RB: ['speed','defense','stamina'],
    CDM: ['defense','passing','physics'],
    CM: ['passing','intelligence','stamina'],
    CAM: ['passing','dribbling','shooting'],
    LW: ['speed','dribbling','shooting'],
    RW: ['speed','dribbling','shooting'],
    LM: ['speed','passing','dribbling'],
    RM: ['speed','passing','dribbling'],
    ST: ['shooting','speed','dribbling'],
  };

  const boosts = posBoosts[position] || ['speed','shooting','passing'];

  for (const key of Object.keys(attrs) as (keyof PlayerAttributes)[]) {
    const base = targetOvr + (rng() * 20 - 10);
    const isBoost = boosts.includes(key);
    attrs[key] = Math.round(Math.max(30, Math.min(99, base + (isBoost ? rng() * 8 : -rng() * 5))));
  }

  return attrs;
}

function generatePlayer(
  namePoolRegion: string,
  countryId: string,
  teamId: string,
  position: Position,
  tier: number,
  seed: number,
): Player {
  const rng = seededRandom(seed);
  const pool = getNamePool(namePoolRegion);
  const config = TIER_CONFIGS[tier] || TIER_CONFIGS[1];

  const firstName = pool.firstNames[Math.floor(rng() * pool.firstNames.length)];
  const lastName = pool.lastNames[Math.floor(rng() * pool.lastNames.length)];
  const name = `${firstName} ${lastName}`;

  const age = Math.floor(17 + rng() * 20);
  const targetOvr = Math.round(config.ovrMin + rng() * (config.ovrMax - config.ovrMin));
  const ageMod = age < 22 ? -3 : age > 32 ? -5 : age > 29 ? -2 : 0;
  const adjustedTarget = Math.max(config.ovrMin, targetOvr + ageMod);

  const attributes = generateAttributes(rng, adjustedTarget, position);
  const overallRating = calculateOVR(attributes, position);
  const marketValue = Math.round((overallRating * overallRating * 500 + rng() * 200000) * config.valueMultiplier);
  const wage = Math.round((overallRating * 200 + rng() * 5000) * config.wageMultiplier);

  return {
    id: `${teamId}-p${seed}`,
    name,
    age,
    nationality: countryId,
    position,
    secondaryPositions: [],
    attributes,
    overallRating,
    currentStamina: 100,
    wage,
    marketValue,
    teamId,
    injured: false,
    injuryWeeks: 0,
    consecutiveStarts: 0,
    seasonStats: { goals: 0, assists: 0, yellowCards: 0, matchesPlayed: 0 },
  };
}

function generateTeam(
  countryId: string,
  leagueId: string,
  namePoolRegion: string,
  tier: number,
  teamIndex: number,
  seed: number,
): { team: Team; players: Player[] } {
  const rng = seededRandom(seed);
  const pool = getTeamNamePool(countryId);
  const config = TIER_CONFIGS[tier] || TIER_CONFIGS[1];

  const cityIdx = teamIndex % pool.cities.length;
  const suffixIdx = Math.floor(rng() * pool.suffixes.length);
  const city = pool.cities[cityIdx];
  const suffix = pool.suffixes[suffixIdx];
  const name = `${city} ${suffix}`;
  const shortName = city.length > 3 ? city.slice(0, 3).toUpperCase() : city.toUpperCase();

  const [primary, secondary] = getColorPair(teamIndex + hashString(countryId));

  const teamId = `${leagueId}-t${teamIndex}`;
  const players: Player[] = [];
  let totalWage = 0;

  for (let i = 0; i < SQUAD_POSITIONS.length; i++) {
    const p = generatePlayer(namePoolRegion, countryId, teamId, SQUAD_POSITIONS[i], tier, seed * 100 + i);
    players.push(p);
    totalWage += p.wage;
  }

  const reputation = Math.round(30 + (5 - tier) * 15 + rng() * 10);
  const homeAdvantage = Math.round(5 + rng() * 4);

  const team: Team = {
    id: teamId,
    name,
    shortName,
    city,
    leagueId,
    colors: { primary, secondary },
    playerIds: players.map(p => p.id),
    startingElevenIds: [],
    substituteBenchIds: [],
    tactics: { formation: '4-4-2', tactic: 'direktOyun' },
    transferBudget: Math.round(config.budgetBase * (0.5 + rng())),
    wageBudget: Math.round(totalWage * 1.3),
    currentWageTotal: totalWage,
    homeAdvantage,
    reputation,
    isPlayerControlled: false,
  };

  return { team, players };
}

export function generateLeagueData(
  country: Country,
  leagueMeta: LeagueMeta,
  baseSeed: number,
): { teams: Record<string, Team>; players: Record<string, Player>; league: League } {
  const teams: Record<string, Team> = {};
  const players: Record<string, Player> = {};
  const teamIds: string[] = [];

  for (let i = 0; i < leagueMeta.teamCount; i++) {
    const { team, players: teamPlayers } = generateTeam(
      country.id, leagueMeta.id, country.namePoolRegion, leagueMeta.tier, i, baseSeed + i * 1000,
    );
    teams[team.id] = team;
    teamIds.push(team.id);
    for (const p of teamPlayers) {
      players[p.id] = p;
    }
  }

  const league: League = {
    id: leagueMeta.id,
    name: leagueMeta.name,
    tier: leagueMeta.tier,
    countryId: country.id,
    teamIds,
    standings: teamIds.map(teamId => ({
      teamId, played: 0, won: 0, drawn: 0, lost: 0,
      goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0,
    })),
  };

  return { teams, players, league };
}

export function generateCountryData(countryId: string): {
  players: Record<string, Player>;
  teams: Record<string, Team>;
  leagues: Record<string, League>;
  freeAgentIds: string[];
} {
  const country = getCountry(countryId);
  if (!country) throw new Error(`Unknown country: ${countryId}`);

  const players: Record<string, Player> = {};
  const teams: Record<string, Team> = {};
  const leagues: Record<string, League> = {};

  const baseSeed = hashString(countryId);

  for (let li = 0; li < country.leagues.length; li++) {
    const leagueMeta = country.leagues[li];
    const result = generateLeagueData(country, leagueMeta, baseSeed + li * 100_000);
    Object.assign(players, result.players);
    Object.assign(teams, result.teams);
    leagues[result.league.id] = result.league;
  }

  return { players, teams, leagues, freeAgentIds: [] };
}

export function generateTeamPreviews(countryId: string, leagueId: string): {
  id: string;
  name: string;
  shortName: string;
  city: string;
  colors: { primary: string; secondary: string };
  transferBudget: number;
  reputation: number;
}[] {
  const country = getCountry(countryId);
  if (!country) return [];
  const leagueMeta = country.leagues.find(l => l.id === leagueId);
  if (!leagueMeta) return [];

  const baseSeed = hashString(countryId);
  const leagueIndex = country.leagues.indexOf(leagueMeta);
  const result = generateLeagueData(country, leagueMeta, baseSeed + leagueIndex * 100_000);

  return Object.values(result.teams).map(t => ({
    id: t.id,
    name: t.name,
    shortName: t.shortName,
    city: t.city,
    colors: t.colors,
    transferBudget: t.transferBudget,
    reputation: t.reputation,
  }));
}
