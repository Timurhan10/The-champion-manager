import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useGameStore } from '../store/game-store';
import { MatchEvent, MatchStatEvent } from '../types';
import { generateCommentary, CommentaryLine } from '../utils/commentary';

type Speed = 'normal' | 'fast' | 'instant';

const SPEED_MS: Record<Exclude<Speed, 'instant'>, number> = {
  normal: 1000,
  fast: 300,
};

const EVENT_ICONS: Record<string, string> = {
  goal: '⚽',
  yellow_card: '🟨',
  red_card: '🟥',
  injury: '🤕',
  substitution: '🔄',
  assist: '⚽',
};

function StatRow({ label, home, away }: { label: string; home: number; away: number }) {
  const total = home + away || 1;
  const homeWidth = (home / total) * 100;
  return (
    <div className="mb-3">
      <div className="flex items-center gap-3">
        <span className="text-sm w-8 text-right font-medium">{home}</span>
        <div className="flex-1 h-2.5 bg-gray-700 rounded-full overflow-hidden flex">
          <div className="h-full bg-emerald-500 rounded-l-full" style={{ width: `${homeWidth}%` }} />
          <div className="h-full bg-blue-500 rounded-r-full" style={{ width: `${100 - homeWidth}%` }} />
        </div>
        <span className="text-sm w-8 font-medium">{away}</span>
      </div>
      <p className="text-center text-gray-400 text-xs mt-0.5">{label}</p>
    </div>
  );
}

function computeRunningStats(
  statEvents: MatchStatEvent[],
  teamId: string,
  upToMinute: number
) {
  let shotsOnTarget = 0, shotsOffTarget = 0, corners = 0, fouls = 0, offsides = 0;
  for (const se of statEvents) {
    if (se.teamId !== teamId || se.minute > upToMinute) continue;
    switch (se.type) {
      case 'shot_on': shotsOnTarget++; break;
      case 'shot_off': shotsOffTarget++; break;
      case 'corner': corners++; break;
      case 'foul': fouls++; break;
      case 'offside': offsides++; break;
    }
  }
  return { shotsOnTarget, shotsOffTarget, corners, fouls, offsides };
}

