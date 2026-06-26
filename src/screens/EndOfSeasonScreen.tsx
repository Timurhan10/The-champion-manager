import { useGameStore } from '../store/game-store';
import { PROMOTION_RELEGATION_COUNT } from '../utils/constants';

export default function EndOfSeasonScreen() {
  const leagues = useGameStore((s) => s.leagues);
  const teams = useGameStore((s) => s.teams);
  const season = useGameStore((s) => s.season);
  const playerTeamId = useGameStore((s) => s.playerTeamId);
  const advanceSeason = useGameStore((s) => s.advanceSeason);

  const leagueList = Object.values(leagues);
  const superLig = leagueList.find((l) => l.tier === 1);
  const lig1 = leagueList.find((l) => l.tier === 2);

  const superStandings = superLig?.standings ?? [];
  const lig1Standings = lig1?.standings ?? [];

  const champion = superStandings[0];
  const championTeam = champion ? teams[champion.teamId] : null;

  const promotedIds = lig1Standings.slice(0, PROMOTION_RELEGATION_COUNT).map((s) => s.teamId);
  const relegatedIds = superStandings.slice(-PROMOTION_RELEGATION_COUNT).map((s) => s.teamId);

  const playerTeam = playerTeamId ? teams[playerTeamId] : null;
  const playerLeague = leagueList.find((l) => l.teamIds.includes(playerTeamId ?? ''));
  const playerStanding = playerLeague?.standings.find((s) => s.teamId === playerTeamId);
  const playerRank = playerLeague?.standings.findIndex((s) => s.teamId === playerTeamId);

  const handleAdvance = () => {
    advanceSeason();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-2">Sezon Sonu {season?.year}</h1>

      {championTeam && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6 text-center">
          <p className="text-4xl mb-2">🏆</p>
          <h2 className="text-2xl font-bold text-emerald-400 mb-1">{championTeam.name}</h2>
          <p className="text-gray-400">Süper Lig Şampiyonu</p>
        </div>
      )}

      {promotedIds.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <h3 className="font-semibold mb-3 text-green-400">Yükselen Takımlar</h3>
          <div className="space-y-2">
            {promotedIds.map((id) => (
              <div key={id} className="flex items-center gap-2">
                <span className="text-green-400">⬆️</span>
                <span className="bg-green-900/40 text-green-300 px-3 py-1 rounded font-medium">
                  {teams[id]?.name ?? '?'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {relegatedIds.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <h3 className="font-semibold mb-3 text-red-400">Düşen Takımlar</h3>
          <div className="space-y-2">
            {relegatedIds.map((id) => (
              <div key={id} className="flex items-center gap-2">
                <span className="text-red-400">⬇️</span>
                <span className="bg-red-900/40 text-red-300 px-3 py-1 rounded font-medium">
                  {teams[id]?.name ?? '?'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {playerStanding && playerTeam && (
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-3 text-emerald-400">Takımınız: {playerTeam.name}</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-700/50 rounded p-3">
              <p className="text-gray-400">Sıralama</p>
              <p className="text-xl font-bold">{(playerRank ?? 0) + 1}.</p>
            </div>
            <div className="bg-gray-700/50 rounded p-3">
              <p className="text-gray-400">Puan</p>
              <p className="text-xl font-bold text-emerald-400">{playerStanding.points}</p>
            </div>
            <div className="bg-gray-700/50 rounded p-3">
              <p className="text-gray-400">Galibiyet</p>
              <p className="text-xl font-bold text-green-400">{playerStanding.won}</p>
            </div>
            <div className="bg-gray-700/50 rounded p-3">
              <p className="text-gray-400">Beraberlik</p>
              <p className="text-xl font-bold text-yellow-400">{playerStanding.drawn}</p>
            </div>
            <div className="bg-gray-700/50 rounded p-3">
              <p className="text-gray-400">Mağlubiyet</p>
              <p className="text-xl font-bold text-red-400">{playerStanding.lost}</p>
            </div>
            <div className="bg-gray-700/50 rounded p-3">
              <p className="text-gray-400">Atılan Goller</p>
              <p className="text-xl font-bold">{playerStanding.goalsFor}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
        <h3 className="font-semibold p-4 border-b border-gray-700">Final Puan Tablosu - {superLig?.name}</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400">
              <th className="p-2 text-left w-8">#</th>
              <th className="p-2 text-left">Takım</th>
              <th className="p-2 text-center">O</th>
              <th className="p-2 text-center">G</th>
              <th className="p-2 text-center">B</th>
              <th className="p-2 text-center">M</th>
              <th className="p-2 text-center">P</th>
            </tr>
          </thead>
          <tbody>
            {superStandings.map((s, i) => {
              const isUser = s.teamId === playerTeamId;
              return (
                <tr key={s.teamId} className={`border-b border-gray-700/50 ${isUser ? 'bg-emerald-900/30' : ''}`}>
                  <td className="p-2 text-gray-400">{i + 1}</td>
                  <td className={`p-2 font-medium ${isUser ? 'text-emerald-400' : ''}`}>{teams[s.teamId]?.name ?? '?'}</td>
                  <td className="p-2 text-center">{s.played}</td>
                  <td className="p-2 text-center">{s.won}</td>
                  <td className="p-2 text-center">{s.drawn}</td>
                  <td className="p-2 text-center">{s.lost}</td>
                  <td className="p-2 text-center font-bold">{s.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleAdvance}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors"
      >
        Yeni Sezon Başlat
      </button>
    </div>
  );
}
