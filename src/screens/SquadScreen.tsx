import { useGameStore } from '../store/game-store';
import { formatMoney } from '../utils/format';
import { POSITION_GROUPS } from '../utils/constants';
import type { Player } from '../types';

const POS_ORDER: Record<string, number> = { goalkeeper: 0, defense: 1, midfield: 2, attack: 3 };

function StaminaBar({ value }: { value: number }) {
  const color = value > 70 ? 'bg-emerald-500' : value > 30 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}

export default function SquadScreen() {
  const players = useGameStore((s) => s.players);
  const teams = useGameStore((s) => s.teams);
  const playerTeamId = useGameStore((s) => s.playerTeamId);
  const navigate = useGameStore((s) => s.navigate);
  const selectPlayer = useGameStore((s) => s.selectPlayer);

  if (!playerTeamId) return null;
  const team = teams[playerTeamId];
  if (!team) return null;

  const squadPlayers = team.playerIds
    .map((id) => players[id])
    .filter(Boolean)
    .sort((a, b) => {
      const ga = POS_ORDER[POSITION_GROUPS[a.position]] ?? 9;
      const gb = POS_ORDER[POSITION_GROUPS[b.position]] ?? 9;
      return ga - gb || b.overallRating - a.overallRating;
    });

  const startingSet = new Set(team.startingElevenIds);

  const handlePlayerClick = (p: Player) => {
    selectPlayer(p.id);
    navigate('playerProfile');
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-1">{team.name}</h1>
        <p className="text-gray-400 text-sm mb-4">Kadro - {squadPlayers.length} Oyuncu</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {([
            ['İlk 11', 'startingEleven'],
            ['Taktik', 'tactics'],
            ['Fikstür', 'fixtures'],
            ['Tablo', 'leagueTable'],
            ['Transfer', 'transfers'],
          ] as const).map(([label, screen]) => (
            <button
              key={screen}
              onClick={() => navigate(screen)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-left border-b border-gray-700">
                <th className="p-3 w-8"></th>
                <th className="p-3">İsim</th>
                <th className="p-3">Mevki</th>
                <th className="p-3 text-center">OVR</th>
                <th className="p-3 text-center">Yaş</th>
                <th className="p-3">Kondisyon</th>
                <th className="p-3 text-right">Maaş</th>
              </tr>
            </thead>
            <tbody>
              {squadPlayers.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => handlePlayerClick(p)}
                  className={`border-b border-gray-700/50 hover:bg-gray-700/50 cursor-pointer transition-colors ${
                    startingSet.has(p.id) ? 'bg-emerald-900/30' : ''
                  }`}
                >
                  <td className="p-3">
                    {startingSet.has(p.id) && (
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                  </td>
                  <td className="p-3 text-white font-medium">{p.name}</td>
                  <td className="p-3 text-gray-300">{p.position}</td>
                  <td className="p-3 text-center text-white font-bold">{p.overallRating}</td>
                  <td className="p-3 text-center text-gray-300">{p.age}</td>
                  <td className="p-3">
                    <StaminaBar value={p.currentStamina} />
                  </td>
                  <td className="p-3 text-right text-gray-300">{formatMoney(p.wage)}/h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
