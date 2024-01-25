import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Modal, Text, ActivityIndicator } from "react-native-paper";

import { END_MODAL_REASON_POINTS } from "../constants/application";
import ColorHelper from "../utils/ColorHelper";

function ParticipantDetails({ participant }) {
  const printAdvantage = (adv) => {
    if (adv === 0 || adv > 1) return `${adv} Advantages`;
    return `${adv} Advantage`;
  };
  const printPenalty = (pnlt) => {
    if (pnlt === 0 || pnlt > 1) return `${pnlt} Penalties`;
    return `${pnlt} Penalty`;
  };
  return (
    <View style={styles.detailsSet}>
      <Text
        variant="titleLarge"
        style={[{ color: ColorHelper.defineNameColor(participant.corner) }]}
      >
        {participant.name}
      </Text>
      <Text variant="bodyMedium">{participant.results.rawPoints} points</Text>
      <Text variant="bodyMedium">
        {printAdvantage(participant.results.advantages)}
      </Text>
      <Text variant="bodyMedium">
        {printPenalty(participant.results.penalties)}
      </Text>
    </View>
  );
}

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export default function EndModal({ visible, onDismiss, participants }) {
  const [winner, setWinner] = useState(null);
  const [defeated, setDefeated] = useState(null);
  const [reason, setReason] = useState(END_MODAL_REASON_POINTS);

  useEffect(() => {
    let win, def;
    let updateReason = reason;

    if (participants.P1.winner) {
      win = participants.P1;
      def = participants.P2;
    } else if (participants.P2.winner) {
      win = participants.P2;
      def = participants.P1;
    } else {
      setReason(END_MODAL_REASON_POINTS);
      setWinner(null);
      setDefeated(null);
      return;
    }

    if (win.results.sub) updateReason = "Submission";
    if (def.results.dq) updateReason = "Disqualification";
    if (def.results.wo) updateReason = "W.O.";

    setReason(updateReason);
    setWinner(win);
    setDefeated(def);
  }, [visible]);

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={[
        styles.container,
        { backgroundColor: ColorHelper.defineBgColorByWinner(winner) },
      ]}
    >
      <Text variant="displaySmall" style={styles.headlineText}>
        Match End
      </Text>
      {isObjectEmpty(participants) ? (
        <ActivityIndicator />
      ) : winner ? (
        <View>
          <View style={styles.winnerWrapper}>
            <Text variant="headlineMedium" style={styles.winnerTxt}>
              <Text
                style={{ color: ColorHelper.defineNameColor(winner.corner) }}
              >
                {winner.name}
              </Text>{" "}
              win by {reason}
            </Text>
            <Text variant="headlineSmall" style={styles.winnerPts}>
              {winner.results.rawPoints} pts.
            </Text>
          </View>
          <View style={styles.detailsWrapper}>
            <ParticipantDetails participant={winner} />
            <ParticipantDetails participant={defeated} />
          </View>
        </View>
      ) : (
        <View>
          <View>
            <Text variant="headlineLarge" style={styles.drawTxt}>
              DRAW
            </Text>
          </View>
          <View style={styles.detailsWrapper}>
            <ParticipantDetails participant={participants.P1} />
            <ParticipantDetails participant={participants.P2} />
          </View>
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 50,
  },
  headlineText: {
    textAlign: "center",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 50,
  },
  winnerWrapper: {},
  winnerTxt: {
    textAlign: "center",
  },
  winnerPts: {
    textAlign: "center",
  },
  detailsWrapper: {
    flexDirection: "row",
    marginTop: 50,
  },
  detailsSet: {
    flexDirection: "column",
    width: "50%",
    alignItems: "center",
  },
  drawTxt: {
    color: "slategray",
    textAlign: "center",
    fontWeight: "bold",
    fontStyle: "italic",
  },
});
