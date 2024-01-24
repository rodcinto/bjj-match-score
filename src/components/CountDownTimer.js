// import { useRef, useState, useEffect } from 'react';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import CountDown from 'react-native-countdown-component';
import { Button } from 'react-native-paper';

import Vibrations from './Vibrations';

function generateTimerId() {
  return `timer_id_${Date.now()}`;
}

function CountDownTimer(props, ref) {
  const [timerId, setTimerId] = useState('initial_id');
  const [until, setUntil] = useState(300);

  const SECONDS_ALPHA = 30;

  const increaseTime = function() {
    if ((until + SECONDS_ALPHA) <= 600) {
      setUntil(until + SECONDS_ALPHA);
      Vibrations.vibrateDefault();
    }
  }
  const decreaseTime = function() {
    if ((until - SECONDS_ALPHA) >= 60) {
      setUntil(until - SECONDS_ALPHA);
      Vibrations.vibrateDefault();
    }
  }

  useImperativeHandle(ref, () => {
    return {
      resetTimer: () => {
        setTimerId(generateTimerId());
      }
    };
  });

  useEffect(() => {
    if(timerId === 'initial_id' && until === 300) {
      // Skip page load.
      return;
    }

    setTimerId(generateTimerId());
  }, [until]);

  return (
      <View style={styles.container}>
        <CountDown
          id={timerId}
          until={until}
          size={50}
          onFinish={props.onFinish}
          digitStyle={{backgroundColor: '#FFF'}}
          digitTxtStyle={{color: 'crimson'}}
          separatorStyle={{color: 'crimson'}}
          timeToShow={['M', 'S']}
          timeLabels={{m: '', s: ''}}
          showSeparator
          running={props.play}
        />
        <View style={styles.btnContainer}>
          <Button
            mode="outlined"
            style={styles.btn}
            icon="plus"
            onPress={increaseTime}
            disabled={props.isMatchOn}
          />
          <Button
            mode="outlined"
            style={styles.btn}
            icon="minus"
            onPress={decreaseTime}
            disabled={props.isMatchOn}
          />
        </View>
      </View>
  );
}

export default forwardRef(CountDownTimer)

const styles = StyleSheet.create({
  container: {
    height: 180,
  },
  btnContainer: {
    flexDirection: 'row',
    alignSelf: 'center'
  },
  btn: {
    width: 65,
    paddingLeft: 15,
    marginHorizontal: 15,
  },
});
