import { useGameStore } from '../store/game-store';

export default function MainMenuScreen() {
  const navigate = useGameStore((s) => s.navigate);
  const loadSavedGame = useGameStore((s) => s.loadSavedGame);
  const hasSave = localStorage.getItem('champion-manager-save') !== null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="text-6xl">⚽</div>
        <h1 className="text-5xl font-bold text-white tracking-tight">
          The Champion Manager
        </h1>
        <p className="text-gray-400 text-lg">Türkiye Futbol Menajerlik Oyunu</p>

        <div className="flex flex-col gap-4 items-center pt-4">
          <button
            onClick={() => navigate('leagueSelect')}
            className="w-64 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
          >
            Yeni Oyun
          </button>
          {hasSave && (
            <button
              onClick={() => {
                loadSavedGame();
                navigate('squad');
              }}
              className="w-64 px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
            >
              Devam Et
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
