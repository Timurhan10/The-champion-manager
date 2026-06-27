import { useGameStore } from '../store/game-store';

export default function MainMenuScreen() {
  const navigate = useGameStore((s) => s.navigate);
  const loadSavedGame = useGameStore((s) => s.loadSavedGame);
  const hasSave = localStorage.getItem('champion-manager-save') !== null;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/cover1.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 text-center space-y-8">
        <h1 className="text-5xl font-bold text-white tracking-tight drop-shadow-lg">
          The Champion Manager
        </h1>
        <p className="text-gray-300 text-lg drop-shadow">Türkiye Futbol Menajerlik Oyunu</p>

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