export default function MatchSimScreen() {
  const navigate = useGameStore((s) => s.navigate);
  const lastMatchResult = useGameStore((s) => s.lastMatchResult);
  const teams = useGameStore((s) => s.teams);
  const allPlayers = useGameStore((s) => s.players);
  const playerTeamId = useGameStore((s) => s.playerTeamId);

  const [currentMinute, setCurrentMinute] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<Speed>('normal');
  const [isHalfTime, setIsHalfTime] = useState(false);
  const [isFullTime, setIsFullTime] = useState(false);
  const [substitutionsMade, setSubstitutionsMade] = useState(0);
  const [showSubModal, setShowSubModal] = useState(false);
  const [subStep, setSubStep] = useState<'pickOut' | 'pickIn'>('pickOut');
  const [playerOut, setPlayerOut] = useState<string | null>(null);
  const [localEvents, setLocalEvents] = useState<MatchEvent[]>([]);
  const [activeLineup, setActiveLineup] = useState<string[]>([]);
  const [activeBench, setActiveBench] = useState<string[]>([]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isPlayerMatch = lastMatchResult &&
    (lastMatchResult.homeTeamId === playerTeamId || lastMatchResult.awayTeamId === playerTeamId);

  const homeTeam = lastMatchResult ? teams[lastMatchResult.homeTeamId] : null;
  const awayTeam = lastMatchResult ? teams[lastMatchResult.awayTeamId] : null;

  const commentary = useMemo<CommentaryLine[]>(() => {
    if (!lastMatchResult || !homeTeam || !awayTeam) return [];
    const playerNames: Record<string, string> = {};
    for (const e of lastMatchResult.events) {
      if (allPlayers[e.playerId]) playerNames[e.playerId] = allPlayers[e.playerId].name;
    }
    return generateCommentary(
      lastMatchResult.events,
      lastMatchResult.statEvents ?? [],
      homeTeam.shortName,
      awayTeam.shortName,
      lastMatchResult.homeTeamId,
      playerNames,
      lastMatchResult.homeGoals,
      lastMatchResult.awayGoals
    );
  }, [lastMatchResult, homeTeam, awayTeam, allPlayers]);

  useEffect(() => {
    if (!lastMatchResult) return;
    setLocalEvents([...lastMatchResult.events]);
    setCurrentMinute(0);
    setIsPlaying(true);
    setIsHalfTime(false);
    setIsFullTime(false);
    setSubstitutionsMade(0);
    setShowSubModal(false);
    setSpeed('normal');

    if (playerTeamId) {
      const team = teams[playerTeamId];
      if (team) {
        setActiveLineup([...team.startingElevenIds]);
        setActiveBench([...team.substituteBenchIds]);
      }
    }
  }, [lastMatchResult, playerTeamId, teams]);

  useEffect(() => {
    if (!isPlaying || isHalfTime || showSubModal) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    if (speed === 'instant') {
      setCurrentMinute(90);
      setIsFullTime(true);
      setIsPlaying(false);
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentMinute((prev) => {
        const next = prev + 1;
        if (next === 45) {
          setIsHalfTime(true);
          setIsPlaying(false);
          return 45;
        }
        if (next >= 90) {
          setIsFullTime(true);
          setIsPlaying(false);
          return 90;
        }
        return next;
      });
    }, SPEED_MS[speed]);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, isHalfTime, showSubModal]);

  const resumeFromHalfTime = useCallback(() => {
    setIsHalfTime(false);
    setIsPlaying(true);
  }, []);

  const openSubModal = useCallback(() => {
    setIsPlaying(false);
    setShowSubModal(true);
    setSubStep('pickOut');
    setPlayerOut(null);
  }, []);

  const closeSubModal = useCallback(() => {
    setShowSubModal(false);
    setIsPlaying(true);
  }, []);

  const confirmSub = useCallback((inPlayerId: string) => {
    if (!playerOut || !playerTeamId) return;

    const outPlayer = allPlayers[playerOut];
    const inPlayer = allPlayers[inPlayerId];

    setActiveLineup((prev) => prev.map((id) => (id === playerOut ? inPlayerId : id)));
    setActiveBench((prev) => [
      ...prev.filter((id) => id !== inPlayerId),
      playerOut,
    ]);

    const subEvent: MatchEvent = {
      minute: currentMinute,
      type: 'substitution',
      playerId: inPlayerId,
      teamId: playerTeamId,
      detail: `${outPlayer?.name ?? '?'} OUT, ${inPlayer?.name ?? '?'} IN`,
    };

    setLocalEvents((prev) => [...prev, subEvent].sort((a, b) => a.minute - b.minute));
    setSubstitutionsMade((prev) => prev + 1);
    setShowSubModal(false);
    setIsPlaying(true);
  }, [playerOut, playerTeamId, allPlayers, currentMinute]);

  if (!lastMatchResult) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Mac Sonucu</h1>
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400 text-lg mb-6">Bu hafta maciniz yok</p>
          <button
            onClick={() => navigate('squad')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Devam Et
          </button>
        </div>
      </div>
    );
  }

  const visibleEvents = localEvents.filter((e) => e.minute <= currentMinute);
  const currentHomeGoals = visibleEvents.filter(
    (e) => e.type === 'goal' && e.teamId === lastMatchResult.homeTeamId
  ).length;
  const currentAwayGoals = visibleEvents.filter(
    (e) => e.type === 'goal' && e.teamId === lastMatchResult.awayTeamId
  ).length;

  const homeMidfield = homeTeam?.playerIds
    .map((id) => allPlayers[id])
    .filter((p) => ['CM', 'CDM', 'CAM', 'LM', 'RM'].includes(p?.position))
    .reduce((sum, p) => sum + (p?.overallRating ?? 0), 0) ?? 0;
  const awayMidfield = awayTeam?.playerIds
    .map((id) => allPlayers[id])
    .filter((p) => ['CM', 'CDM', 'CAM', 'LM', 'RM'].includes(p?.position))
    .reduce((sum, p) => sum + (p?.overallRating ?? 0), 0) ?? 0;
  const totalMid = homeMidfield + awayMidfield || 1;
  const homePossession = Math.round((homeMidfield / totalMid) * 100);

  const hasStatEvents = !!lastMatchResult.statEvents && lastMatchResult.statEvents.length > 0;
  const homeRunning = hasStatEvents
    ? computeRunningStats(lastMatchResult.statEvents!, lastMatchResult.homeTeamId, currentMinute)
    : null;
  const awayRunning = hasStatEvents
    ? computeRunningStats(lastMatchResult.statEvents!, lastMatchResult.awayTeamId, currentMinute)
    : null;

  const visibleCommentary = commentary.filter(c => c.minute <= currentMinute);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 max-w-lg mx-auto">
      {/* Match Clock */}
      <div className="text-center mb-4">
        <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${
          isFullTime ? 'bg-red-600' : isHalfTime ? 'bg-yellow-600' : 'bg-emerald-600'
        }`}>
          {isFullTime ? 'Mac Sonu' : isHalfTime ? 'Devre Arasi' : `${currentMinute}'`}
        </div>
      </div>

      {/* Score Header */}
      <div className="bg-gray-800 rounded-lg p-6 mb-4">
        <div className="flex items-center justify-center gap-6">
          <div className="text-center flex-1">
            <div
              className="w-12 h-12 rounded-full mx-auto mb-2 border-2 border-gray-600"
              style={{ backgroundColor: homeTeam?.colors.primary ?? '#444' }}
            />
            <p className="font-bold text-lg">{homeTeam?.shortName ?? '?'}</p>
          </div>
          <div className="text-center">
            <p className="text-5xl font-bold tabular-nums">
              {currentHomeGoals} <span className="text-gray-500">-</span> {currentAwayGoals}
            </p>
          </div>
          <div className="text-center flex-1">
            <div
              className="w-12 h-12 rounded-full mx-auto mb-2 border-2 border-gray-600"
              style={{ backgroundColor: awayTeam?.colors.primary ?? '#444' }}
            />
            <p className="font-bold text-lg">{awayTeam?.shortName ?? '?'}</p>
          </div>
        </div>
      </div>

      {/* Speed Controls */}
      {!isFullTime && (
        <div className="flex items-center justify-center gap-2 mb-4">
          <button
            onClick={() => { setIsPlaying(!isPlaying); }}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              isPlaying ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
            disabled={isHalfTime || showSubModal}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          {(['normal', 'fast', 'instant'] as Speed[]).map((s) => (
            <button
              key={s}
              onClick={() => {
                setSpeed(s);
                if (!isPlaying && !isHalfTime && !showSubModal) setIsPlaying(true);
              }}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                speed === s ? 'bg-emerald-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {s === 'normal' ? 'Normal' : s === 'fast' ? 'Hizli' : 'Aninda'}
            </button>
          ))}
        </div>
      )}

      {/* Substitution Button */}
      {isPlayerMatch && !isFullTime && (
        <div className="flex justify-center mb-4">
          <button
            onClick={openSubModal}
            disabled={substitutionsMade >= 3 || showSubModal}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              substitutionsMade >= 3
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Oyuncu Degisikligi ({substitutionsMade}/3)
          </button>
        </div>
      )}

      {/* Half-Time Overlay */}
      {isHalfTime && !showSubModal && (
        <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-6 mb-4 text-center">
          <h2 className="text-xl font-bold text-yellow-400 mb-2">Devre Arasi</h2>
          <p className="text-gray-300 text-sm mb-4">
            {currentHomeGoals} - {currentAwayGoals}
          </p>
          <div className="flex justify-center gap-3">
            {isPlayerMatch && substitutionsMade < 3 && (
              <button
                onClick={openSubModal}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Degisiklik Yap
              </button>
            )}
            <button
              onClick={resumeFromHalfTime}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
            >
              2. Yariyi Baslat
            </button>
          </div>
        </div>
      )}

      {/* Substitution Modal */}
      {showSubModal && (
        <div className="bg-gray-800 border border-blue-600/50 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">
              {subStep === 'pickOut' ? 'Cikarilacak Oyuncu' : 'Girecek Oyuncu'}
            </h2>
            <button onClick={closeSubModal} className="text-gray-400 hover:text-white text-sm">
              Iptal
            </button>
          </div>

          {subStep === 'pickOut' && (
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {activeLineup.map((id) => {
                const p = allPlayers[id];
                if (!p) return null;
                return (
                  <button
                    key={id}
                    onClick={() => {
                      setPlayerOut(id);
                      setSubStep('pickIn');
                    }}
                    className="w-full flex items-center justify-between bg-gray-700 hover:bg-gray-600 rounded px-3 py-2 text-sm transition-colors"
                  >
                    <span>
                      <span className="text-gray-400 mr-2">{p.position}</span>
                      {p.name}
                    </span>
                    <span className="text-emerald-400">{p.overallRating}</span>
                  </button>
                );
              })}
            </div>
          )}

          {subStep === 'pickIn' && (
            <div className="space-y-1 max-h-60 overflow-y-auto">
              <p className="text-xs text-gray-400 mb-2">
                Cikan: {allPlayers[playerOut!]?.name ?? '?'}
              </p>
              {activeBench.map((id) => {
                const p = allPlayers[id];
                if (!p) return null;
                return (
                  <button
                    key={id}
                    onClick={() => confirmSub(id)}
                    className="w-full flex items-center justify-between bg-gray-700 hover:bg-gray-600 rounded px-3 py-2 text-sm transition-colors"
                  >
                    <span>
                      <span className="text-gray-400 mr-2">{p.position}</span>
                      {p.name}
                    </span>
                    <span className="text-emerald-400">{p.overallRating}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Commentary */}
      {visibleCommentary.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <h2 className="text-lg font-semibold mb-3">Anlatim</h2>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {visibleCommentary.slice().reverse().slice(0, 15).map((c, i) => (
              <div key={i} className="flex gap-2 text-xs">
                <span className="text-gray-500 w-8 shrink-0 text-right">{c.minute}&apos;</span>
                <span className="text-gray-300">{c.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <h2 className="text-lg font-semibold mb-3">Istatistikler</h2>
        <StatRow label="Topa Sahip Olma (%)" home={homePossession} away={100 - homePossession} />
        {homeRunning && awayRunning && (
          <>
            <StatRow label="Isabetli Sut" home={homeRunning.shotsOnTarget} away={awayRunning.shotsOnTarget} />
            <StatRow label="Isabetsiz Sut" home={homeRunning.shotsOffTarget} away={awayRunning.shotsOffTarget} />
            <StatRow label="Korner" home={homeRunning.corners} away={awayRunning.corners} />
            <StatRow label="Faul" home={homeRunning.fouls} away={awayRunning.fouls} />
            <StatRow label="Ofsayt" home={homeRunning.offsides} away={awayRunning.offsides} />
          </>
        )}
      </div>

      {/* Event Timeline */}
      {visibleEvents.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <h2 className="text-lg font-semibold mb-3">Mac Olaylari</h2>
          <div className="space-y-2">
            {visibleEvents.map((event, i) => {
              const player = allPlayers[event.playerId];
              const isHome = event.teamId === lastMatchResult.homeTeamId;
              return (
                <div
                  key={`${event.minute}-${event.type}-${i}`}
                  className={`flex items-center gap-3 text-sm ${isHome ? '' : 'flex-row-reverse text-right'}`}
                >
                  <span className="text-gray-400 w-10 shrink-0 text-center">{event.minute}&apos;</span>
                  <span className="text-lg">{EVENT_ICONS[event.type] ?? ''}</span>
                  <span className="font-medium">{player?.name ?? '?'}</span>
                  {event.detail && <span className="text-gray-500 text-xs">({event.detail})</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Continue Button */}
      {isFullTime && (
        <button
          onClick={() => navigate('squad')}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors"
        >
          Devam Et
        </button>
      )}
    </div>
  );
}
