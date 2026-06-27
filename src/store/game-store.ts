import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { Player, Team, League, Formation, Tactic, MatchResult, Season, TransferOffer, Notification } from '../types';
import { loadGameData } from '../data';
import { generateFixtures } from '../engine/fixture-generator';
import { computeStandings } from '../engine/league-table';
import { simulateMatch } from '../engine/match-sim';
import { updateStamina } from '../engine/stamina';
import { handlePromotion, advancePlayerAge, updateBudgets } from '../engine/season';
import { buyPlayer, sellPlayer, canAffordPlayer, evaluateTransferOffer, generateAITransfers } from '../engine/transfer';
import { getBestTacticForSquad } from '../engine/tactics';
import { applyTraining, TrainingType, TrainingResult } from '../engine/training';
import { generateYouthPlayersForTeam, applyPlayerDevelopment } from '../engine/youth';
import { FORMATIONS } from '../utils/constants';

export type ScreenName =
  | 'mainMenu'
  | 'leagueSelect'
  | 'teamSelect'
  | 'squad'
  | 'playerProfile'
  | 'transfers'
  | 'matchSim'
  | 'leagueTable'
  | 'endOfSeason'
  | 'teamView';

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
  selectedTeamId: string | null;
  pendingOffers: TransferOffer[];
  notifications: Notification[];
  lastTrainingResults: TrainingResult[];

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
  sendTransferOffer: (playerId: string, fee: number) => void;
  performTraining: (trainingType: TrainingType) => void;
  markNotificationRead: (notificationId: string) => void;
  viewTeam: (teamId: string) => void;
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

