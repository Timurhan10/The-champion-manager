export type TransferStatus = 'pending' | 'accepted' | 'rejected';

export interface TransferOffer {
  id: string;
  playerId: string;
  fromTeamId: string | null;
  toTeamId: string;
  fee: number;
  wageOffer: number;
  status: TransferStatus;
}
