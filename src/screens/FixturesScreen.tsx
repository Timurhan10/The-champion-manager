import { useState } from 'react';
import { useGameStore } from '../store/game-store';

export default function FixturesScreen() {
  const navigate = useGameStore((s) => s.navigate);
  const season = useGameStore((s) => s.season);
  const teams = useGameStore((s) => s.teams);
  const leagues = useGameStore((s) => s.leagues);
  const playerTeamId = useGameStore((s) => s.playerTeamId);
  const simulateWeek = useGameStore((s) => s.simulateWeek);

  const currentWeek = season?.currentWeek ?? 1;
  const totalWeeks = season?.totalWeeks ?? 34;
  const [viewWeek, setViewWeek] = useState(currentWeek);

  const weekFixtures = (season?.fixtures ?? []).filter((f) => f.week === viewWeek);
  const isCurrentWeek = viewWeek === currentWeek;
  const hasUnplayed = weekFixtures.some((f) => !f.played);

  const leagueList = Object.values(leagues);

  const fixturesByLeague = leagueList.map((league) => {
    const leagueTeamIds = new Set(league.teamIds);
    const matches = weekFixtures.filter((f) => leagueTeamIds.has(f.homeTeamId) || leagueTeamIds.has(f.awayTeamId));
    return { league, matches };
  }).filter((g) => g.matches.length > 0);

  const handleSimulate = () => {
    simulateWeek();
    navigate('matchSim');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <button onClick={() => navigate('squad')} className="text-emerald-400 hover:text-emerald-300 mb-4">
        &larr; Geri
      </button>
      <h1 className="text-2xl font-bold mb-4">Fikstür</h1>

      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setViewWeek((w) => Math.max(1, w - 1))}
            disabled={viewWeek <= 1}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-40 hover:bg-gray-600 transition-colors"
          >
            &larr;
          </button>
          <span className="font-bold text-lg">
            Hafta {viewWeek} / {totalWeeks}
          </span>
          <button
            onClick={() => setViewWeek((w) => Math.min(totalWeeks, w + 1))}
            disabled={viewWeek >= totalWeeks}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-40 hover:bg-gray-600 transition-colors"
          >
            &rarr;
          </button>
        </div>
        {isCurrentWeek && (
          <p className="text-center text-emerald-400 text-sm">Mevcut Hafta</p>
        )}
      </div>

      {fixturesByLeague.map(({ league, matches }) => (
        <div key={league.id} className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-emerald-400">{league.name}</h2>
          <div className="space-y-2">
            {matches.map((match) => {
              const isUserMatch = match.homeTeamId === playerTeamId || match.awayTeamId === playerTeamId;
              const homeTeam = teams[match.homeTeamId];
              const awayTeam = teams[match.awayTeamId];
              return (
                <div
                  key={match.id}
                  className={`bg-gray-800 rounded-lg p-3 flex items-center justify-between ${
                    isUserMatch ? 'border border-emerald-500' : ''
                  }`}
                >
                  <span className={`flex-1 text-right font-medium ${match.homeTeamId === playerTeamId ? 'text-emerald-400' : ''}`}>
                    {homeTeam?.shortName ?? homeTeam?.name ?? '?'}
                  </span>
                  <div className="w-24 text-center">
                    {match.played ? (
                      <span className="font-bold text-lg">{match.homeGoals} - {match.awayGoals}</span>
                    ) : (
                      <span className="text-gray-500">vs</span>
                    )}
                  </div>
                  <span className={`flex-1 text-left font-medium ${match.awayTeamId === playerTeamId ? 'text-emerald-400' : ''}`}>
                    {awayTeam?.shortName ?? awayTeam?.name ?? '?'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {weekFixtures.length === 0 && (
        <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-500">
          Bu hafta için fikstür bulunamadı
        </div>
      )}

      {isCurrentWeek && hasUnplayed && (
        <button
          onClick={handleSimulate}
          className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors"
        >
          Maça Çık
        </button>
      )}
    </div>
  );
}
