import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { Player, Team, League, Formation, Tactic, MatchResult, Season } from '../types';
import { loadGameData } from '../data';
import { generateFixtures } from '../engine/fixture-generator';
import { computeStandings } from '../engine/league-table';
import { simulateMatch } from '../engine/match-sim';
import { drainStamina, recoverStamina } from '../engine/stamina';
import { handlePromotion, advancePlayerAge, updateBudgets } from '../engine/season';
import { buyPlayer, sellPlayer, canAffordPlayer } from '../engine/transfer';
import { calculateOVR } from '../engine/rating';
import { FORMATIONS } from '../utils/constants';

export type ScreenName =
  | 'mainMenu'
  | 'leagueSelect'
  | 'teamSelect'
  | 'squad'
  | 'startingEleven'
  | 'playerProfile'
  | 'tactics'
  | 'transfers'
  | 'fixtures'
  | 'matchSim'
  | 'leagueTable'
  | 'endOfSeason';

export interface GameState {
  players: Record<string, Player>;
  teams: Record<string, Team>;
  leagues: Record<string, League>;
  season: Season | null;
  playerTeamId: string | null;
  selectedLeagueId: string | null;
  freeAgentIds: string[];
  screen: ScreenName;
  selectedPlayerId: string | null;
  lastMatchResult: MatchResult | null;

  navigate: (screen: ScreenName) => void;
  selectPlayer: (playerId: string | null) => void;
  startNewGame: (leagueId: string, teamId: string) => void;
  setStartingEleven: (playerIds: string[]) => void;
  setSubstitutes: (playerIds: string[]) => void;
  setFormation: (formation: Formation) => void;
  setTactic: (tactic: Tactic) => void;
  autoSelectSquad: (teamId: string) => void;
  simulateWeek: () => void;
  advanceSeason: () => void;
  attemptBuyPlayer: (playerId: string) => boolean;
  attemptSellPlayer: (playerId: string) => boolean;
  saveGame: () => void;
  loadSavedGame: () => boolean;
}

function autoPickStartingEleven(
  team: Team,
  players: Record<string, Player>,
  formation: Formation
): { startingIds: string[]; subIds: string[] } {
  const positions = FORMATIONS[formation];
  const available = team.playerIds
    .map((id) => players[id])
    .filter((p) => !p.injured)
    .sort((a, b) => b.overallRating - a.overallRating);

  const startingIds: string[] = [];
  const used = new Set<string>();

  for (const pos of positions) {
    const best = available.find(
      (p) => !used.has(p.id) && (p.position === pos || p.secondaryPositions.includes(pos))
    );
    if (best) {
      startingIds.push(best.id);
      used.add(best.id);
    } else {
      const fallback = available.find((p) => !used.has(p.id));
      if (fallback) {
        startingIds.push(fallback.id);
        used.add(fallback.id);
      }
    }
  }

  const subIds = available
    .filter((p) => !used.has(p.id))
    .slice(0, 7)
    .map((p) => p.id);

  return { startingIds, subIds };
}

