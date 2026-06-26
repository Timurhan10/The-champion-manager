import { useGameStore } from '../store/game-store';
import superligData from '../data/superlig-teams.json';
import birincligData from '../data/birinclig-teams.json';
import { formatMoney } from '../utils/format';

interface RawTeam {
  id: string;
  name: string;
  shortName: string;
  city: string;
  colors: { primary: string; secondary: string };
  transferBudget: number;
  wageBudget: number;
  homeAdvantage: number;
  reputation: number;
  players: unknown[];
}

export default function TeamSelectScreen() {
  const navigate = useGameStore((s) => s.navigate);
  const startNewGame = useGameStore((s) => s.startNewGame);
  const selectedLeagueId = useGameStore((s) => s.selectedLeagueId);

  const leagueId = selectedLeagueId || 'super-lig';
  const data = leagueId === 'super-lig' ? superligData : birincligData;
  const teams = data.teams as RawTeam[];

  const handleSelect = (teamId: string) => {
    startNewGame(leagueId, teamId);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('leagueSelect')}
          className="text-gray-400 hover:text-white mb-6 text-sm"
        >
          ← Geri
        </button>
        <h1 className="text-3xl font-bold text-white mb-2">Takım Seçimi</h1>
        <p className="text-gray-400 mb-8">{data.leagueName}</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => handleSelect(team.id)}
              className="bg-gray-800 rounded-lg p-4 text-left hover:ring-2 hover:ring-emerald-500 transition-all"
            >
              <div
                className="h-1.5 rounded-full mb-3"
                style={{
                  background: `linear-gradient(to right, ${team.colors.primary}, ${team.colors.secondary})`,
                }}
              />
              <h3 className="text-white font-bold text-sm">{team.name}</h3>
              <p className="text-gray-500 text-xs mb-3">{team.city}</p>
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>{formatMoney(team.transferBudget)}</span>
                <span>
                  {'★'.repeat(Math.round(team.reputation / 20))}
                  {'☆'.repeat(5 - Math.round(team.reputation / 20))}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
