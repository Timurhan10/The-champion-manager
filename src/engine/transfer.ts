import { Team, Player } from '../types';

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
