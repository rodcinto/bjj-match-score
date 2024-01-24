import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Modal, Text, ActivityIndicator } from 'react-native-paper';

const blueCornerTxtColor = 'rgb(78, 106, 249)';
const redCornerTxtColor = 'rgb(253, 70, 70)';
const redCornerBgColor = 'rgba(255, 215, 195, 1)';
const blueCornerBgColor = 'rgba(230, 234, 255, 1)';

function defineBgColor(winner) {
  if (!winner) {
    return 'white';
  }

  return winner.key === 'BLUE' ? blueCornerBgColor : redCornerBgColor
}

function defineNameColor(corner) {
  return corner === 'BLUE' ? blueCornerTxtColor : redCornerTxtColor
};

function ParticipantDetails({ name, points, corner }) {

  return (
    <View style={styles.detailsSet}>
      <Text variant='titleLarge' style={[{color: defineNameColor(corner)}]}>{name}</Text>
      <Text variant='bodyMedium'>{points.rawPoints} points</Text>
      <Text variant='bodyMedium'>{points.advantages} Advantages</Text>
      <Text variant='bodyMedium'>{points.penalties} Penalties</Text>
    </View>
  );
}

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export default function EndModal({ visible, onDismiss, report }) {
  const [winner, setWinner] = useState(null);
  const [defeated, setDefeated] = useState(null);
  const [reason, setReason] = useState('points');

  useEffect(() => {
    if (isObjectEmpty(report)) {
      return;
    }

    let winner, defeated;
    let updateReason = reason;

    if (report.P1.winner) {
      winner = report.P1;
      defeated = report.P2;
    } else if(report.P2.winner) {
      winner = report.P2;
      defeated = report.P1;
    } else {
      return;
    }

    if (winner.points.sub) updateReason = 'Submission';
    if (defeated.points.dq) updateReason = 'Disqualification';
    if (defeated.points.wo) updateReason = 'W.O.';

    setReason(updateReason)
    setWinner(winner);
    setDefeated(defeated);
  }, [visible]);

  return (
    <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={[styles.container, {backgroundColor: defineBgColor(winner)}]}>
      <Text variant="displaySmall" style={styles.headlineText}>Match End</Text>
      {isObjectEmpty(report) ?
        (<ActivityIndicator />)
        :
        (winner ?
          (
            <View>
              <View style={styles.winnerWrapper}>
                <Text variant='headlineMedium' style={styles.winnerTxt}>
                  <Text style={{color: defineNameColor(winner.key)}}>{winner.name}</Text> win by {reason}
                </Text>
                <Text variant='headlineSmall' style={styles.winnerPts}>{winner.points.rawPoints} pts.</Text>
              </View>
              <View style={styles.detailsWrapper}>
                <ParticipantDetails name={winner.name} points={winner.points} corner={winner.key} />
                <ParticipantDetails name={defeated.name} points={defeated.points} corner={defeated.key} />
              </View>
            </View>
          ) :
          (
            <View>
              <View>
                <Text variant='headlineLarge' style={styles.drawTxt}>DRAW</Text>
              </View>
              <View style={styles.detailsWrapper}>
                <ParticipantDetails name={report.P1.name} points={report.P1.points} corner={report.P1.key} />
                <ParticipantDetails name={report.P2.name} points={report.P2.points} corner={report.P2.key} />
              </View>
            </View>
          ))
      }

    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 50,
  },
  headlineText: {
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 50,
  },
  winnerWrapper: {},
  winnerTxt: {
    textAlign: 'center',
  },
  winnerPts: {
    textAlign: 'center',
  },
  detailsWrapper: {
    flexDirection: 'row',
    marginTop: 50,
  },
  detailsSet: {
    flexDirection: 'column',
    width: '50%',
    alignItems: 'center',
  },
  drawTxt: {
    color: 'slategray',
    textAlign: 'center',
    fontWeight: 'bold',
    fontStyle: 'italic',
  }
});
