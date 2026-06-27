import { Team, Player, MatchResult, MatchEvent, MatchStatEvent, TeamMatchStats, Position } from '../types';
import { FORMATIONS, POSITION_GROUPS } from '../utils/constants';
import { createRng, randomInt, weightedRandom, poissonRandom } from '../utils/random';
import { getEffectiveOVR } from './rating';
import { TACTIC_DEFINITIONS, calculateTacticFit, getCounterModifier } from './tactics';

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

  // Player lists for tactic fit and goal events
  const homePlayerList = homeStarting.map(id => players[id]).filter(Boolean);
  const awayPlayerList = awayStarting.map(id => players[id]).filter(Boolean);

  // Tactic modifiers
  const homeTacticDef = TACTIC_DEFINITIONS[home.tactics.tactic];
  const awayTacticDef = TACTIC_DEFINITIONS[away.tactics.tactic];
  homeAttackStr *= homeTacticDef.attackMult;
  homeDefenseStr *= homeTacticDef.defenseMult;
  awayAttackStr *= awayTacticDef.attackMult;
  awayDefenseStr *= awayTacticDef.defenseMult;

  // Tactic fit
  const homeFit = calculateTacticFit(homePlayerList, homeTacticDef);
  const awayFit = calculateTacticFit(awayPlayerList, awayTacticDef);
  homeAttackStr *= homeFit;
  homeDefenseStr *= homeFit;
  awayAttackStr *= awayFit;
  awayDefenseStr *= awayFit;

  // Counter bonus
  const homeCounterMod = getCounterModifier(home.tactics.tactic, away.tactics.tactic);
  const awayCounterMod = getCounterModifier(away.tactics.tactic, home.tactics.tactic);
  homeAttackStr *= homeCounterMod;
  awayAttackStr *= awayCounterMod;

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

  function generateGoalEvents(goals: number, teamId: string, teamPlayers: Player[]): void {
    for (let i = 0; i < goals; i++) {
      const minute = randomInt(rng, 1, 90);

      const scorer = weightedRandom(rng, teamPlayers.map(p => ({
        item: p,
        weight: p.attributes.shooting,
      })));

      let detail: string | undefined;
      const possibleAssisters = teamPlayers.filter(p => p.id !== scorer.id);
      if (possibleAssisters.length > 0) {
        const assister = weightedRandom(rng, possibleAssisters.map(p => ({
          item: p,
          weight: p.attributes.passing,
        })));
        detail = `Asist: ${assister.name}`;
      }

      events.push({ minute, type: 'goal', playerId: scorer.id, teamId, detail });
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

  // Generate stat events (after all existing RNG calls to preserve determinism)
  const statEvents: MatchStatEvent[] = [];

  function generateTeamStats(teamId: string, goals: number, yellowCards: number): TeamMatchStats {
    const totalShots = goals * 3 + poissonRandom(rng, 4);
    const shotsOnTarget = Math.min(totalShots, goals + randomInt(rng, 0, Math.max(0, totalShots - goals)));
    const shotsOffTarget = totalShots - shotsOnTarget;
    const corners = randomInt(rng, 2, 8);
    const fouls = yellowCards * 2 + randomInt(rng, 3, 8);
    const offsides = randomInt(rng, 0, 5);

    for (let i = 0; i < shotsOnTarget; i++) {
      statEvents.push({ minute: randomInt(rng, 1, 90), type: 'shot_on', teamId });
    }
    for (let i = 0; i < shotsOffTarget; i++) {
      statEvents.push({ minute: randomInt(rng, 1, 90), type: 'shot_off', teamId });
    }
    for (let i = 0; i < corners; i++) {
      statEvents.push({ minute: randomInt(rng, 1, 90), type: 'corner', teamId });
    }
    for (let i = 0; i < fouls; i++) {
      statEvents.push({ minute: randomInt(rng, 1, 90), type: 'foul', teamId });
    }
    for (let i = 0; i < offsides; i++) {
      statEvents.push({ minute: randomInt(rng, 1, 90), type: 'offside', teamId });
    }

    return { shotsOnTarget, shotsOffTarget, corners, fouls, offsides };
  }

  const homeYellows = events.filter(e => e.teamId === home.id && e.type === 'yellow_card').length;
  const awayYellows = events.filter(e => e.teamId === away.id && e.type === 'yellow_card').length;
  const homeStats = generateTeamStats(home.id, homeGoals, homeYellows);
  const awayStats = generateTeamStats(away.id, awayGoals, awayYellows);

  statEvents.sort((a, b) => a.minute - b.minute);

  return {
    id: '',
    week: 0,
    homeTeamId: home.id,
    awayTeamId: away.id,
    homeGoals,
    awayGoals,
    events,
    played: true,
    stats: { home: homeStats, away: awayStats },
    statEvents,
  };
}
