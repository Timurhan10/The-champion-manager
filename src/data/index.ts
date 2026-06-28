import { Player, Team, League, LeagueStanding } from '../types';
import { calculateOVR } from '../engine/rating';
import { getCountry } from './countries';
import { generateCountryData, generateLeagueData } from './generators';
import superligData from './superlig-teams.json';
import birincligData from './birinclig-teams.json';

interface RawPlayer {
  id: string;
  name: string;
  age: number;
  nationality: string;
  position: string;
  secondaryPositions: string[];
  attributes: {
    speed: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defense: number;
    physics: number;
    stamina: number;
    intelligence: number;
  };
  wage: number;
  marketValue: number;
}

interface RawTeam {
  id: string;
  name: string;
  shortName: string;
  city: string;
  colors: { primary: string; secondary: string };
  transferBudget: number;
  wageBudget: number;
  homeAdvantage: number;
  reputation: number;
  players: RawPlayer[];
}

interface RawLeague {
  leagueId: string;
  leagueName: string;
  tier: number;
  teams: RawTeam[];
}

function initLeagueStandings(teamIds: string[]): LeagueStanding[] {
  return teamIds.map((teamId) => ({
    teamId,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
  }));
}

function loadTurkishData(): {
  players: Record<string, Player>;
  teams: Record<string, Team>;
  leagues: Record<string, League>;
  freeAgentIds: string[];
} {
  const players: Record<string, Player> = {};
  const teams: Record<string, Team> = {};
  const leagues: Record<string, League> = {};

  for (const leagueData of [superligData, birincligData] as RawLeague[]) {
    const teamIds: string[] = [];

    for (const rawTeam of leagueData.teams) {
      const playerIds: string[] = [];
      let totalWage = 0;

      for (const rawPlayer of rawTeam.players) {
        const player: Player = {
          ...rawPlayer,
          position: rawPlayer.position as Player['position'],
          secondaryPositions: rawPlayer.secondaryPositions as Player['position'][],
          overallRating: calculateOVR(rawPlayer.attributes, rawPlayer.position as Player['position']),
          currentStamina: 100,
          teamId: rawTeam.id,
          injured: false,
          injuryWeeks: 0,
          consecutiveStarts: 0,
          seasonStats: { goals: 0, assists: 0, yellowCards: 0, matchesPlayed: 0 },
        };
        players[player.id] = player;
        playerIds.push(player.id);
        totalWage += rawPlayer.wage;
      }

      const team: Team = {
        id: rawTeam.id,
        name: rawTeam.name,
        shortName: rawTeam.shortName,
        city: rawTeam.city,
        leagueId: leagueData.leagueId,
        colors: rawTeam.colors,
        playerIds,
        startingElevenIds: [],
        substituteBenchIds: [],
        tactics: { formation: '4-4-2', tactic: 'direktOyun' },
        transferBudget: rawTeam.transferBudget,
        wageBudget: Math.max(rawTeam.wageBudget, Math.round(totalWage * 1.2)),
        currentWageTotal: totalWage,
        homeAdvantage: rawTeam.homeAdvantage,
        reputation: rawTeam.reputation,
        isPlayerControlled: false,
      };
      teams[team.id] = team;
      teamIds.push(team.id);
    }

    leagues[leagueData.leagueId] = {
      id: leagueData.leagueId,
      name: leagueData.leagueName,
      tier: leagueData.tier as 1 | 2 | 3 | 4,
      countryId: 'TR',
      teamIds,
      standings: initLeagueStandings(teamIds),
    };
  }

  // Generate Turkish 3rd league procedurally
  const country = getCountry('TR')!;
  const tier3Meta = country.leagues.find(l => l.id === 'tr-3');
  if (tier3Meta) {
    const tier3 = generateLeagueData(country, tier3Meta, 999_000);
    Object.assign(players, tier3.players);
    Object.assign(teams, tier3.teams);
    leagues[tier3.league.id] = tier3.league;
  }

  return { players, teams, leagues, freeAgentIds: [] };
}

export function loadGameData(countryId: string = 'TR'): {
  players: Record<string, Player>;
  teams: Record<string, Team>;
  leagues: Record<string, League>;
  freeAgentIds: string[];
} {
  if (countryId === 'TR') {
    return loadTurkishData();
  }
  return generateCountryData(countryId);
}
