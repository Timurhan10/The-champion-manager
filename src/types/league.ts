export interface LeagueStanding {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface League {
  id: string;
  name: string;
  tier: 1 | 2 | 3 | 4;
  countryId: string;
  teamIds: string[];
  standings: LeagueStanding[];
}

export interface LeagueMeta {
  id: string;
  name: string;
  tier: 1 | 2 | 3 | 4;
  teamCount: number;
}

export interface Country {
  id: string;
  name: string;
  flag: string;
  continent: 'europe' | 'southAmerica' | 'northAmerica' | 'asia' | 'africa' | 'oceania';
  namePoolRegion: string;
  leagues: LeagueMeta[];
}
