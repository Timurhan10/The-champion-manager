import { useGameStore } from '../store/game-store';
import { formatMoney } from '../utils/format';
import type { PlayerAttributes } from '../types';

const ATTR_LABELS: Record<keyof PlayerAttributes, string> = {
  speed: 'Hız',
  shooting: 'Şut',
  passing: 'Pas',
  dribbling: 'Dribling',
  defense: 'Defans',
  physics: 'Fizik',
  stamina: 'Dayanıklılık',
  intelligence: 'Zeka',
};

function attrColor(v: number) {
  if (v >= 65) return 'bg-emerald-500';
  if (v >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
}

function AttributeBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 text-gray-400 text-sm">{label}</span>
      <div className="flex-1 h-2.5 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${attrColor(value)}`} style={{ width: `${value}%` }} />
      </div>
      <span className="w-8 text-right text-sm text-white font-bold">{value}</span>
    </div>
  );
}

export default function PlayerProfileScreen() {
  const navigate = useGameStore((s) => s.navigate);
  const players = useGameStore((s) => s.players);
  const selectedPlayerId = useGameStore((s) => s.selectedPlayerId);
  const playerTeamId = useGameStore((s) => s.playerTeamId);
  const attemptBuyPlayer = useGameStore((s) => s.attemptBuyPlayer);
  const attemptSellPlayer = useGameStore((s) => s.attemptSellPlayer);

  if (!selectedPlayerId || !players[selectedPlayerId]) return null;
  const player = players[selectedPlayerId];

  const isOnMyTeam = player.teamId === playerTeamId;
  const isFreeAgent = player.teamId === null;

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('squad')}
          className="text-gray-400 hover:text-white mb-6 text-sm"
        >
          ← Kadroya Dön
        </button>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{player.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-2 py-0.5 bg-emerald-600/30 text-emerald-400 text-xs font-semibold rounded">
                  {player.position}
                </span>
                <span className="text-gray-400 text-sm">{player.age} yaş</span>
                <span className="text-gray-400 text-sm">{player.nationality}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400">{player.overallRating}</div>
              <div className="text-xs text-gray-500">OVR</div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-1">Kondisyon</p>
            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  player.currentStamina > 70
                    ? 'bg-emerald-500'
                    : player.currentStamina > 30
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${player.currentStamina}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1 text-right">{player.currentStamina}%</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6 space-y-3">
          <h2 className="text-white font-semibold mb-3">Nitelikler</h2>
          {(Object.keys(ATTR_LABELS) as (keyof PlayerAttributes)[]).map((key) => (
            <AttributeBar key={key} label={ATTR_LABELS[key]} value={player.attributes[key]} />
          ))}
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Piyasa Değeri</p>
              <p className="text-white font-bold">{formatMoney(player.marketValue)}</p>
            </div>
            <div>
              <p className="text-gray-500">Haftalık Maaş</p>
              <p className="text-white font-bold">{formatMoney(player.wage)}</p>
            </div>
          </div>
        </div>

        {isOnMyTeam && (
          <button
            onClick={() => attemptSellPlayer(player.id)}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
          >
            Sat
          </button>
        )}
        {!isOnMyTeam && (
          <button
            onClick={() => attemptBuyPlayer(player.id)}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
          >
            Satın Al {isFreeAgent ? '(Serbest)' : `(${formatMoney(player.marketValue)})`}
          </button>
        )}
      </div>
    </div>
  );
}
