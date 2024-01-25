import { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { TextInput, Button, IconButton, Text, Badge, SegmentedButtons } from 'react-native-paper';

import Vibrations from "./Vibrations";
import Advantage from '../domain/Advantage';
import Disqualification from '../domain/Disqualification';
import FourPoints from '../domain/FourPoints';
import Penalty from '../domain/Penalty';
import Submission from '../domain/Submission';
import ThreePoints from '../domain/ThreePoints';
import TwoPoints from '../domain/TwoPoints';
import WalkOver from '../domain/WalkOver';
import ColorHelper from "../utils/ColorHelper";
import Pile from "../utils/Pile";
import calculatePoints from "../utils/calculatePoints";
import { UPDATE_NAME, UPDATE_RESULTS } from "../constants/actions";

function Participant({dispatch, participant, isMatchOn, reset}, ref) {
  const END_GAME_TYPES = ['sub', 'dq', 'wo'];

  const [localPoints,] = useState(new Pile());

  const [name, setName] = useState('');
  const [totalPoints, setTotalPoints] = useState(0);
  const [penalties, setPenalties] = useState(0);
  const [advantages, setAdvantages] = useState(0);
  const [endGame, setEndGame] = useState('');

  const updateStates = () => {
    const results = calculatePoints(localPoints);

    setTotalPoints(results.rawPoints);
    setAdvantages(results.advantages);
    setPenalties(results.penalties);
    setEndGame('');

    const mayHaveEndGame = localPoints.has(END_GAME_TYPES);
    if (mayHaveEndGame !== undefined) {
      setEndGame(mayHaveEndGame.type);
    }

    dispatch({type: UPDATE_RESULTS, key: participant.key, results});
  };

  const addPoints = (pointsGiven) => {
    Vibrations.byPoints(pointsGiven.points);
    localPoints.push(pointsGiven);

    updateStates();
  };

  const addEndGame = (endGameGiven) => {
    Vibrations.endGame();
    localPoints.searchAndDestroy(END_GAME_TYPES);
    localPoints.push(endGameGiven);

    updateStates();
  }

  const undoPress = () => {
    if (localPoints.isEmpty()) {
      return;
    }

    Vibrations.undo();
    const lastPoint = localPoints.pop();
    if (END_GAME_TYPES.includes(lastPoint.type)) {
      localPoints.searchAndDestroy(END_GAME_TYPES);
    }

    updateStates();
  };

  const undoLongPress = () => {
    Vibrations.undo();
    localPoints.clear();
    updateStates();
  };


  const addPenalty = () => {
    if (penalties >= 4) {
      return;
    }

    Vibrations.penalty();
    localPoints.push(new Penalty());

    updateStates();
  }

  const addAdvantage = () => {
    if (advantages >=10) {
      return;
    }

    Vibrations.advantage();
    localPoints.push(new Advantage());

    updateStates();
  };

  const handleNameBlur = () => {
    dispatch({type: UPDATE_NAME, key: participant.key, value: name});
  };

  useEffect(() => {
    setName('');
    localPoints.clear();
    updateStates();
  }, [reset]);

  return (
    <View style={[styles.container, { backgroundColor: ColorHelper.defineCardBgColor(participant.corner) }]}>
      {isMatchOn ? (
        <Text variant="headlineMedium" style={[styles.nameText, {color: ColorHelper.defineNameColor(participant.corner)}]}>
          {name}
        </Text>
      ) : (
        <TextInput
          mode="outlined"
          label={`${participant.corner} CORNER`}
          style={styles.nameTxtInput}
          value={name}
          onChangeText={setName}
          onBlur={handleNameBlur}
        />
      )}

      <View style={styles.points}>
        <Text variant="headlineLarge" style={styles.pointsText}>{totalPoints}</Text>
        <Text variant="labelSmall" style={styles.pointsLbl}>Pts.</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonsGroup}>
          <Button mode="elevated" style={styles.btnPoint} onPress={ () => addPoints(new TwoPoints()) }>
            <Text>+2</Text>
          </Button>
          <Button mode="elevated" style={styles.btnPoint} onPress={ () => addPoints(new ThreePoints()) }>
            <Text>+3</Text>
          </Button>
          <Button mode="elevated" style={styles.btnPoint} onPress={ () => addPoints(new FourPoints()) }>
            <Text>+4</Text>
          </Button>
        </View>
        <View style={styles.buttonsGroup}>
          <View style={styles.extraWrapper}>
          { advantages > 0 ? (<Badge style={styles.advantageBadge}>{advantages}</Badge>) : <></> }
            <Button mode="elevated" style={styles.btnExtra} onPress={addAdvantage}>
              <Text>Adv.</Text>
            </Button>
          </View>
          <View style={styles.extraWrapper}>
            { penalties > 0 ? (<Badge style={styles.penaltyBadge}>{penalties}</Badge>) : <></> }
            <Button mode="elevated" style={styles.btnExtra} onPress={addPenalty}>
              <Text>Pnlt.</Text>
            </Button>
          </View>
        </View>
      </View>

      <View style={styles.segmentedButtonsWrapper}>
        <SegmentedButtons
          density="medium"
          style={styles.endGameButtons}
          value={endGame}
          onValueChange={setEndGame}
          buttons={[
            {
              value: 'sub',
              label: 'Sub',
              onPress: () => addEndGame(new Submission()),
            },
            {
              value: 'dq',
              label: 'DQ',
              onPress: () => addEndGame(new Disqualification()),
            },
            {
              value: 'wo',
              label: 'W.O.',
              onPress: () => addEndGame(new WalkOver()),
            },
          ]}
        />
      </View>

      <View style={[styles.buttonsContainer, styles.centerElements]}>
        <IconButton mode="contained" icon="undo" style={styles.btnUndo} onPress={undoPress} onLongPress={undoLongPress} />
      </View>
    </View>
  );
};
export default Participant;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 1,
    paddingVertical: 3,
  },
  centerElements: {
    alignSelf: 'center',
  },
  nameText: {
    height: 56,
    textAlign: 'center',
    fontWeight: '700',
    verticalAlign: 'middle',
  },
  nameTxtInput: {
    width: '90%',
    textAlign: 'center',
    alignSelf: 'center',
  },
  points: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  pointsText: {
    textAlign: 'center',
  },
  pointsLbl: {
    textAlign: 'center',
    verticalAlign: 'bottom',
  },
  buttonsContainer: {
    flexDirection: "row",
    alignSelf: 'center',
  },
  buttonsGroup: {
    flexDirection: "column",
    alignSelf: 'center',
  },
  btnPoint: {
    width: 20,
    margin: 4
  },
  btnExtra: {
    width: 80,
    margin: 4,
    zIndex: 1,
  },
  btnUndo: {
  },
  extraWrapper: {

  },
  penaltyBadge: {
    position: 'absolute',
    zIndex: 2,
  },
  advantageBadge: {
    backgroundColor: 'gold',
    color: 'orangered',
    position: 'absolute',
    zIndex: 2,
  },
  segmentedButtonsWrapper: {
    flexDirection: 'row',

    textAlign: 'center',
  },
  endGameButtons: {
    marginVertical: 10,
    marginLeft: 5,
    transform: [{scale: 0.70}],
  },
});
