import { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import {
  TextInput,
  IconButton,
  Text,
  SegmentedButtons,
} from "react-native-paper";

import ExtraButton from "./ExtraButton";
import PointsButton from "./PointsButton";
import Vibrations from "./Vibrations";
import { UPDATE_NAME, UPDATE_RESULTS } from "../constants/actions";
import {
  END_GAME_DQ,
  END_GAME_SUB,
  END_GAME_TYPES,
  END_GAME_WO,
  MAX_NAME_SIZE,
  SHRINK_NAME_ON,
} from "../constants/application";
import Advantage from "../domain/Advantage";
import Disqualification from "../domain/Disqualification";
import FourPoints from "../domain/FourPoints";
import Penalty from "../domain/Penalty";
import Submission from "../domain/Submission";
import ThreePoints from "../domain/ThreePoints";
import TwoPoints from "../domain/TwoPoints";
import WalkOver from "../domain/WalkOver";
import ColorHelper from "../utils/ColorHelper";
import Pile from "../utils/Pile";
import calculatePoints from "../utils/calculatePoints";

function Participant({ dispatch, participant, isMatchOn, reset }) {
  const [localPoints] = useState(new Pile());

  const [name, setName] = useState("");
  const [totalPoints, setTotalPoints] = useState(0);
  const [penalties, setPenalties] = useState(0);
  const [advantages, setAdvantages] = useState(0);
  const [endGame, setEndGame] = useState("");

  const updateStates = () => {
    const results = calculatePoints(localPoints);

    setTotalPoints(results.rawPoints);
    setAdvantages(results.advantages);
    setPenalties(results.penalties);
    setEndGame("");

    const mayHaveEndGame = localPoints.has(END_GAME_TYPES);
    if (mayHaveEndGame !== undefined) {
      setEndGame(mayHaveEndGame.type);
    }

    dispatch({ type: UPDATE_RESULTS, key: participant.key, results });
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
  };

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
  };

  const addAdvantage = () => {
    if (advantages >= 10) {
      return;
    }

    Vibrations.advantage();
    localPoints.push(new Advantage());

    updateStates();
  };

  const handleNameChange = (text) => {
    if (text.length > MAX_NAME_SIZE) {
      return;
    }
    setName(text);
    dispatch({ type: UPDATE_NAME, key: participant.key, value: name.trim() });
  }

  const handleNameBlur = () => {
    dispatch({ type: UPDATE_NAME, key: participant.key, value: name.trim() });
  };

  useEffect(() => {
    setName("");
    localPoints.clear();
    updateStates();
  }, [reset]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: ColorHelper.defineCardBgColor(participant.corner) },
      ]}
    >
      {isMatchOn ? (
        <Text
          variant={ name.length > SHRINK_NAME_ON ? "headlineSmall" : "headlineMedium" }
          style={[
            styles.nameText,
            { color: ColorHelper.defineNameColor(participant.corner) },
          ]}
        >
          {name.length > 0 ? name : participant.corner}
        </Text>
      ) : (
        <TextInput
          mode="outlined"
          outlineStyle={{borderColor: ColorHelper.defineNameColor(participant.corner)}}
          activeOutlineColor={ColorHelper.defineNameColor(participant.corner)}
          textColor={ColorHelper.defineNameColor(participant.corner)}
          label={`${participant.corner} CORNER`}
          style={styles.nameTxtInput}
          value={name}
          onChangeText={handleNameChange}
          onBlur={handleNameBlur}
        />
      )}

      <View style={styles.points}>
        <Text variant="headlineLarge" style={styles.pointsText}>
          {totalPoints}
        </Text>
        <Text variant="labelSmall" style={styles.pointsLbl}>
          Pts.
        </Text>
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonsGroup}>
          <PointsButton labelText="+2" onPress={() => addPoints(new TwoPoints())} />
          <PointsButton labelText="+3" onPress={() => addPoints(new ThreePoints())} />
          <PointsButton labelText="+4" onPress={() => addPoints(new FourPoints())} />
        </View>
        <View style={styles.buttonsGroup}>
          <ExtraButton
            amount={advantages}
            labelText="Adv."
            badgeStyles={styles.advantageBadge}
            onPress={addAdvantage}
          />
          <ExtraButton
            amount={penalties}
            labelText="Pnlt."
            badgeStyles={styles.penaltyBadge}
            onPress={addPenalty}
          />
        </View>
      </View>

      <View style={styles.segmentedButtonsWrapper}>
        <SegmentedButtons
          style={styles.endGameButtons}
          value={endGame}
          onValueChange={setEndGame}
          buttons={[
            {
              value: END_GAME_SUB,
              label: "Sub",
              onPress: () => addEndGame(new Submission()),
            },
            {
              value: END_GAME_DQ,
              label: "DQ",
              onPress: () => addEndGame(new Disqualification()),
            },
            {
              value: END_GAME_WO,
              label: "W.O.",
              onPress: () => addEndGame(new WalkOver()),
            },
          ]}
        />
      </View>

      <View style={[styles.buttonsContainer, styles.centerElements]}>
        <IconButton
          mode="contained"
          icon="undo"
          style={styles.btnUndo}
          onPress={undoPress}
          onLongPress={undoLongPress}
        />
      </View>
    </View>
  );
}
export default Participant;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 1,
    paddingVertical: 3,
  },
  centerElements: {
    alignSelf: "center",
  },
  nameText: {
    height: 56,
    textAlign: "center",
    fontWeight: "700",
    verticalAlign: "middle",
    lineHeight: 25,
  },
  nameTxtInput: {
    width: "90%",
    textAlign: "center",
    alignSelf: "center",
  },
  points: {
    flexDirection: "row",
    alignSelf: "center",
  },
  pointsText: {
    textAlign: "center",
  },
  pointsLbl: {
    textAlign: "center",
    verticalAlign: "bottom",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignSelf: "center",
  },
  buttonsGroup: {
    flexDirection: "column",
    alignSelf: "center",
  },
  btnExtra: {
    width: 80,
    margin: 4,
    zIndex: 1,
  },
  btnUndo: {},
  penaltyBadge: {
    position: "absolute",
    zIndex: 2,
  },
  advantageBadge: {
    backgroundColor: "gold",
    color: "orangered",
    position: "absolute",
    zIndex: 2,
  },
  segmentedButtonsWrapper: {
    flexDirection: "row",

    textAlign: "center",
  },
  endGameButtons: {
    marginVertical: 10,
    marginLeft: 5,
    transform: [{ scale: 0.7 }],
  },
});
