import { useState } from 'react';
import { useGameStore } from '../store/game-store';
import { PROMOTION_RELEGATION_COUNT } from '../utils/constants';
import TeamEmblem from '../components/TeamEmblem';

export default function LeagueTableScreen() {
  const navigate = useGameStore((s) => s.navigate);
  const leagues = useGameStore((s) => s.leagues);
  const teams = useGameStore((s) => s.teams);
  const playerTeamId = useGameStore((s) => s.playerTeamId);
  const season = useGameStore((s) => s.season);

  const leagueList = Object.values(leagues);
  const [selectedLeagueId, setSelectedLeagueId] = useState(leagueList[0]?.id ?? '');

  const currentWeek = season?.currentWeek ?? 1;
  const totalWeeks = season?.totalWeeks ?? 34;
  const [viewWeek, setViewWeek] = useState(currentWeek);

  const league = leagues[selectedLeagueId];
  const standings = league?.standings ?? [];

  const weekFixtures = (season?.fixtures ?? []).filter((f) => {
    const leagueTeamIds = league ? new Set(league.teamIds) : new Set<string>();
    return f.week === viewWeek && (leagueTeamIds.has(f.homeTeamId) || leagueTeamIds.has(f.awayTeamId));
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <button onClick={() => navigate('squad')} className="text-emerald-400 hover:text-emerald-300 mb-3 text-sm">
        &larr; Geri
      </button>
      <h1 className="text-xl font-bold mb-3">Puan Durumu</h1>

      <div className="flex gap-2 mb-3">
        {leagueList.map((l) => (
          <button
            key={l.id}
            onClick={() => setSelectedLeagueId(l.id)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              selectedLeagueId === l.id ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {l.name}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        {/* Standings table */}
        <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th className="p-2 text-left w-6">#</th>
                  <th className="p-2 text-left">Takım</th>
                  <th className="p-2 text-center">O</th>
                  <th className="p-2 text-center">G</th>
                  <th className="p-2 text-center">B</th>
                  <th className="p-2 text-center">M</th>
                  <th className="p-2 text-center">AG</th>
                  <th className="p-2 text-center">YG</th>
                  <th className="p-2 text-center">AV</th>
                  <th className="p-2 text-center font-bold">P</th>
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
                      <td className="p-2 text-gray-400">{rank}</td>
                      <td className={`p-2 font-medium ${isUser ? 'text-emerald-400' : ''}`}>
                        <div className="flex items-center gap-1.5">
                          {team && <TeamEmblem shortName={team.shortName} primary={team.colors.primary} secondary={team.colors.secondary} size={18} />}
                          <span className="truncate">{team?.shortName ?? '?'}</span>
                        </div>
                      </td>
                      <td className="p-2 text-center">{s.played}</td>
                      <td className="p-2 text-center">{s.won}</td>
                      <td className="p-2 text-center">{s.drawn}</td>
                      <td className="p-2 text-center">{s.lost}</td>
                      <td className="p-2 text-center">{s.goalsFor}</td>
                      <td className="p-2 text-center">{s.goalsAgainst}</td>
                      <td className="p-2 text-center">{s.goalDifference}</td>
                      <td className="p-2 text-center font-bold text-emerald-400">{s.points}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compact fixtures panel */}
        <div className="w-56 flex-shrink-0">
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setViewWeek((w) => Math.max(1, w - 1))}
                disabled={viewWeek <= 1}
                className="px-2 py-0.5 bg-gray-700 rounded text-xs disabled:opacity-40 hover:bg-gray-600"
              >
                &larr;
              </button>
              <span className="text-xs font-bold">Hafta {viewWeek}</span>
              <button
                onClick={() => setViewWeek((w) => Math.min(totalWeeks, w + 1))}
                disabled={viewWeek >= totalWeeks}
                className="px-2 py-0.5 bg-gray-700 rounded text-xs disabled:opacity-40 hover:bg-gray-600"
              >
                &rarr;
              </button>
            </div>
            <div className="space-y-1">
              {weekFixtures.map((match) => {
                const homeTeam = teams[match.homeTeamId];
                const awayTeam = teams[match.awayTeamId];
                const isUserMatch = match.homeTeamId === playerTeamId || match.awayTeamId === playerTeamId;
                return (
                  <div
                    key={match.id}
                    className={`flex items-center text-[10px] p-1 rounded ${isUserMatch ? 'bg-emerald-900/40' : 'bg-gray-700/50'}`}
                  >
                    <div className="flex items-center gap-1 flex-1 justify-end">
                      <span className="truncate">{homeTeam?.shortName ?? '?'}</span>
                      {homeTeam && <TeamEmblem shortName={homeTeam.shortName} primary={homeTeam.colors.primary} secondary={homeTeam.colors.secondary} size={14} />}
                    </div>
                    <div className="w-10 text-center font-bold text-[11px]">
                      {match.played ? `${match.homeGoals}-${match.awayGoals}` : 'vs'}
                    </div>
                    <div className="flex items-center gap-1 flex-1">
                      {awayTeam && <TeamEmblem shortName={awayTeam.shortName} primary={awayTeam.colors.primary} secondary={awayTeam.colors.secondary} size={14} />}
                      <span className="truncate">{awayTeam?.shortName ?? '?'}</span>
                    </div>
                  </div>
                );
              })}
              {weekFixtures.length === 0 && (
                <p className="text-gray-500 text-[10px] text-center py-2">Fikstür yok</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
