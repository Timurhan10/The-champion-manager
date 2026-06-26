import { useState } from 'react';
import { useGameStore } from '../store/game-store';
import { FORMATIONS } from '../utils/constants';
import type { Player, Position } from '../types';

const PITCH_ROWS: Record<string, number[][]> = {
  '4-4-2': [[0], [1, 2, 3, 4], [5, 6, 7, 8], [9, 10]],
  '4-3-3': [[0], [1, 2, 3, 4], [5, 6, 7], [8, 9, 10]],
  '4-2-3-1': [[0], [1, 2, 3, 4], [5, 6], [7, 8, 9], [10]],
  '3-5-2': [[0], [1, 2, 3], [4, 5, 6, 7, 8], [9, 10]],
  '5-3-2': [[0], [1, 2, 3, 4, 5], [6, 7, 8], [9, 10]],
};

export default function StartingElevenScreen() {
  const players = useGameStore((s) => s.players);
  const teams = useGameStore((s) => s.teams);
  const playerTeamId = useGameStore((s) => s.playerTeamId);
  const navigate = useGameStore((s) => s.navigate);
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
  const allSquadIds = team.playerIds;
  const nonStarting = allSquadIds.filter((id) => !startingIds.includes(id));

  const rows = PITCH_ROWS[formation] || PITCH_ROWS['4-4-2'];

  const handleSlotClick = (slotIndex: number) => {
    if (selectedSlot === null) {
      setSelectedSlot(slotIndex);
    } else {
      // swap two starting slots
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

  const handleAutoSelect = () => {
    autoSelectSquad(playerTeamId);
    setSelectedSlot(null);
  };

  const getPlayer = (id: string): Player | undefined => players[id];

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('squad')}
          className="text-gray-400 hover:text-white mb-4 text-sm"
        >
          ← Kadroya Dön
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">İlk 11</h1>
            <p className="text-gray-400 text-sm">Diziliş: {formation}</p>
          </div>
          <button
            onClick={handleAutoSelect}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Otomatik Seç
          </button>
        </div>

        {/* Pitch */}
        <div className="bg-emerald-900/40 border border-emerald-800/50 rounded-lg p-6 mb-6">
          <div className="flex flex-col-reverse gap-4">
            {rows.map((row, ri) => (
              <div key={ri} className="flex justify-center gap-3">
                {row.map((slotIdx) => {
                  const pid = startingIds[slotIdx];
                  const p = pid ? getPlayer(pid) : undefined;
                  const isSelected = selectedSlot === slotIdx;
                  return (
                    <button
                      key={slotIdx}
                      onClick={() => handleSlotClick(slotIdx)}
                      className={`w-20 py-2 rounded-lg text-center transition-all ${
                        isSelected
                          ? 'bg-emerald-500 ring-2 ring-white'
                          : 'bg-gray-800/80 hover:bg-gray-700/80'
                      }`}
                    >
                      <div className="text-[10px] text-gray-400">{positions[slotIdx]}</div>
                      <div className="text-xs text-white font-medium truncate px-1">
                        {p ? p.name.split(' ').pop() : '---'}
                      </div>
                      {p && <div className="text-[10px] text-emerald-400 font-bold">{p.overallRating}</div>}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Bench / swap targets */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-white font-semibold mb-3">
            {selectedSlot !== null ? 'Takas yapılacak oyuncuyu seçin' : 'Yedekler'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {nonStarting.map((id) => {
              const p = getPlayer(id);
              if (!p) return null;
              return (
                <button
                  key={id}
                  onClick={() => selectedSlot !== null && handleBenchSwap(id)}
                  className={`flex items-center gap-2 p-2 rounded-lg text-left text-sm transition-colors ${
                    selectedSlot !== null
                      ? 'bg-gray-700 hover:bg-emerald-700/50 cursor-pointer'
                      : 'bg-gray-700/50 cursor-default'
                  }`}
                >
                  <span className="text-gray-500 text-xs w-8">{p.position}</span>
                  <span className="text-white truncate flex-1">{p.name}</span>
                  <span className="text-emerald-400 text-xs font-bold">{p.overallRating}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
