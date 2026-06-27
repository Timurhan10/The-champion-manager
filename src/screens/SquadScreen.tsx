import { useState } from 'react';
import { useGameStore } from '../store/game-store';
import { formatMoney } from '../utils/format';
import { POSITION_GROUPS, FORMATIONS } from '../utils/constants';
import { TACTIC_DEFINITIONS, calculateTacticFit } from '../engine/tactics';
import type { Player, Position, Formation, Tactic, Notification } from '../types';
import type { TrainingType } from '../engine/training';
import ScreenBackground from '../components/ScreenBackground';

const POS_ORDER: Record<string, number> = { goalkeeper: 0, defense: 1, midfield: 2, attack: 3 };

type Tab = 'kadro' | 'ilk11' | 'taktik' | 'antrenman';

const PITCH_ROWS: Record<string, number[][]> = {
  '4-4-2': [[0], [1, 2, 3, 4], [5, 6, 7, 8], [9, 10]],
  '4-3-3': [[0], [1, 2, 3, 4], [5, 6, 7], [8, 9, 10]],
  '4-2-3-1': [[0], [1, 2, 3, 4], [5, 6], [7, 8, 9], [10]],
  '3-5-2': [[0], [1, 2, 3], [4, 5, 6, 7, 8], [9, 10]],
  '5-3-2': [[0], [1, 2, 3, 4, 5], [6, 7, 8], [9, 10]],
};

const FORMATION_POSITIONS: Record<Formation, { x: number; y: number; label: string }[]> = {
  '4-4-2': [
    { x: 50, y: 90, label: 'GK' },
    { x: 20, y: 70, label: 'LB' }, { x: 40, y: 72, label: 'CB' }, { x: 60, y: 72, label: 'CB' }, { x: 80, y: 70, label: 'RB' },
    { x: 20, y: 45, label: 'LM' }, { x: 40, y: 47, label: 'CM' }, { x: 60, y: 47, label: 'CM' }, { x: 80, y: 45, label: 'RM' },
    { x: 38, y: 20, label: 'ST' }, { x: 62, y: 20, label: 'ST' },
  ],
  '4-3-3': [
    { x: 50, y: 90, label: 'GK' },
    { x: 20, y: 70, label: 'LB' }, { x: 40, y: 72, label: 'CB' }, { x: 60, y: 72, label: 'CB' }, { x: 80, y: 70, label: 'RB' },
    { x: 30, y: 48, label: 'CM' }, { x: 50, y: 45, label: 'CM' }, { x: 70, y: 48, label: 'CM' },
    { x: 20, y: 22, label: 'LW' }, { x: 50, y: 18, label: 'ST' }, { x: 80, y: 22, label: 'RW' },
  ],
  '4-2-3-1': [
    { x: 50, y: 90, label: 'GK' },
    { x: 20, y: 70, label: 'LB' }, { x: 40, y: 72, label: 'CB' }, { x: 60, y: 72, label: 'CB' }, { x: 80, y: 70, label: 'RB' },
    { x: 35, y: 55, label: 'CDM' }, { x: 65, y: 55, label: 'CDM' },
    { x: 20, y: 35, label: 'LW' }, { x: 50, y: 33, label: 'CAM' }, { x: 80, y: 35, label: 'RW' },
    { x: 50, y: 15, label: 'ST' },
  ],
  '3-5-2': [
    { x: 50, y: 90, label: 'GK' },
    { x: 30, y: 72, label: 'CB' }, { x: 50, y: 74, label: 'CB' }, { x: 70, y: 72, label: 'CB' },
    { x: 15, y: 48, label: 'LM' }, { x: 35, y: 50, label: 'CM' }, { x: 50, y: 52, label: 'CDM' }, { x: 65, y: 50, label: 'CM' }, { x: 85, y: 48, label: 'RM' },
    { x: 38, y: 20, label: 'ST' }, { x: 62, y: 20, label: 'ST' },
  ],
  '5-3-2': [
    { x: 50, y: 90, label: 'GK' },
    { x: 15, y: 70, label: 'LB' }, { x: 33, y: 73, label: 'CB' }, { x: 50, y: 74, label: 'CB' }, { x: 67, y: 73, label: 'CB' }, { x: 85, y: 70, label: 'RB' },
    { x: 30, y: 48, label: 'CM' }, { x: 50, y: 46, label: 'CM' }, { x: 70, y: 48, label: 'CM' },
    { x: 38, y: 20, label: 'ST' }, { x: 62, y: 20, label: 'ST' },
  ],
};

