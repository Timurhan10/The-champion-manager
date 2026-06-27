import { MatchResult } from './match';

export interface Season {
  year: number;
  currentWeek: number;
  totalWeeks: number;
  fixtures: MatchResult[];
  transferWindowOpen: boolean;
  completed: boolean;
  trainedThisWeek: boolean;
}
