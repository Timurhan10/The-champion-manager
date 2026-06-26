import { useGameStore } from './store/game-store';
import MainMenuScreen from './screens/MainMenuScreen';
import LeagueSelectScreen from './screens/LeagueSelectScreen';
import TeamSelectScreen from './screens/TeamSelectScreen';
import SquadScreen from './screens/SquadScreen';
import StartingElevenScreen from './screens/StartingElevenScreen';
import PlayerProfileScreen from './screens/PlayerProfileScreen';
import TacticsScreen from './screens/TacticsScreen';
import TransfersScreen from './screens/TransfersScreen';
import FixturesScreen from './screens/FixturesScreen';
import MatchSimScreen from './screens/MatchSimScreen';
import LeagueTableScreen from './screens/LeagueTableScreen';
import EndOfSeasonScreen from './screens/EndOfSeasonScreen';

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
    case 'startingEleven':
      return <StartingElevenScreen />;
    case 'playerProfile':
      return <PlayerProfileScreen />;
    case 'tactics':
      return <TacticsScreen />;
    case 'transfers':
      return <TransfersScreen />;
    case 'fixtures':
      return <FixturesScreen />;
    case 'matchSim':
      return <MatchSimScreen />;
    case 'leagueTable':
      return <LeagueTableScreen />;
    case 'endOfSeason':
      return <EndOfSeasonScreen />;
    default:
      return <MainMenuScreen />;
  }
}

export default App;
