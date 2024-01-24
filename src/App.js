import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, Text, FAB } from 'react-native-paper';

import CountDownTimer from './components/CountDownTimer';
import FinishButton from './components/FinishButton';
import Participant from './components/Participant';
import PlayPause from './components/PlayPause';
import Vibrations from './components/Vibrations';
import EndModal from './screens/EndModal';
import NewMatchDialog from './screens/NewMatchDialog';
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
  const p1Ref = useRef();
  const p2Ref = useRef();

  const [isMatchOn, setMatchOn] = useState(false);

  const [report, setReport] = useState({});

  const [finishModalVisible, setFinishModalVisible] = useState(false);
  const showFinishModal = () => setFinishModalVisible(true);
  const hideFinishModal = () => setFinishModalVisible(false);

  const [newMatchDialogVisible, setNewMatchDialogVisible] = useState(false);

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

   const newMatchPress = () => {
    if (
      isMatchOn ||
      p1Name !== '' ||
      p2Name !== '' ||
      p1Points.current.size() > 0 ||
      p2Points.current.size() > 0
    ) {
      setNewMatchDialogVisible(true);
    }
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

    setP1Name('');
    setP2Name('');

    p1Ref.current.resetParticipant();
    p2Ref.current.resetParticipant();

    countDownTimerRef.current.resetTimer();

    setMatchOn(false);
   };

   useEffect(() => {
    setCanStart(p1Name.length > 0 && p2Name.length > 0 && p1Name !== p2Name);
   }, [p1Name, p2Name]);

  return (
    <>
      <View style={styles.container}>
        <Text variant='displaySmall' style={styles.headlineText}>BJJ Match Score</Text>
        <CountDownTimer play={isMatchOn} ref={countDownTimerRef} isMatchOn={isMatchOn} onFinish={finishMatch} />
        <Divider />
        <View style={styles.participantsContainer}>
          <Participant key="P1" ref={p1Ref} pointsPile={p1Points.current} onNameChange={setP1Name} isMatchOn={isMatchOn} />
          <Participant key="P2" ref={p2Ref} pointsPile={p2Points.current} onNameChange={setP2Name} isMatchOn={isMatchOn} />
        </View>
        <Divider />
        <PlayPause onPress={togglePlayPause} canStart={canStart} isMatchOn={isMatchOn} />
        <FinishButton onLongPress={finishMatch} canFinish={canStart} />

        <StatusBar style="auto" />
      </View>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={newMatchPress}
      />

      <EndModal visible={finishModalVisible} onDismiss={hideFinishModal} report={report} />
      <NewMatchDialog
        visible={newMatchDialogVisible}
        hideDialog={hideNewMatchDialog}
        confirm={newMatchConfirmed}
      />
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
