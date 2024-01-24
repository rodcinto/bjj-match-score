import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Modal, Text, ActivityIndicator } from 'react-native-paper';

function ParticipantDetails({ name, points }) {
  return (
    <View>
      <Text>{name}</Text>
      <Text>{points.rawPoints} points</Text>
      <Text>{points.advantages} Advantages</Text>
      <Text>{points.penalties} Penalties</Text>
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
    <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.container}>
      <Text variant="displaySmall">Match End</Text>
      {isObjectEmpty(report) ?
        (<ActivityIndicator />)
        :
        (winner ?
          (
            <View>
              <View>
                <Text>Winner: {winner.name} by {reason}</Text>
                <Text>{winner.points.rawPoints} points</Text>
              </View>
              <ParticipantDetails name={winner.name} points={winner.points} />
              <ParticipantDetails name={defeated.name} points={defeated.points} />
            </View>
          ) :
          (
            <View>
              <View>
                <Text>DRAW</Text>
              </View>
              <ParticipantDetails name={report.P1.name} points={report.P1.points} />
              <ParticipantDetails name={report.P2.name} points={report.P2.points} />
            </View>
          ))
      }

    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
  }
});
