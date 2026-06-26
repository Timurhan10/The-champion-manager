import { League, Team, Player, LeagueStanding } from '../types';
import { PROMOTION_RELEGATION_COUNT } from '../utils/constants';

export function handlePromotion(
  leagues: Record<string, League>,
  teams: Record<string, Team>
): { promoted: string[]; relegated: string[] } {
  const leagueList = Object.values(leagues);
  const tier1 = leagueList.find(l => l.tier === 1);
  const tier2 = leagueList.find(l => l.tier === 2);

  if (!tier1 || !tier2) return { promoted: [], relegated: [] };

  const count = PROMOTION_RELEGATION_COUNT;

  // Bottom N of tier 1 get relegated
  const relegated = tier1.standings
    .slice(-count)
    .map(s => s.teamId);

  // Top N of tier 2 get promoted
  const promoted = tier2.standings
    .slice(0, count)
    .map(s => s.teamId);

  // Swap team league assignments
  for (const teamId of relegated) {
    const team = teams[teamId];
    if (team) {
      tier1.teamIds = tier1.teamIds.filter(id => id !== teamId);
      tier2.teamIds.push(teamId);
      team.leagueId = tier2.id;
    }
  }

  for (const teamId of promoted) {
    const team = teams[teamId];
    if (team) {
      tier2.teamIds = tier2.teamIds.filter(id => id !== teamId);
      tier1.teamIds.push(teamId);
      team.leagueId = tier1.id;
    }
  }

  return { promoted, relegated };
}

export function advancePlayerAge(players: Record<string, Player>): void {
  for (const player of Object.values(players)) {
    player.age += 1;
  }
}

export function updateBudgets(
  teams: Record<string, Team>,
  standings: LeagueStanding[],
  tier: number
): void {
  if (standings.length === 0) return;

  const halfIdx = Math.floor(standings.length / 2);
  const championId = standings[0].teamId;
  const relegatedIds = standings.slice(-PROMOTION_RELEGATION_COUNT).map(s => s.teamId);

  for (let i = 0; i < standings.length; i++) {
    const team = teams[standings[i].teamId];
    if (!team) continue;

    if (standings[i].teamId === championId) {
      team.transferBudget = Math.round(team.transferBudget * 1.20);
    } else if (relegatedIds.includes(standings[i].teamId)) {
      team.transferBudget = Math.round(team.transferBudget * 0.85);
    } else if (i < halfIdx) {
      team.transferBudget = Math.round(team.transferBudget * 1.10);
    } else {
      team.transferBudget = Math.round(team.transferBudget * 0.95);
    }
  }
}
