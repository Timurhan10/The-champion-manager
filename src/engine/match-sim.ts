import { Team, Player, MatchResult, MatchEvent, Position } from '../types';
import { FORMATIONS, POSITION_GROUPS } from '../utils/constants';
import { createRng, randomInt, weightedRandom, poissonRandom } from '../utils/random';
import { getEffectiveOVR } from './rating';
import { TACTIC_MODIFIERS } from './tactics';

function getPlayersInGroup(
  playerIds: string[],
  players: Record<string, Player>,
  group: 'goalkeeper' | 'defense' | 'midfield' | 'attack',
  formation: Position[]
): Player[] {
  const result: Player[] = [];
  for (let i = 0; i < playerIds.length && i < formation.length; i++) {
    const player = players[playerIds[i]];
    if (player && POSITION_GROUPS[formation[i]] === group) {
      result.push(player);
    }
  }
  return result;
}

function averageOVR(playerList: Player[], assignedPositions: Position[]): number {
  if (playerList.length === 0) return 50;
  let total = 0;
  for (let i = 0; i < playerList.length; i++) {
    total += getEffectiveOVR(playerList[i], assignedPositions[i] || playerList[i].position);
  }
  return total / playerList.length;
}

function getFormationPositions(team: Team): Position[] {
  return FORMATIONS[team.tactics.formation];
}

export function simulateMatch(
  home: Team,
  away: Team,
  players: Record<string, Player>,
  seed: number
): MatchResult {
  const rng = createRng(seed);
  const homeFormation = getFormationPositions(home);
  const awayFormation = getFormationPositions(away);

  const homeStarting = home.startingElevenIds;
  const awayStarting = away.startingElevenIds;

  // Calculate group strengths
  const homeAttackers = getPlayersInGroup(homeStarting, players, 'attack', homeFormation);
  const homeDefenders = getPlayersInGroup(homeStarting, players, 'defense', homeFormation);
  const homeMidfielders = getPlayersInGroup(homeStarting, players, 'midfield', homeFormation);

  const awayAttackers = getPlayersInGroup(awayStarting, players, 'attack', awayFormation);
  const awayDefenders = getPlayersInGroup(awayStarting, players, 'defense', awayFormation);
  const awayMidfielders = getPlayersInGroup(awayStarting, players, 'midfield', awayFormation);

  const homeAttackPositions = homeFormation.filter(p => POSITION_GROUPS[p] === 'attack');
  const homeDefensePositions = homeFormation.filter(p => POSITION_GROUPS[p] === 'defense');
  const awayAttackPositions = awayFormation.filter(p => POSITION_GROUPS[p] === 'attack');
  const awayDefensePositions = awayFormation.filter(p => POSITION_GROUPS[p] === 'defense');

  let homeAttackStr = averageOVR(homeAttackers, homeAttackPositions);
  let homeDefenseStr = averageOVR(homeDefenders, homeDefensePositions);
  let awayAttackStr = averageOVR(awayAttackers, awayAttackPositions);
  let awayDefenseStr = averageOVR(awayDefenders, awayDefensePositions);

  // Midfield contributes to both
  const homeMidPositions = homeFormation.filter(p => POSITION_GROUPS[p] === 'midfield');
  const awayMidPositions = awayFormation.filter(p => POSITION_GROUPS[p] === 'midfield');
  const homeMidStr = averageOVR(homeMidfielders, homeMidPositions);
  const awayMidStr = averageOVR(awayMidfielders, awayMidPositions);

  homeAttackStr = (homeAttackStr + homeMidStr) / 2;
  homeDefenseStr = (homeDefenseStr + homeMidStr) / 2;
  awayAttackStr = (awayAttackStr + awayMidStr) / 2;
  awayDefenseStr = (awayDefenseStr + awayMidStr) / 2;

  // Tactic modifiers
  const homeTactic = TACTIC_MODIFIERS[home.tactics.tactic];
  const awayTactic = TACTIC_MODIFIERS[away.tactics.tactic];
  homeAttackStr *= homeTactic.attackMult;
  homeDefenseStr *= homeTactic.defenseMult;
  awayAttackStr *= awayTactic.attackMult;
  awayDefenseStr *= awayTactic.defenseMult;

  // Home advantage
  homeAttackStr *= 1 + (home.homeAdvantage * 0.01);

  // Expected goals
  let homeExpGoals = (homeAttackStr / awayDefenseStr) * 1.3;
  let awayExpGoals = (awayAttackStr / homeDefenseStr) * 1.3;
  homeExpGoals = Math.max(0.3, Math.min(4.0, homeExpGoals));
  awayExpGoals = Math.max(0.3, Math.min(4.0, awayExpGoals));

  // Actual goals
  const homeGoals = Math.min(7, poissonRandom(rng, homeExpGoals));
  const awayGoals = Math.min(7, poissonRandom(rng, awayExpGoals));

  const events: MatchEvent[] = [];

  // Generate goal events
  const homePlayerList = homeStarting.map(id => players[id]).filter(Boolean);
  const awayPlayerList = awayStarting.map(id => players[id]).filter(Boolean);

  function generateGoalEvents(goals: number, teamId: string, teamPlayers: Player[]): void {
    for (let i = 0; i < goals; i++) {
      const minute = randomInt(rng, 1, 90);

      // Scorer weighted by shooting
      const scorer = weightedRandom(rng, teamPlayers.map(p => ({
        item: p,
        weight: p.attributes.shooting,
      })));
      events.push({ minute, type: 'goal', playerId: scorer.id, teamId });

      // Assister weighted by passing
      const possibleAssisters = teamPlayers.filter(p => p.id !== scorer.id);
      if (possibleAssisters.length > 0) {
        const assister = weightedRandom(rng, possibleAssisters.map(p => ({
          item: p,
          weight: p.attributes.passing,
        })));
        events.push({ minute, type: 'assist', playerId: assister.id, teamId });
      }
    }
  }

  generateGoalEvents(homeGoals, home.id, homePlayerList);
  generateGoalEvents(awayGoals, away.id, awayPlayerList);

  // Yellow cards: 0-4
  const yellowCount = randomInt(rng, 0, 4);
  const allPlayers = [
    ...homePlayerList.map(p => ({ player: p, teamId: home.id })),
    ...awayPlayerList.map(p => ({ player: p, teamId: away.id })),
  ];
  for (let i = 0; i < yellowCount && allPlayers.length > 0; i++) {
    const idx = randomInt(rng, 0, allPlayers.length - 1);
    const { player, teamId } = allPlayers[idx];
    events.push({
      minute: randomInt(rng, 1, 90),
      type: 'yellow_card',
      playerId: player.id,
      teamId,
    });
  }

  // Injuries: 0-1 (low probability)
  if (rng() < 0.15) {
    const idx = randomInt(rng, 0, allPlayers.length - 1);
    const { player, teamId } = allPlayers[idx];
    events.push({
      minute: randomInt(rng, 1, 90),
      type: 'injury',
      playerId: player.id,
      teamId,
    });
  }

  events.sort((a, b) => a.minute - b.minute);

  return {
    id: '',
    week: 0,
    homeTeamId: home.id,
    awayTeamId: away.id,
    homeGoals,
    awayGoals,
    events,
    played: true,
  };
}