export const useGameStore = create<GameState>()(
  immer(
    persist(
      (set, get) => ({
        players: {},
        teams: {},
        leagues: {},
        season: null,
        playerTeamId: null,
        selectedLeagueId: null,
        freeAgentIds: [],
        screen: 'mainMenu',
        selectedPlayerId: null,
        lastMatchResult: null,

        navigate: (screen) =>
          set((state) => {
            state.screen = screen;
          }),

        selectPlayer: (playerId) =>
          set((state) => {
            state.selectedPlayerId = playerId;
          }),

        startNewGame: (leagueId, teamId) =>
          set((state) => {
            const data = loadGameData();
            state.players = data.players;
            state.teams = data.teams;
            state.leagues = data.leagues;
            state.freeAgentIds = data.freeAgentIds;
            state.playerTeamId = teamId;
            state.selectedLeagueId = leagueId;
            state.teams[teamId].isPlayerControlled = true;

            const year = new Date().getFullYear();
            const allFixtures: MatchResult[] = [];
            for (const league of Object.values(state.leagues)) {
              const fixtures = generateFixtures(league.teamIds, year);
              allFixtures.push(...fixtures);
            }

            state.season = {
              year,
              currentWeek: 1,
              totalWeeks: 34,
              fixtures: allFixtures,
              transferWindowOpen: true,
              completed: false,
            };

            for (const team of Object.values(state.teams)) {
              const { startingIds, subIds } = autoPickStartingEleven(
                team,
                state.players,
                team.tactics.formation
              );
              state.teams[team.id].startingElevenIds = startingIds;
              state.teams[team.id].substituteBenchIds = subIds;
            }

            state.screen = 'squad';
          }),

        setStartingEleven: (playerIds) =>
          set((state) => {
            if (!state.playerTeamId) return;
            state.teams[state.playerTeamId].startingElevenIds = playerIds;
          }),

        setSubstitutes: (playerIds) =>
          set((state) => {
            if (!state.playerTeamId) return;
            state.teams[state.playerTeamId].substituteBenchIds = playerIds;
          }),

        setFormation: (formation) =>
          set((state) => {
            if (!state.playerTeamId) return;
            state.teams[state.playerTeamId].tactics.formation = formation;
          }),

        setTactic: (tactic) =>
          set((state) => {
            if (!state.playerTeamId) return;
            state.teams[state.playerTeamId].tactics.tactic = tactic;
          }),

        autoSelectSquad: (teamId) =>
          set((state) => {
            const team = state.teams[teamId];
            const { startingIds, subIds } = autoPickStartingEleven(
              team,
              state.players,
              team.tactics.formation
            );
            state.teams[teamId].startingElevenIds = startingIds;
            state.teams[teamId].substituteBenchIds = subIds;
          }),

        simulateWeek: () =>
          set((state) => {
            if (!state.season || !state.playerTeamId) return;
            const week = state.season.currentWeek;

            for (const team of Object.values(state.teams)) {
              if (!team.isPlayerControlled) {
                const { startingIds, subIds } = autoPickStartingEleven(
                  team,
                  state.players,
                  team.tactics.formation
                );
                state.teams[team.id].startingElevenIds = startingIds;
                state.teams[team.id].substituteBenchIds = subIds;
              }
            }

            const weekFixtures = state.season.fixtures.filter(
              (f) => f.week === week && !f.played
            );

            let playerMatchResult: MatchResult | null = null;

            for (const fixture of weekFixtures) {
              const idx = state.season.fixtures.findIndex((f) => f.id === fixture.id);
              if (idx === -1) continue;

              const home = state.teams[fixture.homeTeamId];
              const away = state.teams[fixture.awayTeamId];
              const seed = week * 1000 + idx;

              const result = simulateMatch(home, away, state.players, seed);
              result.id = fixture.id;
              result.week = fixture.week;
              state.season.fixtures[idx] = result;

              if (
                fixture.homeTeamId === state.playerTeamId ||
                fixture.awayTeamId === state.playerTeamId
              ) {
                playerMatchResult = result;
              }
            }

            state.lastMatchResult = playerMatchResult;

            for (const league of Object.values(state.leagues)) {
              const leagueFixtures = state.season.fixtures.filter(
                (f) =>
                  league.teamIds.includes(f.homeTeamId) &&
                  league.teamIds.includes(f.awayTeamId)
              );
              state.leagues[league.id].standings = computeStandings(
                leagueFixtures,
                league.teamIds
              );
            }

            for (const player of Object.values(state.players)) {
              if (!player.teamId) continue;
              const team = state.teams[player.teamId];
              const isStarter = team.startingElevenIds.includes(player.id);
              const didPlay = isStarter || team.substituteBenchIds.includes(player.id);
              state.players[player.id].currentStamina = isStarter
                ? drainStamina(player, true)
                : recoverStamina(player, didPlay);
            }

            if (week >= state.season.totalWeeks) {
              state.season.completed = true;
              state.screen = 'endOfSeason';
            } else {
              state.season.currentWeek = week + 1;
              state.screen = 'matchSim';
            }

            if (week === 17) {
              state.season.transferWindowOpen = true;
            } else if (week === 20) {
              state.season.transferWindowOpen = false;
            }
          }),

        advanceSeason: () =>
          set((state) => {
            if (!state.season) return;

            const result = handlePromotion(state.leagues, state.teams);
            for (const league of Object.values(state.leagues)) {
              updateBudgets(
                state.teams,
                state.leagues[league.id].standings,
                league.tier
              );
            }

            advancePlayerAge(state.players);

            for (const player of Object.values(state.players)) {
              state.players[player.id].currentStamina = 100;
              state.players[player.id].overallRating = calculateOVR(
                player.attributes,
                player.position
              );
            }

            const year = state.season.year + 1;
            const allFixtures: MatchResult[] = [];
            for (const league of Object.values(state.leagues)) {
              const fixtures = generateFixtures(league.teamIds, year);
              allFixtures.push(...fixtures);
              state.leagues[league.id].standings = league.teamIds.map((teamId) => ({
                teamId,
                played: 0,
                won: 0,
                drawn: 0,
                lost: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                goalDifference: 0,
                points: 0,
              }));
            }

            state.season = {
              year,
              currentWeek: 1,
              totalWeeks: 34,
              fixtures: allFixtures,
              transferWindowOpen: true,
              completed: false,
            };

            for (const team of Object.values(state.teams)) {
              const { startingIds, subIds } = autoPickStartingEleven(
                team,
                state.players,
                team.tactics.formation
              );
              state.teams[team.id].startingElevenIds = startingIds;
              state.teams[team.id].substituteBenchIds = subIds;
            }

            state.screen = 'squad';
          }),

        attemptBuyPlayer: (playerId) => {
          const state = get();
          if (!state.playerTeamId) return false;
          const team = state.teams[state.playerTeamId];
          const player = state.players[playerId];
          if (!canAffordPlayer(team, player)) return false;

          set((s) => {
            buyPlayer(s.teams, s.players, s.playerTeamId!, playerId, player.marketValue);
            s.freeAgentIds = s.freeAgentIds.filter((id) => id !== playerId);
          });
          return true;
        },

        attemptSellPlayer: (playerId) => {
          const state = get();
          if (!state.playerTeamId) return false;

          set((s) => {
            sellPlayer(s.teams, s.players, s.playerTeamId!, playerId, s.players[playerId].marketValue);
            s.freeAgentIds.push(playerId);
          });
          return true;
        },

        saveGame: () => {},
        loadSavedGame: () => {
          const state = get();
          return state.season !== null;
        },
      }),
      {
        name: 'champion-manager-save',
        partialize: (state) => ({
          players: state.players,
          teams: state.teams,
          leagues: state.leagues,
          season: state.season,
          playerTeamId: state.playerTeamId,
          selectedLeagueId: state.selectedLeagueId,
          freeAgentIds: state.freeAgentIds,
        }),
      }
    )
  )
);
