import { Team, Player, TransferOffer } from '../types';

export function canAffordPlayer(team: Team, player: Player): boolean {
  return (
    team.transferBudget >= player.marketValue &&
    team.wageBudget >= team.currentWageTotal + player.wage
  );
}

export function buyPlayer(
  teams: Record<string, Team>,
  players: Record<string, Player>,
  buyerTeamId: string,
  playerId: string,
  fee: number
): void {
  const buyer = teams[buyerTeamId];
  const player = players[playerId];
  if (!buyer || !player) return;

  // Remove from previous team
  if (player.teamId) {
    const seller = teams[player.teamId];
    if (seller) {
      seller.playerIds = seller.playerIds.filter(id => id !== playerId);
      seller.startingElevenIds = seller.startingElevenIds.filter(id => id !== playerId);
      seller.substituteBenchIds = seller.substituteBenchIds.filter(id => id !== playerId);
      seller.transferBudget += fee;
      seller.currentWageTotal -= player.wage;
    }
  }

  // Add to buyer
  buyer.playerIds.push(playerId);
  buyer.transferBudget -= fee;
  buyer.currentWageTotal += player.wage;
  player.teamId = buyerTeamId;
}

export function sellPlayer(
  teams: Record<string, Team>,
  players: Record<string, Player>,
  sellerTeamId: string,
  playerId: string,
  fee: number
): void {
  const seller = teams[sellerTeamId];
  const player = players[playerId];
  if (!seller || !player) return;

  seller.playerIds = seller.playerIds.filter(id => id !== playerId);
  seller.startingElevenIds = seller.startingElevenIds.filter(id => id !== playerId);
  seller.substituteBenchIds = seller.substituteBenchIds.filter(id => id !== playerId);
  seller.transferBudget += fee;
  seller.currentWageTotal -= player.wage;
  player.teamId = null;
}

export function evaluateTransferOffer(
  offer: TransferOffer,
  player: Player,
  sellerTeam: Team,
  week: number
): boolean {
  const ratio = offer.fee / player.marketValue;
  let acceptRate: number;
  if (ratio >= 1.5) acceptRate = 90;
  else if (ratio >= 1.2) acceptRate = 70;
  else if (ratio >= 1.0) acceptRate = 50;
  else if (ratio >= 0.8) acceptRate = 30;
  else acceptRate = 10;

  if (player.overallRating >= 80) acceptRate *= 0.5;
  if (sellerTeam.playerIds.length < 20) acceptRate *= 0.3;
  if (sellerTeam.playerIds.length > 25) acceptRate *= 1.3;

  acceptRate = Math.min(95, Math.max(5, acceptRate));

  let hash = 0;
  for (let i = 0; i < player.id.length; i++) {
    hash = ((hash << 5) - hash + player.id.charCodeAt(i)) | 0;
  }
  const seed = week * 10000 + Math.abs(hash);
  const roll = ((seed * 1664525 + 1013904223) & 0x7fffffff) / 0x7fffffff * 100;

  return roll < acceptRate;
}

export function generateAITransfers(
  teams: Record<string, Team>,
  players: Record<string, Player>,
  freeAgentIds: string[]
): void {
  const aiTeams = Object.values(teams).filter(t => !t.isPlayerControlled);

  for (const team of aiTeams) {
    if (team.playerIds.length >= 22) continue;

    const available = [...freeAgentIds];
    for (const agentId of available) {
      if (team.playerIds.length >= 22) break;

      const player = players[agentId];
      if (!player) continue;

      if (canAffordPlayer(team, player)) {
        buyPlayer(teams, players, team.id, agentId, player.marketValue);
        freeAgentIds.splice(freeAgentIds.indexOf(agentId), 1);
      }
    }
  }
}
