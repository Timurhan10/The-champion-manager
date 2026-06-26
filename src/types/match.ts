export type MatchEventType = 'goal' | 'assist' | 'yellow_card' | 'red_card' | 'injury' | 'substitution';

export interface MatchEvent {
  minute: number;
  type: MatchEventType;
  playerId: string;
  teamId: string;
  detail?: string;
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
}
