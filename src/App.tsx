import { useGameStore } from './store/game-store';
import MainMenuScreen from './screens/MainMenuScreen';
import LeagueSelectScreen from './screens/LeagueSelectScreen';
import TeamSelectScreen from './screens/TeamSelectScreen';
import SquadScreen from './screens/SquadScreen';
import PlayerProfileScreen from './screens/PlayerProfileScreen';
import TransfersScreen from './screens/TransfersScreen';
import MatchSimScreen from './screens/MatchSimScreen';
import LeagueTableScreen from './screens/LeagueTableScreen';
import EndOfSeasonScreen from './screens/EndOfSeasonScreen';
import TeamViewScreen from './screens/TeamViewScreen';

function App() {
  const screen = useGameStore((s) => s.screen);

  switch (screen) {
    case 'mainMenu':
      return <MainMenuScreen />;
    case 'leagueSelect':
      return <LeagueSelectScreen />;
    case 'teamSelect':
      return <TeamSelectScreen />;
    case 'squad':
      return <SquadScreen />;
    case 'playerProfile':
      return <PlayerProfileScreen />;
    case 'transfers':
      return <TransfersScreen />;
    case 'matchSim':
      return <MatchSimScreen />;
    case 'leagueTable':
      return <LeagueTableScreen />;
    case 'endOfSeason':
      return <EndOfSeasonScreen />;
    case 'teamView':
      return <TeamViewScreen />;
    default:
      return <MainMenuScreen />;
  }
}

export default App;
