import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';

import CountDownTimer from './components/CountDownTimer';
import FinishButton from './components/FinishButton';
import Participant from './components/Participant';
import PlayPause from './components/PlayPause';
import Vibrations from './components/Vibrations';
import EndModal from './screens/EndModal';
import Pile from '../Utils/Pile';
import calculatePoints from '../Utils/calculatePoints';
import chooseWinner from '../Utils/chooseWinner';

export default function App() {
  const countDownTimerRef = useRef();

  const [canStart, setCanStart] = useState(false);
  const [p1Name, setP1Name] = useState('');
  const [p2Name, setP2Name] = useState('');
  const p1Points = useRef(new Pile());
  const p2Points = useRef(new Pile());

  const [isMatchOn, setMatchOn] = useState(false);

  const [report, setReport] = useState({});

  const [finishModalVisible, setFinishModalVisible] = useState(false);
  const showFinishModal = () => setFinishModalVisible(true);
  const hideFinishModal = () => setFinishModalVisible(false);

  const togglePlayPause = () => {
    setMatchOn(!isMatchOn)
  };

  const finishMatch = () => {
    setMatchOn(false);
    countDownTimerRef.current.resetTimer();

    setReport(makeReport());

    Vibrations.finish();

    showFinishModal();
   };

   const makeReport = () => {
    const P1 = {
      key: 'BLUE',
      name: p1Name,
      points: calculatePoints(p1Points.current),
      winner: false,
    };
    const P2 = {
      key: 'RED',
      name: p2Name,
      points: calculatePoints(p2Points.current),
      winner: false,
    };

    return chooseWinner(P1, P2);
   };

   useEffect(() => {
    setCanStart(p1Name.length > 0 && p2Name.length > 0);
   }, [p1Name, p2Name]);

  return (
    <>
      <View style={styles.container}>
        <Text variant='displaySmall' style={styles.headlineText}>BJJ Match Score</Text>
        <CountDownTimer play={isMatchOn} ref={countDownTimerRef} isMatchOn={isMatchOn} onFinish={finishMatch} />
        <Divider />
        <View style={styles.participantsContainer}>
          <Participant key="P1" pointsPile={p1Points.current} onNameChange={setP1Name} isMatchOn={isMatchOn} />
          <Participant key="P2" pointsPile={p2Points.current} onNameChange={setP2Name} isMatchOn={isMatchOn} />
        </View>
        <Divider />
        <PlayPause onPress={togglePlayPause} canStart={canStart} isMatchOn={isMatchOn} />
        <FinishButton onLongPress={finishMatch} canFinish={canStart} />

        <StatusBar style="auto" />
      </View>

      <EndModal visible={finishModalVisible} onDismiss={hideFinishModal} report={report} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  participantsContainer: {
    flexDirection: 'row',
  },
  headlineText: {
    marginTop: 20,
  },
});
