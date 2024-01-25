import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import CountDown from 'react-native-countdown-component';
import { Button } from 'react-native-paper';

import Vibrations from './Vibrations';

function generateTimerId() {
  return `timer_id_${Date.now()}`;
}

function CountDownTimer({ isMatchOn, play, onFinish, reset }) {
  const [timerId, setTimerId] = useState('initial_id');
  const [seconds, setSeconds] = useState(300);

  const SECONDS_ALPHA = 30;

  const increaseTime = function() {
    if ((seconds + SECONDS_ALPHA) <= 600) {
      Vibrations.vibrateDefault();
      setSeconds(seconds + SECONDS_ALPHA);
    }
  }

  const decreaseTime = function() {
    if ((seconds - SECONDS_ALPHA) >= 30) {
      Vibrations.vibrateDefault();
      setSeconds(seconds - SECONDS_ALPHA);
    }
  }

  useEffect(() => {
    if(timerId === 'initial_id' && seconds === 300) {
      // Skip page load.
      return;
    }

    setTimerId(generateTimerId());
  }, [seconds, reset]);

  return (
      <View style={styles.container}>
        <CountDown
          id={timerId}
          until={seconds}
          size={50}
          onFinish={onFinish}
          digitStyle={styles.digitStyle}
          digitTxtStyle={styles.digitTxtStyle}
          separatorStyle={styles.separatorStyle}
          timeToShow={['M', 'S']}
          timeLabels={{m: '', s: ''}}
          showSeparator
          running={play}
        />
        <View style={styles.btnContainer}>
          <Button
            mode="elevated"
            style={styles.btn}
            icon="plus"
            onPress={increaseTime}
            disabled={isMatchOn}
          />
          <Button
            mode="elevated"
            style={styles.btn}
            icon="minus"
            onPress={decreaseTime}
            disabled={isMatchOn}
          />
        </View>
      </View>
  );
}

export default CountDownTimer

const styles = StyleSheet.create({
  container: {
    height: 150,
    paddingTop: 20,
    marginBottom: 10,
  },
  digitStyle: {
    backgroundColor: 'white',
    height: 80,
  },
  digitTxtStyle: {
    color: 'crimson',
  },
  separatorStyle: {
    color: 'crimson',
  },
  btnContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 10,
  },
  btn: {
    width: 65,
    paddingLeft: 15,
    marginHorizontal: 4,
  },
});
