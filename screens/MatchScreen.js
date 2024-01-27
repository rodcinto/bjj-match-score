import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, View, ImageBackground } from "react-native";
import { Card, Text, FAB } from "react-native-paper";

import CountDownTimer from "../components/CountDownTimer";
import FinishButton from "../components/FinishButton";
import Participant from "../components/Participant";
import PlayPause from "../components/PlayPause";
import Vibrations from "../components/Vibrations";
import { FINISH_MATCH, NEW_MATCH } from "../constants/actions";
import { APP_TITLE } from "../constants/application";
import EndModal from "../screens/EndModal";
import NewMatchDialog from "../screens/NewMatchDialog";

const bgImage = require("../assets/web_bg.png");

export default function MatchScreen({
  dispatch,
  control,
  timer,
  participants,
}) {
  const [finishModalVisible, setFinishModalVisible] = useState(false);
  const showFinishModal = () => setFinishModalVisible(true);
  const hideFinishModal = () => setFinishModalVisible(false);

  const [newMatchDialogVisible, setNewMatchDialogVisible] = useState(false);

  const togglePlayPause = () => {};

  const finishMatch = () => {
    Vibrations.finish();

    dispatch({ type: FINISH_MATCH });

    showFinishModal();
  };

  const newMatchPress = () => {
    setNewMatchDialogVisible(true);
  };

  const hideNewMatchDialog = () => {
    setNewMatchDialogVisible(false);
  };

  const newMatchConfirmed = () => {
    hideNewMatchDialog();
    resetMatch();
  };

  const resetMatch = () => {
    Vibrations.vibrateDefault();

    dispatch({ type: NEW_MATCH });
  };

  return (
    <>
      <View style={styles.container}>
        <ImageBackground
          source={bgImage}
          resizeMode="cover"
          style={styles.background}
          imageStyle={styles.bgImage}
        >
          <View style={styles.header}>
            <Text variant="displaySmall" style={styles.headlineText}>{APP_TITLE}</Text>
            <CountDownTimer
              isMatchOn={control.matchOn}
              onFinish={finishMatch}
              play={timer.play}
              seconds={timer.seconds}
              reset={control.resetSignal}
            />
          </View>
          <View style={styles.participantsContainer}>
            <Card style={styles.participantCard}>
              <Participant
                dispatch={dispatch}
                participant={participants.P1}
                isMatchOn={control.matchOn}
                reset={control.resetSignal}
              />
            </Card>
            <Card style={styles.participantCard}>
              <Participant
                dispatch={dispatch}
                participant={participants.P2}
                isMatchOn={control.matchOn}
                reset={control.resetSignal}
              />
            </Card>
          </View>
          <View style={styles.controlButtons}>
            <PlayPause
              dispatch={dispatch}
              onPress={togglePlayPause}
              canStart={control.canStart}
              isMatchOn={control.matchOn}
            />
            <FinishButton
              onLongPress={finishMatch}
              canFinish={control.canStart}
            />
          </View>
        </ImageBackground>

        <StatusBar style="auto" />
      </View>

      <FAB
        icon="restart"
        size="medium"
        mode="elevated"
        variant="tertiary"
        style={styles.fab}
        onPress={newMatchPress}
      />

      <EndModal
        visible={finishModalVisible}
        onDismiss={hideFinishModal}
        participants={participants}
        reset={control.resetSignal}
      />

      <NewMatchDialog
        visible={newMatchDialogVisible}
        hideDialog={hideNewMatchDialog}
        confirm={newMatchConfirmed}
      />
    </>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    opacity: 0.5,
  },
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    // backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginTop: 50,
  },
  headlineText: {
    color: "white",
    marginTop: 20,
    textAlign: "center",
    fontWeight: "bold",
    textTransform: "uppercase",
    textShadowColor: "rgba(0, 0, 0, 0.90)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  participantsContainer: {
    flexDirection: "row",
  },
  participantCard: {
    width: "48%",
    margin: 3,
    opacity: 0.9,
  },
  controlButtons: {
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
