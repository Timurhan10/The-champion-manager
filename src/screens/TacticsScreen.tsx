import { useState } from 'react';
import { useGameStore } from '../store/game-store';
import { Formation, Tactic } from '../types';
import { FORMATIONS } from '../utils/constants';

const FORMATION_OPTIONS: Formation[] = ['4-4-2', '4-3-3', '4-2-3-1', '3-5-2', '5-3-2'];
const TACTIC_OPTIONS: { value: Tactic; label: string }[] = [
  { value: 'balanced', label: 'Dengeli' },
  { value: 'attack', label: 'Hücum' },
  { value: 'defense', label: 'Savunma' },
];

const TACTIC_DESCRIPTIONS: Record<Tactic, string> = {
  balanced: 'Dengeli bir yaklaşım. Atak ve savunma eşit ağırlıkta.',
  attack: 'Agresif hücum. Gol atma şansı artar ama savunma zayıflar.',
  defense: 'Savunma odaklı. Gol yeme riski azalır ama hücum zayıflar.',
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

export default function TacticsScreen() {
  const navigate = useGameStore((s) => s.navigate);
  const setFormation = useGameStore((s) => s.setFormation);
  const setTactic = useGameStore((s) => s.setTactic);
  const playerTeamId = useGameStore((s) => s.playerTeamId);
  const teams = useGameStore((s) => s.teams);

  const team = playerTeamId ? teams[playerTeamId] : null;
  const [selectedFormation, setSelectedFormation] = useState<Formation>(team?.tactics.formation ?? '4-4-2');
  const [selectedTactic, setSelectedTactic] = useState<Tactic>(team?.tactics.tactic ?? 'balanced');

  const handleSave = () => {
    setFormation(selectedFormation);
    setTactic(selectedTactic);
    navigate('squad');
  };

  const positions = FORMATION_POSITIONS[selectedFormation];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <button onClick={() => navigate('squad')} className="text-emerald-400 hover:text-emerald-300 mb-4">
        &larr; Geri
      </button>
      <h1 className="text-2xl font-bold mb-6">Taktik Ayarları</h1>

      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Diziliş</h2>
        <div className="flex flex-wrap gap-2">
          {FORMATION_OPTIONS.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFormation(f)}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                selectedFormation === f
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Saha Görünümü</h2>
        <div className="relative w-full max-w-md mx-auto aspect-[2/3] bg-green-900/40 rounded-lg border border-green-700/50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border border-green-700/40" />
          </div>
          <div className="absolute left-0 right-0 top-1/2 border-t border-green-700/40" />
          {positions.map((pos, i) => (
            <div
              key={i}
              className="absolute flex flex-col items-center"
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold shadow-lg">
                {pos.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Taktik</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {TACTIC_OPTIONS.map((t) => (
            <button
              key={t.value}
              onClick={() => setSelectedTactic(t.value)}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                selectedTactic === t.value
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="text-gray-400 text-sm">{TACTIC_DESCRIPTIONS[selectedTactic]}</p>
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors"
      >
        Kaydet
      </button>
    </div>
  );
}
