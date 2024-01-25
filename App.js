import { useReducer } from 'react';
import { PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import MatchScreen from './screens/MatchScreen';
import light from './themes/redAndBlue/light.json'
import chooseWinnerKey from './utils/chooseWinnerKey';

const theme = {
  ...DefaultTheme,
  colors: light.colors,
};

function matchReducer(currentState, action) {
  console.log('Action dispatch.', action.type);

  switch(action.type) {
    case 'updateName':
      currentState.participants[action.key] = {
        ...currentState.participants[action.key],
        name: action.value
      };
      return {
        ...currentState,
        control: {
          ...currentState.control,
          canStart: canAcceptNames(currentState.participants)
        }
      };
    case 'startMatch':
      return {
        ...currentState,
        control: {
          ...currentState.control,
          canStart: canAcceptNames(currentState.participants),
          matchOn: true,
        },
        timer: {
          ...currentState.timer,
          play: true,
        }
      };
    case 'pauseMatch':
      return {
        ...currentState,
        control: {
          ...currentState.control,
          canStart: canAcceptNames(currentState.participants),
          matchOn: false,
        },
        timer: {
          ...currentState.timer,
          play: false,
        }
      };
    case 'finishMatch':
      return actionFinishMatch(currentState);
    case 'updateResults':
      currentState.participants[action.key].results = action.results;
      return currentState;
    case 'newMatch':
      return {
        ...initialMatchState,
        control: {
          ...initialMatchState.control,
          resetSignal: !currentState.control.resetSignal,
        }
      };
    default:
      throw Error(`Unkown action "${action.type}"`);
  }
}

function actionFinishMatch(currentState) {
  const winnerKey = chooseWinnerKey(
    currentState.participants.P1,
    currentState.participants.P2
  );
  if (winnerKey) {
    currentState.participants.P1.winner = false;
    currentState.participants.P2.winner = false;
    currentState.participants[winnerKey].winner = true;
  }
  return {
    ...currentState,
    control: {
      ...currentState.control,
      matchOn: false,
      resetSignal: currentState.control.resetSignal,
    },
    timer: {
      ...currentState.timer,
      play: false,
    }
  };
}

function canAcceptNames(participants) {
  if (participants.P1.name.length === 0 || participants.P2.name.length === 0) {
    return false;
  }
  if (participants.P1.name === participants.P2.name) {
    return false;
  }

  return true;
}

const results = {
  processedPoints: 0,
  rawPoints: 0,
  advantages: 0,
  penalties: 0,
  sub: false,
  dq: false,
  wo: false,
};

const initialMatchState = {
  control: {
    canStart: false,
    matchOn: false,
    resetSignal: false,
  },
  timer: {
    seconds: 300,
    play: false,
  },
  participants: {
    P1: {
      key: 'P1',
      corner: 'BLUE',
      name: '',
      winner: false,
      results: { ...results },
    },
    P2: {
      key: 'P2',
      corner: 'RED',
      name: '',
      winner: false,
      results: { ...results },
    },
  },
};

export default function App() {
  const [matchState, matchDispatch] = useReducer(matchReducer, initialMatchState);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <MatchScreen
          dispatch={matchDispatch}
          control={matchState.control}
          timer={matchState.timer}
          participants={matchState.participants}
        />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

