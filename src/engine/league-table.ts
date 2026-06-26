import { MatchResult, LeagueStanding } from '../types';

export function computeStandings(fixtures: MatchResult[], teamIds: string[]): LeagueStanding[] {
  const map = new Map<string, LeagueStanding>();

  for (const id of teamIds) {
    map.set(id, {
      teamId: id,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    });
  }

  for (const match of fixtures) {
    if (!match.played) continue;

    const home = map.get(match.homeTeamId);
    const away = map.get(match.awayTeamId);
    if (!home || !away) continue;

    home.played++;
    away.played++;
    home.goalsFor += match.homeGoals;
    home.goalsAgainst += match.awayGoals;
    away.goalsFor += match.awayGoals;
    away.goalsAgainst += match.homeGoals;

    if (match.homeGoals > match.awayGoals) {
      home.won++;
      home.points += 3;
      away.lost++;
    } else if (match.homeGoals < match.awayGoals) {
      away.won++;
      away.points += 3;
      home.lost++;
    } else {
      home.drawn++;
      away.drawn++;
      home.points += 1;
      away.points += 1;
    }

    home.goalDifference = home.goalsFor - home.goalsAgainst;
    away.goalDifference = away.goalsFor - away.goalsAgainst;
  }

  const standings = Array.from(map.values());
  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });

  return standings;
}