let notifCounter = 0;
function createNotification(week: number, type: Notification['type'], title: string, message: string): Notification {
  return { id: `notif_${Date.now()}_${notifCounter++}`, week, type, title, message, read: false };
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
        selectedTeamId: null,
        pendingOffers: [],
        notifications: [],
        lastTrainingResults: [],

        navigate: (screen) =>
          set((state) => {
            state.screen = screen;
          }),

        selectPlayer: (playerId) =>
          set((state) => {
            state.selectedPlayerId = playerId;
          }),

        viewTeam: (teamId) =>
          set((state) => {
            state.selectedTeamId = teamId;
            state.screen = 'teamView';
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
            state.pendingOffers = [];
            state.notifications = [];
            state.lastTrainingResults = [];

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
              trainedThisWeek: false,
            };

            for (const team of Object.values(state.teams)) {
              const { startingIds, subIds } = autoPickStartingEleven(
                team,
                state.players,
                team.tactics.formation
              );
              state.teams[team.id].startingElevenIds = startingIds;
              state.teams[team.id].substituteBenchIds = subIds;

              if (!team.isPlayerControlled) {
                const squadPlayers = team.playerIds.map(id => state.players[id]).filter(Boolean);
                state.teams[team.id].tactics.tactic = getBestTacticForSquad(squadPlayers);
              }
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

        sendTransferOffer: (playerId, fee) =>
          set((state) => {
            if (!state.playerTeamId || !state.season) return;
            const player = state.players[playerId];
            if (!player || !player.teamId) return;

            const offer: TransferOffer = {
              id: `offer_${Date.now()}_${playerId}`,
              playerId,
              fromTeamId: player.teamId,
              toTeamId: state.playerTeamId,
              fee,
              wageOffer: player.wage,
              status: 'pending',
            };
            state.pendingOffers.push(offer);
            state.notifications.push(
              createNotification(state.season.currentWeek, 'transfer', 'Teklif Gönderildi',
                `${player.name} için ${(fee / 1000000).toFixed(1)}M₺ teklif gönderildi.`)
            );
          }),

        performTraining: (trainingType) =>
          set((state) => {
            if (!state.playerTeamId || !state.season || state.season.trainedThisWeek) return;
            const team = state.teams[state.playerTeamId];
            const results = applyTraining(
              state.players,
              team.playerIds,
              trainingType,
              team.tactics.tactic
            );
            state.season.trainedThisWeek = true;
            state.lastTrainingResults = results;
          }),

        markNotificationRead: (notificationId) =>
          set((state) => {
            const notif = state.notifications.find(n => n.id === notificationId);
            if (notif) notif.read = true;
          }),

        simulateWeek: () =>
          set((state) => {
            if (!state.season || !state.playerTeamId) return;
            const week = state.season.currentWeek;

            // Process pending transfer offers
            const pendingOffers = state.pendingOffers.filter(o => o.status === 'pending');
            for (const offer of pendingOffers) {
              const player = state.players[offer.playerId];
              if (!player || !offer.fromTeamId) continue;
              const sellerTeam = state.teams[offer.fromTeamId];
              const buyerTeam = state.teams[offer.toTeamId];
              if (!sellerTeam || !buyerTeam) continue;

              const accepted = evaluateTransferOffer(offer, player, sellerTeam, week);
              const offerInState = state.pendingOffers.find(o => o.id === offer.id);
              if (!offerInState) continue;

              if (accepted && canAffordPlayer(buyerTeam, player)) {
                offerInState.status = 'accepted';
                buyPlayer(state.teams, state.players, offer.toTeamId, offer.playerId, offer.fee);
                state.notifications.push(
                  createNotification(week, 'transfer', 'Transfer Kabul!',
                    `${player.name} transferi kabul edildi! Hoş geldin!`)
                );
              } else {
                offerInState.status = 'rejected';
                state.notifications.push(
                  createNotification(week, 'transfer', 'Transfer Reddedildi',
                    `${player.name} için gönderdiğiniz teklif reddedildi.`)
                );
              }
            }

            // AI squad selection
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

              // Update season stats from match events
              for (const event of result.events) {
                const p = state.players[event.playerId];
                if (!p) continue;
                if (event.type === 'goal') {
                  p.seasonStats.goals++;
                  if (event.detail?.startsWith('Asist:')) {
                    const assistName = event.detail.replace('Asist: ', '');
                    const homePlayerIds = home.startingElevenIds;
                    const awayPlayerIds = away.startingElevenIds;
                    const allIds = [...homePlayerIds, ...awayPlayerIds];
                    const assister = allIds.map(id => state.players[id]).find(pl => pl && pl.name === assistName);
                    if (assister) assister.seasonStats.assists++;
                  }
                } else if (event.type === 'yellow_card') {
                  p.seasonStats.yellowCards++;
                } else if (event.type === 'injury') {
                  p.injured = true;
                  p.injuryWeeks = 1 + Math.floor(Math.random() * 3);
                  if (p.teamId === state.playerTeamId) {
                    state.notifications.push(
                      createNotification(week, 'injury', 'Sakatlık!',
                        `${p.name} sakatlandı! ${p.injuryWeeks} hafta sahalardan uzak kalacak.`)
                    );
                  }
                }
              }

              // Update matchesPlayed for starters
              for (const pid of [...home.startingElevenIds, ...away.startingElevenIds]) {
                const p = state.players[pid];
                if (p) p.seasonStats.matchesPlayed++;
              }
            }

            state.lastMatchResult = playerMatchResult;

            // Update standings
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

            // Update stamina using new consecutive starts system
            for (const player of Object.values(state.players)) {
              if (!player.teamId) continue;
              const team = state.teams[player.teamId];
              if (!team) continue;
              const isStarter = team.startingElevenIds.includes(player.id);
              const result = updateStamina(player, isStarter);
              player.currentStamina = result.stamina;
              player.consecutiveStarts = result.consecutiveStarts;
            }

            // Heal injuries
            for (const player of Object.values(state.players)) {
              if (player.injured && player.injuryWeeks > 0) {
                player.injuryWeeks--;
                if (player.injuryWeeks <= 0) {
                  player.injured = false;
                }
              }
            }

            // AI transfers (during transfer window)
            if (state.season.transferWindowOpen) {
              const prevFreeCount = state.freeAgentIds.length;
              generateAITransfers(state.teams, state.players, state.freeAgentIds);
              if (state.freeAgentIds.length < prevFreeCount) {
                state.notifications.push(
                  createNotification(week, 'transfer', 'AI Transferleri', 'Bazı takımlar serbest oyuncu transferi yaptı.')
                );
              }
            }

            if (week >= state.season.totalWeeks) {
              state.season.completed = true;
              state.screen = 'endOfSeason';
            } else {
              state.season.currentWeek = week + 1;
              state.season.trainedThisWeek = false;
              state.screen = 'matchSim';
            }

            if (week === 17) {
              state.season.transferWindowOpen = true;
              state.notifications.push(
                createNotification(week, 'info', 'Transfer Penceresi', 'Ara transfer penceresi açıldı!')
              );
            } else if (week === 20) {
              state.season.transferWindowOpen = false;
              state.notifications.push(
                createNotification(week, 'info', 'Transfer Penceresi', 'Transfer penceresi kapandı.')
              );
            }
          }),

        advanceSeason: () =>
          set((state) => {
            if (!state.season) return;

            handlePromotion(state.leagues, state.teams);
            for (const league of Object.values(state.leagues)) {
              updateBudgets(
                state.teams,
                state.leagues[league.id].standings,
                league.tier
              );
            }

            advancePlayerAge(state.players);

            // Apply player development/aging
            for (const player of Object.values(state.players)) {
              applyPlayerDevelopment(player);
              player.currentStamina = 100;
              player.consecutiveStarts = 0;
              player.seasonStats = { goals: 0, assists: 0, yellowCards: 0, matchesPlayed: 0 };
            }

            // Generate youth players
            const allTeamIds = Object.keys(state.teams);
            for (let i = 0; i < allTeamIds.length; i++) {
              const teamId = allTeamIds[i];
              const team = state.teams[teamId];
              const youthPlayers = generateYouthPlayersForTeam(teamId, state.season.year, i);
              for (const youth of youthPlayers) {
                state.players[youth.id] = youth;
                team.playerIds.push(youth.id);
                team.currentWageTotal += youth.wage;
              }
              if (teamId === state.playerTeamId && youthPlayers.length > 0) {
                state.notifications.push(
                  createNotification(state.season.currentWeek, 'info', 'Alt Yapı',
                    `Alt yapıdan ${youthPlayers.length} genç oyuncu kadronuza katıldı!`)
                );
              }
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
              trainedThisWeek: false,
            };

            state.pendingOffers = [];

            for (const team of Object.values(state.teams)) {
              const { startingIds, subIds } = autoPickStartingEleven(
                team,
                state.players,
                team.tactics.formation
              );
              state.teams[team.id].startingElevenIds = startingIds;
              state.teams[team.id].substituteBenchIds = subIds;

              if (!team.isPlayerControlled) {
                const squadPlayers = team.playerIds.map(id => state.players[id]).filter(Boolean);
                state.teams[team.id].tactics.tactic = getBestTacticForSquad(squadPlayers);
              }
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
        version: 3,
        partialize: (state) => ({
          players: state.players,
          teams: state.teams,
          leagues: state.leagues,
          season: state.season,
          playerTeamId: state.playerTeamId,
          selectedLeagueId: state.selectedLeagueId,
          freeAgentIds: state.freeAgentIds,
          pendingOffers: state.pendingOffers,
          notifications: state.notifications,
        }),
        migrate: (persisted: unknown, version: number) => {
          const state = persisted as Record<string, unknown>;
          if (version < 2 && state.teams) {
            const tacticMap: Record<string, string> = { balanced: 'tikiTaka', attack: 'gegenpressing', defense: 'parkTheBus' };
            for (const team of Object.values(state.teams as Record<string, { tactics: { tactic: string } }>)) {
              if (tacticMap[team.tactics.tactic]) {
                team.tactics.tactic = tacticMap[team.tactics.tactic];
              }
            }
          }
          if (version < 3) {
            if (state.players) {
              for (const player of Object.values(state.players as Record<string, Record<string, unknown>>)) {
                if (player.consecutiveStarts === undefined) player.consecutiveStarts = 0;
                if (!player.seasonStats) player.seasonStats = { goals: 0, assists: 0, yellowCards: 0, matchesPlayed: 0 };
              }
            }
            if (state.season && typeof state.season === 'object') {
              const season = state.season as Record<string, unknown>;
              if (season.trainedThisWeek === undefined) season.trainedThisWeek = false;
            }
            if (!state.pendingOffers) state.pendingOffers = [];
            if (!state.notifications) state.notifications = [];
          }
          return state as unknown as GameState;
        },
      }
    )
  )
);