const FORMATION_OPTIONS: Formation[] = ['4-4-2', '4-3-3', '4-2-3-1', '3-5-2', '5-3-2'];

function StaminaBar({ value }: { value: number }) {
  const color = value > 70 ? 'bg-emerald-500' : value > 30 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}

function FitBar({ value }: { value: number }) {
  const pct = Math.round(((value - 0.85) / 0.30) * 100);
  const color = pct > 70 ? 'text-emerald-400' : pct > 40 ? 'text-yellow-400' : 'text-red-400';
  return <span className={`text-xs font-bold ${color}`}>%{pct} Uyum</span>;
}

function NotificationPanel({ notifications, onRead }: { notifications: Notification[]; onRead: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const typeIcon: Record<string, string> = { transfer: '🔄', injury: '🤕', info: 'ℹ️' };

  return (
    <div className="bg-gray-800 rounded-lg p-3">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 w-full text-left">
        <span className="text-sm font-semibold text-white">Bildirimler</span>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
        )}
      </button>
      {open && (
        <div className="mt-2 max-h-60 overflow-y-auto space-y-1">
          {notifications.length === 0 && <p className="text-gray-500 text-xs text-center py-2">Bildirim yok</p>}
          {notifications.slice().reverse().slice(0, 30).map(n => (
            <button
              key={n.id}
              onClick={() => onRead(n.id)}
              className={`w-full text-left p-2 rounded text-xs transition-colors ${n.read ? 'bg-gray-700/30 text-gray-500' : 'bg-gray-700 text-white'}`}
            >
              <div className="flex items-center gap-1.5">
                <span>{typeIcon[n.type] ?? ''}</span>
                <span className="font-medium">{n.title}</span>
                <span className="text-gray-500 ml-auto text-[10px]">H{n.week}</span>
              </div>
              <p className="text-[10px] mt-0.5 text-gray-400">{n.message}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function KadroTab({ onPlayerClick }: { onPlayerClick: (p: Player) => void }) {
  const players = useGameStore((s) => s.players);
  const teams = useGameStore((s) => s.teams);
  const playerTeamId = useGameStore((s) => s.playerTeamId);

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

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-gray-400 text-left border-b border-gray-700">
            <th className="p-2 w-6"></th>
            <th className="p-2">İsim</th>
            <th className="p-2">Mevki</th>
            <th className="p-2 text-center">OVR</th>
            <th className="p-2 text-center">Yaş</th>
            <th className="p-2 text-center">G</th>
            <th className="p-2 text-center">A</th>
            <th className="p-2 text-center">M</th>
            <th className="p-2">Kond.</th>
            <th className="p-2 text-right">Maaş</th>
          </tr>
        </thead>
        <tbody>
          {squadPlayers.map((p) => (
            <tr
              key={p.id}
              onClick={() => onPlayerClick(p)}
              className={`border-b border-gray-700/50 hover:bg-gray-700/50 cursor-pointer transition-colors ${
                startingSet.has(p.id) ? 'bg-emerald-900/30' : ''
              }`}
            >
              <td className="p-2">
                {startingSet.has(p.id) && <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />}
              </td>
              <td className="p-2 text-white font-medium">{p.name}</td>
              <td className="p-2 text-gray-300">{p.position}</td>
              <td className="p-2 text-center text-white font-bold">{p.overallRating}</td>
              <td className="p-2 text-center text-gray-300">{p.age}</td>
              <td className="p-2 text-center text-gray-300">{p.seasonStats.goals || '-'}</td>
              <td className="p-2 text-center text-gray-300">{p.seasonStats.assists || '-'}</td>
              <td className="p-2 text-center text-gray-300">{p.seasonStats.matchesPlayed || '-'}</td>
              <td className="p-2"><StaminaBar value={p.currentStamina} /></td>
              <td className="p-2 text-right text-gray-300">{formatMoney(p.wage)}/h</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Ilk11Tab() {
  const players = useGameStore((s) => s.players);
  const teams = useGameStore((s) => s.teams);
  const playerTeamId = useGameStore((s) => s.playerTeamId);
  const setStartingEleven = useGameStore((s) => s.setStartingEleven);
  const setSubstitutes = useGameStore((s) => s.setSubstitutes);
  const autoSelectSquad = useGameStore((s) => s.autoSelectSquad);

  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  if (!playerTeamId) return null;
  const team = teams[playerTeamId];
  if (!team) return null;

  const formation = team.tactics.formation;
  const positions: Position[] = FORMATIONS[formation];
  const startingIds = team.startingElevenIds;
  const benchIds = team.substituteBenchIds;
  const nonStarting = team.playerIds.filter((id) => !startingIds.includes(id));
  const rows = PITCH_ROWS[formation] || PITCH_ROWS['4-4-2'];

  const handleSlotClick = (slotIndex: number) => {
    if (selectedSlot === null) {
      setSelectedSlot(slotIndex);
    } else {
      if (slotIndex !== selectedSlot) {
        const newStarting = [...startingIds];
        [newStarting[selectedSlot], newStarting[slotIndex]] = [newStarting[slotIndex], newStarting[selectedSlot]];
        setStartingEleven(newStarting);
      }
      setSelectedSlot(null);
    }
  };

  const handleBenchSwap = (benchPlayerId: string) => {
    if (selectedSlot === null) return;
    const newStarting = [...startingIds];
    const removedId = newStarting[selectedSlot];
    newStarting[selectedSlot] = benchPlayerId;
    setStartingEleven(newStarting);
    const newBench = benchIds.filter((id) => id !== benchPlayerId);
    if (removedId) newBench.push(removedId);
    setSubstitutes(newBench);
    setSelectedSlot(null);
  };

  const getPlayer = (id: string): Player | undefined => players[id];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-gray-400 text-xs">Diziliş: {formation}</p>
        <button
          onClick={() => { autoSelectSquad(playerTeamId); setSelectedSlot(null); }}
          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded transition-colors"
        >
          Otomatik Seç
        </button>
      </div>

      <div className="bg-emerald-900/40 border border-emerald-800/50 rounded-lg p-4 mb-4">
        <div className="flex flex-col-reverse gap-3">
          {rows.map((row, ri) => (
            <div key={ri} className="flex justify-center gap-2">
              {row.map((slotIdx) => {
                const pid = startingIds[slotIdx];
                const p = pid ? getPlayer(pid) : undefined;
                const isSelected = selectedSlot === slotIdx;
                return (
                  <button
                    key={slotIdx}
                    onClick={() => handleSlotClick(slotIdx)}
                    className={`w-16 py-1.5 rounded text-center transition-all ${
                      isSelected ? 'bg-emerald-500 ring-2 ring-white' : 'bg-gray-800/80 hover:bg-gray-700/80'
                    }`}
                  >
                    <div className="text-[9px] text-gray-400">{positions[slotIdx]}</div>
                    <div className="text-[10px] text-white font-medium truncate px-0.5">
                      {p ? p.name.split(' ').pop() : '---'}
                    </div>
                    {p && <div className="text-[9px] text-emerald-400 font-bold">{p.overallRating}</div>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-3">
        <h3 className="text-white text-xs font-semibold mb-2">
          {selectedSlot !== null ? 'Takas yapılacak oyuncuyu seçin' : 'Yedekler'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
          {nonStarting.map((id) => {
            const p = getPlayer(id);
            if (!p) return null;
            return (
              <button
                key={id}
                onClick={() => selectedSlot !== null && handleBenchSwap(id)}
                className={`flex items-center gap-1 p-1.5 rounded text-left text-xs transition-colors ${
                  selectedSlot !== null ? 'bg-gray-700 hover:bg-emerald-700/50 cursor-pointer' : 'bg-gray-700/50 cursor-default'
                }`}
              >
                <span className="text-gray-500 text-[10px] w-7">{p.position}</span>
                <span className="text-white truncate flex-1 text-[11px]">{p.name}</span>
                <span className="text-emerald-400 text-[10px] font-bold">{p.overallRating}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TaktikTab() {
  const players = useGameStore((s) => s.players);
  const teams = useGameStore((s) => s.teams);
  const playerTeamId = useGameStore((s) => s.playerTeamId);
  const setFormation = useGameStore((s) => s.setFormation);
  const setTactic = useGameStore((s) => s.setTactic);

  if (!playerTeamId) return null;
  const team = teams[playerTeamId];
  if (!team) return null;

  const [selFormation, setSelFormation] = useState<Formation>(team.tactics.formation);
  const [selTactic, setSelTactic] = useState<Tactic>(team.tactics.tactic);

  const squadPlayers = team.startingElevenIds.map(id => players[id]).filter(Boolean);
  const positions = FORMATION_POSITIONS[selFormation];

  const handleSave = () => {
    setFormation(selFormation);
    setTactic(selTactic);
  };

  const tacticList = Object.values(TACTIC_DEFINITIONS);

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-white text-xs font-semibold mb-2">Diziliş</h3>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {FORMATION_OPTIONS.map((f) => (
            <button
              key={f}
              onClick={() => setSelFormation(f)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                selFormation === f ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative w-full max-w-xs mx-auto aspect-[2/3] bg-green-900/40 rounded-lg border border-green-700/50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border border-green-700/40" />
          </div>
          <div className="absolute left-0 right-0 top-1/2 border-t border-green-700/40" />
          {positions.map((pos, i) => (
            <div
              key={i}
              className="absolute flex flex-col items-center"
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[8px] font-bold shadow-lg">
                {pos.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <h3 className="text-white text-xs font-semibold mb-2">Taktik</h3>
        <div className="grid grid-cols-3 gap-1.5">
          {tacticList.map((t) => {
            const isSelected = selTactic === t.id;
            const fit = calculateTacticFit(squadPlayers, t);
            return (
              <button
                key={t.id}
                onClick={() => setSelTactic(t.id)}
                className={`p-2 rounded text-left transition-colors ${
                  isSelected ? 'bg-emerald-600 ring-1 ring-emerald-400' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <div className="text-[11px] text-white font-semibold">{t.name}</div>
                <FitBar value={fit} />
              </button>
            );
          })}
        </div>
      </div>

      {selTactic && (
        <div className="bg-gray-800 rounded-lg p-3 mb-3">
          <p className="text-gray-300 text-[11px] mb-2">{TACTIC_DEFINITIONS[selTactic].description}</p>
          <div className="flex gap-4 text-[10px]">
            <div>
              <span className="text-gray-500">Atak: </span>
              <span className="text-white font-bold">{TACTIC_DEFINITIONS[selTactic].attackMult}x</span>
            </div>
            <div>
              <span className="text-gray-500">Savunma: </span>
              <span className="text-white font-bold">{TACTIC_DEFINITIONS[selTactic].defenseMult}x</span>
            </div>
          </div>
          <div className="mt-1.5 flex gap-4 text-[10px]">
            <div>
              <span className="text-green-400">Güçlü vs: </span>
              {TACTIC_DEFINITIONS[selTactic].counters.map(c => TACTIC_DEFINITIONS[c].name).join(', ')}
            </div>
          </div>
          <div className="mt-0.5 flex gap-4 text-[10px]">
            <div>
              <span className="text-red-400">Zayıf vs: </span>
              {TACTIC_DEFINITIONS[selTactic].weakTo.map(c => TACTIC_DEFINITIONS[c].name).join(', ')}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleSave}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg transition-colors text-sm"
      >
        Kaydet
      </button>
    </div>
  );
}

function AntrenmanTab() {
  const season = useGameStore((s) => s.season);
  const performTraining = useGameStore((s) => s.performTraining);
  const lastTrainingResults = useGameStore((s) => s.lastTrainingResults);
  const players = useGameStore((s) => s.players);

  const trained = season?.trainedThisWeek ?? false;

  const trainingOptions: { type: TrainingType; name: string; desc: string; attrs: string }[] = [
    { type: 'tactic', name: 'Taktik Antrenman', desc: 'Mevcut taktiğe uygun özellikler gelişir', attrs: 'Taktik ağırlıklarına göre' },
    { type: 'physical', name: 'Fizik Antrenman', desc: 'Fiziksel özellikler gelişir', attrs: 'Hız, Fizik, Dayanıklılık' },
    { type: 'technical', name: 'Teknik Antrenman', desc: 'Teknik özellikler gelişir', attrs: 'Şut, Pas, Dribling' },
    { type: 'defensive', name: 'Savunma Antrenman', desc: 'Savunma özellikleri gelişir', attrs: 'Savunma, Zeka' },
  ];

  return (
    <div>
      <h3 className="text-white text-sm font-semibold mb-3">Haftalık Antrenman</h3>
      {trained && (
        <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-lg p-3 mb-4">
          <p className="text-emerald-400 text-xs font-medium mb-2">Bu hafta antrenman yapıldı!</p>
          {lastTrainingResults.length > 0 && (
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {lastTrainingResults.map(r => {
                const p = players[r.playerId];
                if (!p) return null;
                return (
                  <div key={r.playerId} className="text-[10px] text-gray-300 flex gap-2">
                    <span className="text-white font-medium">{p.name}:</span>
                    {Object.entries(r.changes).map(([attr, val]) => (
                      <span key={attr} className="text-emerald-400">+{val} {attr}</span>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        {trainingOptions.map(opt => (
          <button
            key={opt.type}
            onClick={() => !trained && performTraining(opt.type)}
            disabled={trained}
            className={`p-3 rounded-lg text-left transition-colors ${
              trained ? 'bg-gray-800 opacity-50 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700 cursor-pointer'
            }`}
          >
            <div className="text-white text-xs font-semibold mb-1">{opt.name}</div>
            <p className="text-gray-400 text-[10px] mb-1">{opt.desc}</p>
            <p className="text-emerald-400 text-[10px]">{opt.attrs}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SquadScreen() {
  const teams = useGameStore((s) => s.teams);
  const playerTeamId = useGameStore((s) => s.playerTeamId);
  const navigate = useGameStore((s) => s.navigate);
  const selectPlayer = useGameStore((s) => s.selectPlayer);
  const simulateWeek = useGameStore((s) => s.simulateWeek);
  const season = useGameStore((s) => s.season);
  const notifications = useGameStore((s) => s.notifications);
  const markNotificationRead = useGameStore((s) => s.markNotificationRead);

  const [activeTab, setActiveTab] = useState<Tab>('kadro');

  if (!playerTeamId) return null;
  const team = teams[playerTeamId];
  if (!team) return null;

  const handlePlayerClick = (p: Player) => {
    selectPlayer(p.id);
    navigate('playerProfile');
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'kadro', label: 'Kadro' },
    { id: 'ilk11', label: 'İlk 11' },
    { id: 'taktik', label: 'Taktik' },
    { id: 'antrenman', label: 'Antrenman' },
  ];

  return (
    <ScreenBackground image="4.jpeg" className="p-4 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold text-white">{team.name}</h1>
          {season && !season.completed && season.currentWeek <= season.totalWeeks && (
            <button
              onClick={() => simulateWeek()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-4 rounded-lg transition-colors text-sm"
            >
              Maca Cik
            </button>
          )}
        </div>
        <p className="text-gray-400 text-xs mb-3">
          {team.playerIds.length} Oyuncu | Hafta {season?.currentWeek ?? '-'}
        </p>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => navigate('leagueTable')}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-lg transition-colors"
          >
            Puan Durumu
          </button>
          <button
            onClick={() => navigate('transfers')}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-lg transition-colors"
          >
            Transfer
          </button>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <div className="flex border-b border-gray-700 mb-4">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === t.id
                      ? 'text-emerald-400 border-emerald-400'
                      : 'text-gray-400 border-transparent hover:text-gray-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {activeTab === 'kadro' && <KadroTab onPlayerClick={handlePlayerClick} />}
            {activeTab === 'ilk11' && <Ilk11Tab />}
            {activeTab === 'taktik' && <TaktikTab />}
            {activeTab === 'antrenman' && <AntrenmanTab />}
          </div>

          <div className="w-56 flex-shrink-0">
            <NotificationPanel notifications={notifications} onRead={markNotificationRead} />
          </div>
        </div>
      </div>
    </ScreenBackground>
  );
}
