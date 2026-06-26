import { useGameStore } from '../store/game-store';

const EVENT_ICONS: Record<string, string> = {
  goal: '⚽',
  yellow_card: '🟨',
  red_card: '🟥',
  injury: '🤕',
  substitution: '🔄',
  assist: '⚽',
};

export default function MatchSimScreen() {
  const navigate = useGameStore((s) => s.navigate);
  const lastMatchResult = useGameStore((s) => s.lastMatchResult);
  const teams = useGameStore((s) => s.teams);
  const players = useGameStore((s) => s.players);

  if (!lastMatchResult) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Maç Sonucu</h1>
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400 text-lg mb-6">Bu hafta maçınız yok</p>
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

  const homeTeam = teams[lastMatchResult.homeTeamId];
  const awayTeam = teams[lastMatchResult.awayTeamId];
  const events = [...lastMatchResult.events].sort((a, b) => a.minute - b.minute);

  const homeMidfield = homeTeam?.playerIds
    .map((id) => players[id])
    .filter((p) => ['CM', 'CDM', 'CAM', 'LM', 'RM'].includes(p?.position))
    .reduce((sum, p) => sum + (p?.overallRating ?? 0), 0) ?? 0;

  const awayMidfield = awayTeam?.playerIds
    .map((id) => players[id])
    .filter((p) => ['CM', 'CDM', 'CAM', 'LM', 'RM'].includes(p?.position))
    .reduce((sum, p) => sum + (p?.overallRating ?? 0), 0) ?? 0;

  const totalMid = homeMidfield + awayMidfield || 1;
  const homePossession = Math.round((homeMidfield / totalMid) * 100);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Maç Sonucu</h1>

      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-center gap-6">
          <div className="text-center flex-1">
            <div
              className="w-12 h-12 rounded-full mx-auto mb-2"
              style={{ backgroundColor: homeTeam?.colors.primary ?? '#444' }}
            />
            <p className="font-bold text-lg">{homeTeam?.shortName ?? '?'}</p>
          </div>
          <div className="text-center">
            <p className="text-5xl font-bold">
              {lastMatchResult.homeGoals} <span className="text-gray-500">-</span> {lastMatchResult.awayGoals}
            </p>
          </div>
          <div className="text-center flex-1">
            <div
              className="w-12 h-12 rounded-full mx-auto mb-2"
              style={{ backgroundColor: awayTeam?.colors.primary ?? '#444' }}
            />
            <p className="font-bold text-lg">{awayTeam?.shortName ?? '?'}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">İstatistikler</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm w-12 text-right">{homePossession}%</span>
          <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${homePossession}%` }} />
          </div>
          <span className="text-sm w-12">{100 - homePossession}%</span>
        </div>
        <p className="text-center text-gray-400 text-xs mt-1">Topa Sahip Olma</p>
      </div>

      {events.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Maç Olayları</h2>
          <div className="space-y-2">
            {events.map((event, i) => {
              const player = players[event.playerId];
              const isHome = event.teamId === lastMatchResult.homeTeamId;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 text-sm ${isHome ? '' : 'flex-row-reverse text-right'}`}
                >
                  <span className="text-gray-400 w-10 shrink-0 text-center">{event.minute}'</span>
                  <span className="text-lg">{EVENT_ICONS[event.type] ?? ''}</span>
                  <span className="font-medium">{player?.name ?? '?'}</span>
                  {event.detail && <span className="text-gray-500 text-xs">({event.detail})</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button
        onClick={() => navigate('squad')}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors"
      >
        Devam Et
      </button>
    </div>
  );
}
