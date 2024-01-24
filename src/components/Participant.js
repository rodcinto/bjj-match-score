import { forwardRef, useState, useImperativeHandle } from "react";
import { StyleSheet, View } from "react-native";
import { TextInput, Button, IconButton, Text, Badge, SegmentedButtons } from 'react-native-paper';

import Vibrations from "./Vibrations";
import calculatePoints from "../utils/calculatePoints";
import Advantage from '../domain/Advantage';
import Disqualification from '../domain/Disqualification';
import FourPoints from '../domain/FourPoints';
import Penalty from '../domain/Penalty';
import Submission from '../domain/Submission';
import ThreePoints from '../domain/ThreePoints';
import TwoPoints from '../domain/TwoPoints';
import WalkOver from '../domain/WalkOver';

const redCornerBgColor = 'rgba(255, 225, 225, 0.4)';
const blueCornerBgColor = 'rgba(230, 234, 255, 0.4)';

function Participant({corner, pointsPile, onNameChange, isMatchOn}, ref) {
  const END_GAME_TYPES = ['sub', 'dq', 'wo'];
  const [name, setName] = useState('');
  const [totalPoints, setTotalPoints] = useState(0);
  const [penalties, setPenalties] = useState(0);
  const [advantages, setAdvantages] = useState(0);
  const [endGame, setEndGame] = useState('');

  const updateStates = () => {
    const results = calculatePoints(pointsPile);

    setTotalPoints(results.rawPoints);
    setAdvantages(results.advantages);
    setPenalties(results.penalties);
  };

  const addPoints = (points) => {
    if (END_GAME_TYPES.includes(points.type)) {
      Vibrations.endGame();
      pointsPile.searchAndDestroy(END_GAME_TYPES);
    } else {
      Vibrations.byPoints(points.points);
    }
    pointsPile.push(points);
    updateStates();
  };

  const undoPress = () => {
    if (pointsPile.isEmpty()) {
      return;
    }

    Vibrations.undo();

    const removedOrder = pointsPile.pop();

    if (END_GAME_TYPES.includes(removedOrder.type)) {
      pointsPile.searchAndDestroy(END_GAME_TYPES);
      setEndGame('');
    }

    updateStates();
  };

  const undoLongPress = () => {
    Vibrations.undo();
    clearPile();
  };

  const clearPile = () => {
    pointsPile.clear();
    updateStates();
  }

  const addPenalty = () => {
    if (penalties >= 4) {
      return;
    }

    Vibrations.penalty();

    pointsPile.push(new Penalty());
    updateStates();
  }

  const addAdvantage = () => {
    if (advantages >=10) {
      return;
    }
    Vibrations.advantage();
    pointsPile.push(new Advantage());
    updateStates();
  };

  const handleNameChange = (text) => {
    setName(text);
    onNameChange(text);
  }

  useImperativeHandle(ref, () => {
    return {
      resetParticipant: () => {
        setName('');
        clearPile();
      }
    };
  });

  return (
    <View style={[styles.container, {backgroundColor: corner === 'BLUE' ? blueCornerBgColor : redCornerBgColor}]}>
      {isMatchOn ? (
        <Text variant="headlineMedium" style={styles.nameText}>{name}</Text>
      ) : (
        <TextInput
          mode="outlined"
          placeholder="Name"
          label="Before start"
          style={styles.nameTxtInput}
          value={name}
          onChangeText={ handleNameChange }
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
              onPress: () => addPoints(new Submission()),
            },
            {
              value: 'dq',
              label: 'DQ',
              onPress: () => addPoints(new Disqualification()),
            },
            {
              value: 'wo',
              label: 'W.O.',
              onPress: () => addPoints(new WalkOver()),
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
export default forwardRef(Participant);

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
