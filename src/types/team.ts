export type Formation = '4-4-2' | '4-3-3' | '4-2-3-1' | '3-5-2' | '5-3-2';
export type Tactic = 'balanced' | 'attack' | 'defense';

export interface TeamTactics {
  formation: Formation;
  tactic: Tactic;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  city: string;
  leagueId: string;
  colors: { primary: string; secondary: string };
  playerIds: string[];
  startingElevenIds: string[];
  substituteBenchIds: string[];
  tactics: TeamTactics;
  transferBudget: number;
  wageBudget: number;
  currentWageTotal: number;
  homeAdvantage: number;
  reputation: number;
  isPlayerControlled: boolean;
}
