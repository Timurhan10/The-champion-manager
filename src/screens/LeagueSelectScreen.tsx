import { useGameStore } from '../store/game-store';
import { getCountry } from '../data/countries';
import ScreenBackground from '../components/ScreenBackground';

export default function LeagueSelectScreen() {
  const navigate = useGameStore((s) => s.navigate);
  const selectedCountryId = useGameStore((s) => s.selectedCountryId);

  const country = selectedCountryId ? getCountry(selectedCountryId) : null;
  const leagues = country?.leagues ?? [];

  const handleSelect = (leagueId: string) => {
    useGameStore.setState({ selectedLeagueId: leagueId });
    navigate('teamSelect');
  };

  const tierLabel = (tier: number) => {
    if (tier === 1) return 'En Üst Lig';
    return `${tier}. Kademe`;
  };

  return (
    <ScreenBackground image="10.jpeg" className="p-4 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold text-white">
            {country ? `${country.flag} ${country.name}` : 'Lig Seçimi'}
          </h1>
          <button
            onClick={() => navigate('countrySelect')}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-lg transition-colors"
          >
            ← Ülke Seçimi
          </button>
        </div>
        <p className="text-gray-400 text-xs mb-4">
          {leagues.length} lig mevcut
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leagues.map((league) => (
            <button
              key={league.id}
              onClick={() => handleSelect(league.id)}
              className="bg-gray-800/80 backdrop-blur rounded-lg p-5 text-left hover:ring-2 hover:ring-emerald-500 transition-all"
            >
              <h2 className="text-sm font-bold text-white mb-2">{league.name}</h2>
              <div className="space-y-1 text-xs text-gray-400">
                <p>{tierLabel(league.tier)}</p>
                <p>{league.teamCount} Takım</p>
              </div>
              <div className="mt-3">
                <span className={`inline-block px-3 py-1 text-[10px] rounded-full ${
                  league.tier === 1 ? 'bg-emerald-600/20 text-emerald-400' :
                  league.tier === 2 ? 'bg-blue-600/20 text-blue-400' :
                  league.tier === 3 ? 'bg-yellow-600/20 text-yellow-400' :
                  'bg-gray-600/20 text-gray-400'
                }`}>
                  {tierLabel(league.tier)}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </ScreenBackground>
  );
}
