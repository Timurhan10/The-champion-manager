import { useMemo } from 'react';
import { useGameStore } from '../store/game-store';
import { formatMoney } from '../utils/format';
import { getCountry } from '../data/countries';
import { generateTeamPreviews } from '../data/generators';
import superligData from '../data/superlig-teams.json';
import birincligData from '../data/birinclig-teams.json';
import ScreenBackground from '../components/ScreenBackground';

interface TeamPreview {
  id: string;
  name: string;
  shortName: string;
  city: string;
  colors: { primary: string; secondary: string };
  transferBudget: number;
  reputation: number;
}

export default function TeamSelectScreen() {
  const navigate = useGameStore((s) => s.navigate);
  const startNewGame = useGameStore((s) => s.startNewGame);
  const selectedLeagueId = useGameStore((s) => s.selectedLeagueId);
  const selectedCountryId = useGameStore((s) => s.selectedCountryId);

  const countryId = selectedCountryId || 'TR';
  const leagueId = selectedLeagueId || 'super-lig';
  const country = getCountry(countryId);

  const teams: TeamPreview[] = useMemo(() => {
    if (countryId === 'TR' && (leagueId === 'super-lig' || leagueId === '1-lig')) {
      const data = leagueId === 'super-lig' ? superligData : birincligData;
      return (data.teams as TeamPreview[]).map(t => ({
        id: t.id,
        name: t.name,
        shortName: t.shortName,
        city: t.city,
        colors: t.colors,
        transferBudget: t.transferBudget,
        reputation: t.reputation,
      }));
    }
    return generateTeamPreviews(countryId, leagueId);
  }, [countryId, leagueId]);

  const leagueName = country?.leagues.find(l => l.id === leagueId)?.name ?? leagueId;

  const handleSelect = (teamId: string) => {
    startNewGame(countryId, leagueId, teamId);
  };

  return (
    <ScreenBackground image="6.jpeg" className="p-4 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold text-white">Takım Seçimi</h1>
          <button
            onClick={() => navigate('leagueSelect')}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-lg transition-colors"
          >
            ← Lig Seçimi
          </button>
        </div>
        <p className="text-gray-400 text-xs mb-4">
          {country?.flag} {leagueName}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => handleSelect(team.id)}
              className="bg-gray-800/80 backdrop-blur rounded-lg p-4 text-left hover:ring-2 hover:ring-emerald-500 transition-all"
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
    </ScreenBackground>
  );
}
