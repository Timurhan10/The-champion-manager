import { useGameStore } from '../store/game-store';
import coverImg from '/cover1.jpg?url';

export default function MainMenuScreen() {
  const navigate = useGameStore((s) => s.navigate);
  const loadSavedGame = useGameStore((s) => s.loadSavedGame);
  const hasSave = localStorage.getItem('champion-manager-save') !== null;

  const comingSoon = () => alert('Yakında!');

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${coverImg})` }}
    >
      <div className="absolute inset-0 bg-[#0a1628]/80" />

      <div className="relative z-10 flex flex-col items-center gap-10 px-4">
        {/* Logo */}
        <div className="flex flex-col items-center gap-1 select-none">
          <span className="text-[#C9A84C] text-xl">★</span>

          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#C9A84C]" />
            <span className="text-[#C9A84C] text-sm font-semibold tracking-[0.3em] uppercase">
              The
            </span>
            <span className="h-px w-8 bg-[#C9A84C]" />
          </div>

          <h1 className="text-6xl sm:text-7xl font-extrabold italic text-white tracking-tight leading-none">
            CHAMPION
          </h1>

          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-[#C9A84C]" />
            <span className="text-[#C9A84C] text-lg font-semibold tracking-[0.25em] uppercase">
              — Manager —
            </span>
            <span className="h-px w-6 bg-[#C9A84C]" />
          </div>
        </div>

        {/* Butonlar */}
        <div className="flex flex-col gap-3 items-center w-full max-w-xs">
          <button
            onClick={() => navigate('countrySelect')}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors text-sm shadow-lg"
          >
            Yeni Oyun
          </button>

          {hasSave && (
            <button
              onClick={() => { loadSavedGame(); navigate('squad'); }}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors text-sm border border-white/20"
            >
              Devam Et
            </button>
          )}

          <button
            onClick={comingSoon}
            className="w-full py-3 bg-white/5 text-white/40 font-semibold rounded-lg text-sm border border-white/10 cursor-not-allowed"
          >
            Çoklu Oyun
          </button>

          <button
            onClick={comingSoon}
            className="w-full py-3 bg-white/5 text-white/40 font-semibold rounded-lg text-sm border border-white/10 cursor-not-allowed"
          >
            Hesap Girişi
          </button>

          <div className="flex gap-3 w-full pt-1">
            <button
              onClick={comingSoon}
              className="flex-1 py-2.5 bg-white/5 text-white/40 font-semibold rounded-lg border border-white/10 cursor-not-allowed"
            >
              Ayarlar
            </button>
            <button
              onClick={comingSoon}
              className="flex-1 py-2.5 bg-white/5 text-white/40 font-semibold rounded-lg border border-white/10 cursor-not-allowed"
            >
              Kılavuz
            </button>
          </div>
        </div>

        <p className="text-white/30 text-xs tracking-wide">v1.0 — Türkiye Futbol Menajerlik Oyunu</p>
      </div>
    </div>
  );
}
