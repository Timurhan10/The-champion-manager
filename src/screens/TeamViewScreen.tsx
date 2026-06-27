import { useState } from 'react';
import { useGameStore } from '../store/game-store';
import { formatMoney } from '../utils/format';
import { TACTIC_DEFINITIONS } from '../engine/tactics';
import TeamEmblem from '../components/TeamEmblem';
import ScreenBackground from '../components/ScreenBackground';

export default function TeamViewScreen() {
  const navigate = useGameStore((s) => s.navigate);
  const teams = useGameStore((s) => s.teams);
  const players = useGameStore((s) => s.players);
  const selectedTeamId = useGameStore((s) => s.selectedTeamId);
  const playerTeamId = useGameStore((s) => s.playerTeamId);
  const season = useGameStore((s) => s.season);
  const sendTransferOffer = useGameStore((s) => s.sendTransferOffer);

  const [offerPlayerId, setOfferPlayerId] = useState<string | null>(null);
  const [offerSent, setOfferSent] = useState<Set<string>>(new Set());

  if (!selectedTeamId) return null;
  const team = teams[selectedTeamId];
  if (!team) return null;

  const tacticDef = TACTIC_DEFINITIONS[team.tactics.tactic];
  const squadPlayers = team.playerIds.map(id => players[id]).filter(Boolean)
    .sort((a, b) => b.overallRating - a.overallRating);

  const isOwnTeam = selectedTeamId === playerTeamId;
  const canOffer = season?.transferWindowOpen && !isOwnTeam;

  const handleOffer = (playerId: string, percentage: number) => {
    const player = players[playerId];
    if (!player) return;
    const fee = Math.round(player.marketValue * percentage);
    sendTransferOffer(playerId, fee);
    setOfferSent(prev => new Set(prev).add(playerId));
    setOfferPlayerId(null);
  };

  return (
    <ScreenBackground image="1.jpeg" className="text-white p-4 min-h-screen">
      <button onClick={() => navigate('leagueTable')} className="text-emerald-400 hover:text-emerald-300 mb-3 text-sm">
        &larr; Geri
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <TeamEmblem shortName={team.shortName} primary={team.colors.primary} secondary={team.colors.secondary} size={40} />
          <div>
            <h1 className="text-xl font-bold">{team.name}</h1>
            <p className="text-gray-400 text-sm">{team.city} | {tacticDef.name} | {team.tactics.formation}</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-3 mb-4 flex gap-6 text-sm">
          <div><span className="text-gray-400">Taktik:</span> <span className="text-emerald-400 font-medium">{tacticDef.name}</span></div>
          <div><span className="text-gray-400">Formasyon:</span> <span className="text-white font-medium">{team.tactics.formation}</span></div>
          <div><span className="text-gray-400">Oyuncu:</span> <span className="text-white">{team.playerIds.length}</span></div>
        </div>

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="p-2 text-left">İsim</th>
                <th className="p-2">Mevki</th>
                <th className="p-2">OVR</th>
                <th className="p-2">Yaş</th>
                <th className="p-2">G</th>
                <th className="p-2">A</th>
                <th className="p-2 text-right">Değer</th>
                {canOffer && <th className="p-2"></th>}
              </tr>
            </thead>
            <tbody>
              {squadPlayers.map(p => (
                <tr key={p.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                  <td className="p-2 text-white font-medium">{p.name}</td>
                  <td className="p-2 text-center text-gray-300">{p.position}</td>
                  <td className="p-2 text-center font-bold">{p.overallRating}</td>
                  <td className="p-2 text-center text-gray-300">{p.age}</td>
                  <td className="p-2 text-center text-gray-300">{p.seasonStats.goals}</td>
                  <td className="p-2 text-center text-gray-300">{p.seasonStats.assists}</td>
                  <td className="p-2 text-right text-emerald-400">{formatMoney(p.marketValue)}</td>
                  {canOffer && (
                    <td className="p-2">
                      {offerSent.has(p.id) ? (
                        <span className="text-yellow-400 text-[10px]">Teklif gönderildi</span>
                      ) : offerPlayerId === p.id ? (
                        <div className="flex gap-1">
                          {[0.8, 1.0, 1.2, 1.5].map(pct => (
                            <button
                              key={pct}
                              onClick={() => handleOffer(p.id, pct)}
                              className="px-1.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 rounded text-[9px] font-medium"
                            >
                              %{pct * 100}
                            </button>
                          ))}
                          <button onClick={() => setOfferPlayerId(null)} className="px-1.5 py-0.5 bg-gray-600 rounded text-[9px]">X</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setOfferPlayerId(p.id)}
                          className="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 rounded text-[10px] font-medium"
                        >
                          Teklif
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ScreenBackground>
  );
}
