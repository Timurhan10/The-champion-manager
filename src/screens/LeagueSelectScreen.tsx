import { useGameStore } from '../store/game-store';
import ScreenBackground from '../components/ScreenBackground';

const LEAGUES = [
  { id: 'super-lig', name: 'Trendyol Süper Lig', tier: 1, teamCount: 18 },
  { id: '1-lig', name: 'TFF 1. Lig', tier: 2, teamCount: 18 },
];

export default function LeagueSelectScreen() {
  const navigate = useGameStore((s) => s.navigate);

  const handleSelect = (leagueId: string) => {
    useGameStore.setState({ selectedLeagueId: leagueId });
    navigate('teamSelect');
  };

  return (
    <ScreenBackground image="10.jpeg" className="p-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('mainMenu')}
          className="text-gray-400 hover:text-white mb-6 text-sm"
        >
          ← Geri
        </button>
        <h1 className="text-xl font-bold text-white mb-8">Lig Seçimi</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {LEAGUES.map((league) => (
            <button
              key={league.id}
              onClick={() => handleSelect(league.id)}
              className="bg-gray-800/80 backdrop-blur rounded-lg p-6 text-left hover:ring-2 hover:ring-emerald-500 transition-all"
            >
              <h2 className="text-sm font-bold text-white mb-2">{league.name}</h2>
              <div className="space-y-1 text-xs text-gray-400">
                <p>Kademe: {league.tier}. Lig</p>
                <p>{league.teamCount} Takım</p>
              </div>
              <div className="mt-4">
                <span className="inline-block px-3 py-1 bg-emerald-600/20 text-emerald-400 text-[10px] rounded-full">
                  {league.tier === 1 ? 'En Üst Lig' : 'İkinci Lig'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </ScreenBackground>
  );
}
