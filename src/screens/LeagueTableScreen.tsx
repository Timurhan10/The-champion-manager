import { useState } from 'react';
import { useGameStore } from '../store/game-store';
import { PROMOTION_RELEGATION_COUNT } from '../utils/constants';

export default function LeagueTableScreen() {
  const navigate = useGameStore((s) => s.navigate);
  const leagues = useGameStore((s) => s.leagues);
  const teams = useGameStore((s) => s.teams);
  const playerTeamId = useGameStore((s) => s.playerTeamId);
  const season = useGameStore((s) => s.season);

  const leagueList = Object.values(leagues);
  const [selectedLeagueId, setSelectedLeagueId] = useState(leagueList[0]?.id ?? '');

  const league = leagues[selectedLeagueId];
  const standings = league?.standings ?? [];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <button onClick={() => navigate('squad')} className="text-emerald-400 hover:text-emerald-300 mb-4">
        &larr; Geri
      </button>
      <h1 className="text-2xl font-bold mb-4">Puan Tablosu</h1>

      {season && (
        <p className="text-gray-400 text-sm mb-4">Hafta {season.currentWeek} / {season.totalWeeks}</p>
      )}

      <div className="flex gap-2 mb-4">
        {leagueList.map((l) => (
          <button
            key={l.id}
            onClick={() => setSelectedLeagueId(l.id)}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              selectedLeagueId === l.id
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {l.name}
          </button>
        ))}
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400">
                <th className="p-3 text-left w-8">#</th>
                <th className="p-3 text-left">Takım</th>
                <th className="p-3 text-center">O</th>
                <th className="p-3 text-center">G</th>
                <th className="p-3 text-center">B</th>
                <th className="p-3 text-center">M</th>
                <th className="p-3 text-center">AG</th>
                <th className="p-3 text-center">YG</th>
                <th className="p-3 text-center">AV</th>
                <th className="p-3 text-center font-bold">P</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((s, i) => {
                const team = teams[s.teamId];
                const isUser = s.teamId === playerTeamId;
                const rank = i + 1;
                const isTopZone = league?.tier === 2 && rank <= PROMOTION_RELEGATION_COUNT;
                const isBottomZone = league?.tier === 1 && rank > standings.length - PROMOTION_RELEGATION_COUNT;

                return (
                  <tr
                    key={s.teamId}
                    className={`border-b border-gray-700/50 ${isUser ? 'bg-emerald-900/30' : 'hover:bg-gray-700/30'} ${
                      isTopZone ? 'border-l-4 border-l-green-500' : isBottomZone ? 'border-l-4 border-l-red-500' : ''
                    }`}
                  >
                    <td className="p-3 text-gray-400">{rank}</td>
                    <td className={`p-3 font-medium ${isUser ? 'text-emerald-400' : ''}`}>
                      {team?.name ?? '?'}
                    </td>
                    <td className="p-3 text-center">{s.played}</td>
                    <td className="p-3 text-center">{s.won}</td>
                    <td className="p-3 text-center">{s.drawn}</td>
                    <td className="p-3 text-center">{s.lost}</td>
                    <td className="p-3 text-center">{s.goalsFor}</td>
                    <td className="p-3 text-center">{s.goalsAgainst}</td>
                    <td className="p-3 text-center">{s.goalDifference}</td>
                    <td className="p-3 text-center font-bold text-emerald-400">{s.points}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
