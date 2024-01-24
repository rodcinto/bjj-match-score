import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { TextInput, Button, IconButton, Text, Badge, SegmentedButtons } from 'react-native-paper';

import Vibrations from "./Vibrations";
import calculatePoints from "../../Utils/calculatePoints";
import Advantage from '../domain/Advantage';
import Disqualification from '../domain/Disqualification';
import FourPoints from '../domain/FourPoints';
import Penalty from '../domain/Penalty';
import Submission from '../domain/Submission';
import ThreePoints from '../domain/ThreePoints';
import TwoPoints from '../domain/TwoPoints';
import WalkOver from '../domain/WalkOver';

function Participant({pointsPile, onNameChange, isMatchOn}) {
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

  const undo = () => {
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

  return (
    <View style={styles.container}>
      {isMatchOn ? (
        <Text variant="headlineMedium">{name}</Text>
      ) : (
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={ handleNameChange }
        />
      )}

      <View style={styles.points}>
        <Text style={styles.pointsText}>{totalPoints}</Text>
        <Text style={styles.pointsLbl}>Pts</Text>
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

      <View style={styles.buttonsContainer}>
        <SegmentedButtons
          density="small"
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
        <IconButton mode="contained" icon="undo" style={styles.btnUndo} onPress={undo} onLongPress={clearPile} />
      </View>
    </View>
  );
};
export default Participant;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 150,
    padding: 5,
  },
  centerElements: {
    alignSelf: 'center',
  },
  points: {},
  pointsText: {},
  pointsLbl: {},
  buttonsContainer: {
    flexDirection: "row",
  },
  buttonsGroup: {
    flexDirection: "column",
    padding: 5,
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
  endGameButtons: {
    transform: [{scale: 0.75}],
  },
});
