import { useState, useMemo } from 'react';
import { useGameStore } from '../store/game-store';
import { COUNTRIES, CONTINENT_NAMES } from '../data/countries';
import ScreenBackground from '../components/ScreenBackground';

const CONTINENT_ORDER = ['europe', 'southAmerica', 'northAmerica', 'asia', 'africa', 'oceania'] as const;

export default function CountrySelectScreen() {
  const navigate = useGameStore((s) => s.navigate);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return COUNTRIES;
    const q = search.toLowerCase();
    return COUNTRIES.filter(c => c.name.toLowerCase().includes(q));
  }, [search]);

  const grouped = useMemo(() => {
    const map: Record<string, typeof COUNTRIES> = {};
    for (const c of filtered) {
      if (!map[c.continent]) map[c.continent] = [];
      map[c.continent].push(c);
    }
    return map;
  }, [filtered]);

  const handleSelect = (countryId: string) => {
    useGameStore.setState({ selectedCountryId: countryId });
    navigate('leagueSelect');
  };

  return (
    <ScreenBackground image="10.jpeg" className="p-4 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold text-white">Ülke Seçimi</h1>
          <button
            onClick={() => navigate('mainMenu')}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-lg transition-colors"
          >
            Ana Menü
          </button>
        </div>
        <p className="text-gray-400 text-xs mb-3">58 ülke arasından seçim yap</p>

        <input
          type="text"
          placeholder="Ülke ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-800/80 backdrop-blur text-white rounded-lg px-4 py-2 text-sm mb-4 border border-gray-700 focus:border-emerald-500 focus:outline-none"
        />

        {CONTINENT_ORDER.map((continent) => {
          const countries = grouped[continent];
          if (!countries?.length) return null;
          return (
            <div key={continent} className="mb-4">
              <h2 className="text-sm font-semibold text-emerald-400 mb-2">{CONTINENT_NAMES[continent]}</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {countries.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelect(c.id)}
                    className="bg-gray-800/80 backdrop-blur rounded-lg p-3 text-center hover:ring-2 hover:ring-emerald-500 transition-all group"
                  >
                    <span className="text-2xl block mb-1">{c.flag}</span>
                    <span className="text-white text-[10px] font-medium group-hover:text-emerald-400 transition-colors">{c.name}</span>
                    <span className="text-gray-500 text-[9px] block">{c.leagues.length} lig</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </ScreenBackground>
  );
}
