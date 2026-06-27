export type Position = 'GK' | 'CB' | 'LB' | 'RB' | 'CDM' | 'CM' | 'CAM' | 'LM' | 'RM' | 'LW' | 'RW' | 'ST';

export interface PlayerAttributes {
  speed: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defense: number;
  physics: number;
  stamina: number;
  intelligence: number;
}

export interface SeasonStats {
  goals: number;
  assists: number;
  yellowCards: number;
  matchesPlayed: number;
}

export interface Player {
  id: string;
  name: string;
  age: number;
  nationality: string;
  position: Position;
  secondaryPositions: Position[];
  attributes: PlayerAttributes;
  overallRating: number;
  currentStamina: number;
  wage: number;
  marketValue: number;
  teamId: string | null;
  injured: boolean;
  injuryWeeks: number;
  consecutiveStarts: number;
  seasonStats: SeasonStats;
}
