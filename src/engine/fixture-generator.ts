import { MatchResult } from '../types';

export function generateFixtures(teamIds: string[], seasonYear: number): MatchResult[] {
  const n = teamIds.length;
  const fixtures: MatchResult[] = [];

  // Circle method: fix first team, rotate the rest
  const teams = [...teamIds];
  const rounds = n - 1; // 17 rounds for 18 teams

  for (let round = 0; round < rounds; round++) {
    const week = round + 1;
    const matchesPerRound = n / 2;

    for (let match = 0; match < matchesPerRound; match++) {
      const homeIdx = match === 0 ? 0 : match;
      const awayIdx = n - 1 - match;

      const homeId = teams[homeIdx];
      const awayId = teams[awayIdx];

      // First half: home as listed
      fixtures.push({
        id: `${seasonYear}-w${week}-${homeId}-vs-${awayId}`,
        week,
        homeTeamId: homeId,
        awayTeamId: awayId,
        homeGoals: 0,
        awayGoals: 0,
        events: [],
        played: false,
      });

      // Second half (reverse): week + rounds
      const returnWeek = week + rounds;
      fixtures.push({
        id: `${seasonYear}-w${returnWeek}-${awayId}-vs-${homeId}`,
        week: returnWeek,
        homeTeamId: awayId,
        awayTeamId: homeId,
        homeGoals: 0,
        awayGoals: 0,
        events: [],
        played: false,
      });
    }

    // Rotate: keep teams[0] fixed, rotate the rest
    const last = teams.pop()!;
    teams.splice(1, 0, last);
  }

  return fixtures.sort((a, b) => a.week - b.week);
}
