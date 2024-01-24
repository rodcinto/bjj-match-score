import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';
import { PaperProvider, Card, Text, FAB, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import CountDownTimer from './components/CountDownTimer';
import FinishButton from './components/FinishButton';
import Participant from './components/Participant';
import PlayPause from './components/PlayPause';
import Vibrations from './components/Vibrations';
import EndModal from './screens/EndModal';
import NewMatchDialog from './screens/NewMatchDialog';
import light from './themes/redAndBlue/light.json'
import Pile from './utils/Pile';
import calculatePoints from './utils/calculatePoints';
import chooseWinner from './utils/chooseWinner';

const theme = {
  ...DefaultTheme,
  colors: light.colors,
};

const bgImage = require('./assets/web_bg.png');

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
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
      <View style={styles.container}>
        <ImageBackground source={bgImage} resizeMode="cover" style={styles.background} imageStyle={styles.bgImage}>
          <View style={styles.header}>
            <Text variant='displaySmall' style={styles.headlineText}>BJJ Match Score</Text>
            <CountDownTimer play={isMatchOn} ref={countDownTimerRef} isMatchOn={isMatchOn} onFinish={finishMatch} />
          </View>
          <View style={styles.participantsContainer}>
            <Card style={styles.participantCard}>
              <Participant
                key="P1"
                corner="BLUE"
                ref={p1Ref}
                pointsPile={p1Points.current}
                onNameChange={setP1Name}
                isMatchOn={isMatchOn}
              />
            </Card>
            <Card style={styles.participantCard}>
              <Participant
                key="P2"
                corner="RED"
                ref={p2Ref}
                pointsPile={p2Points.current}
                onNameChange={setP2Name}
                isMatchOn={isMatchOn}
              />
            </Card>
          </View>
          <View style={styles.controlButtons}>
            <PlayPause onPress={togglePlayPause} canStart={canStart} isMatchOn={isMatchOn} />
            <FinishButton onLongPress={finishMatch} canFinish={canStart} />
          </View>
        </ImageBackground>

        <StatusBar style="auto" />
      </View>

      <FAB
        icon="restart"
        style={styles.fab}
        onPress={newMatchPress}
      />

      <EndModal visible={finishModalVisible} onDismiss={hideFinishModal} report={report} />
      <NewMatchDialog
        visible={newMatchDialogVisible}
        hideDialog={hideNewMatchDialog}
        confirm={newMatchConfirmed}
      />
      </PaperProvider>
    </SafeAreaProvider>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    // backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginTop: 50,
  },
  headlineText: {
    color: 'white',
    marginTop: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.90)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  participantsContainer: {
    flexDirection: 'row',
  },
  participantCard: {
    width: '48%',
    margin: 3,
    opacity: 0.9,
  },
  controlButtons: {
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
