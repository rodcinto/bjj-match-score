import { useReducer } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import ThemedPaperProvider from './components/ThemedPaperProvider';
import {
  FINISH_MATCH,
  NEW_MATCH,
  PAUSE_MATCH,
  START_MATCH,
  UPDATE_NAME,
  UPDATE_RESULTS,
} from "./constants/actions";
import { BLUE, P1_KEY, P2_KEY, RED } from "./constants/application";
import MatchScreen from "./screens/MatchScreen";
import chooseWinnerKey from "./utils/chooseWinnerKey";

function matchReducer(currentState, action) {
  console.log("Action dispatch.", action.type);

  switch (action.type) {
    case UPDATE_NAME:
      currentState.participants[action.key] = {
        ...currentState.participants[action.key],
        name: action.value,
      };
      return {
        ...currentState,
        control: {
          ...currentState.control,
          canStart: canAcceptNames(currentState.participants),
        },
      };
    case START_MATCH:
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
        },
      };
    case PAUSE_MATCH:
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
        },
      };
    case FINISH_MATCH:
      return actionFinishMatch(currentState);
    case UPDATE_RESULTS:
      currentState.participants[action.key].results = action.results;
      return currentState;
    case NEW_MATCH:
      return {
        ...initialMatchState,
        control: {
          ...initialMatchState.control,
          resetSignal: !currentState.control.resetSignal,
        },
      };
    default:
      throw Error(`Unkown action "${action.type}"`);
  }
}

function actionFinishMatch(currentState) {
  currentState.participants.P1.winner = false;
  currentState.participants.P2.winner = false;

  const winnerKey = chooseWinnerKey(
    currentState.participants.P1,
    currentState.participants.P2,
  );
  if (winnerKey) {
    currentState.participants[winnerKey].winner = true;
  }

  const newState = {
    ...currentState,
    control: {
      ...currentState.control,
      matchOn: false,
      resetSignal: currentState.control.resetSignal,
    },
    timer: {
      ...currentState.timer,
      play: false,
    },
  };

  return newState;
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
    play: false,
  },
  participants: {
    P1: {
      key: P1_KEY,
      corner: BLUE,
      name: "",
      winner: false,
      results: { ...results },
    },
    P2: {
      key: P2_KEY,
      corner: RED,
      name: "",
      winner: false,
      results: { ...results },
    },
  },
};

export default function App() {
  const [matchState, matchDispatch] = useReducer(
    matchReducer,
    initialMatchState,
  );

  return (
    <SafeAreaProvider>
      <ThemedPaperProvider>
        <MatchScreen
          dispatch={matchDispatch}
          control={matchState.control}
          timer={matchState.timer}
          participants={matchState.participants}
        />
      </ThemedPaperProvider>
    </SafeAreaProvider>
  );
}
