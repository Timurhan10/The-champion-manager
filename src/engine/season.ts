import { League, Team, Player, LeagueStanding } from '../types';
import { PROMOTION_RELEGATION_COUNT } from '../utils/constants';

export function handlePromotion(
  leagues: Record<string, League>,
  teams: Record<string, Team>
): { promoted: string[]; relegated: string[] } {
  const leagueList = Object.values(leagues);
  const tiers = leagueList.sort((a, b) => a.tier - b.tier);

  const promoted: string[] = [];
  const relegated: string[] = [];
  const count = PROMOTION_RELEGATION_COUNT;

  for (let i = 0; i < tiers.length - 1; i++) {
    const upper = tiers[i];
    const lower = tiers[i + 1];

    const relegatedIds = upper.standings.slice(-count).map(s => s.teamId);
    const promotedIds = lower.standings.slice(0, count).map(s => s.teamId);

    for (const teamId of relegatedIds) {
      const team = teams[teamId];
      if (team) {
        upper.teamIds = upper.teamIds.filter(id => id !== teamId);
        lower.teamIds.push(teamId);
        team.leagueId = lower.id;
        relegated.push(teamId);
      }
    }

    for (const teamId of promotedIds) {
      const team = teams[teamId];
      if (team) {
        lower.teamIds = lower.teamIds.filter(id => id !== teamId);
        upper.teamIds.push(teamId);
        team.leagueId = upper.id;
        promoted.push(teamId);
      }
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
  _tier: number
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
