export type MatchEventType = 'goal' | 'assist' | 'yellow_card' | 'red_card' | 'injury' | 'substitution';

export interface MatchEvent {
  minute: number;
  type: MatchEventType;
  playerId: string;
  teamId: string;
  detail?: string;
}

export type StatEventType = 'shot_on' | 'shot_off' | 'corner' | 'foul' | 'offside';

export interface MatchStatEvent {
  minute: number;
  type: StatEventType;
  teamId: string;
}

export interface TeamMatchStats {
  shotsOnTarget: number;
  shotsOffTarget: number;
  corners: number;
  fouls: number;
  offsides: number;
}

export interface MatchResult {
  id: string;
  week: number;
  homeTeamId: string;
  awayTeamId: string;
  homeGoals: number;
  awayGoals: number;
  events: MatchEvent[];
  played: boolean;
  stats?: { home: TeamMatchStats; away: TeamMatchStats };
  statEvents?: MatchStatEvent[];
}
