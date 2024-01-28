import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import CountDown from "react-native-countdown-component";
import { Button } from "react-native-paper";

import Vibrations from "./Vibrations";
import {
  TIMER_ID,
  TIMER_INITIAL_SECONDS,
  TIMER_MAX_LIMIT,
  TIMER_MIN_LIMIT,
  TIMER_SECONDS_ALPHA,
} from "../constants/application";

// Generates a unique timer ID based on the current timestamp.
const generateTimerId = () => `${TIMER_ID}_${Date.now()}`;

const CountDownTimer = ({ isMatchOn, play, onFinish, reset }) => {
  const [timerId, setTimerId] = useState(TIMER_ID);
  const [seconds, setSeconds] = useState(TIMER_INITIAL_SECONDS);

  const increaseTime = () => {
    if (seconds + TIMER_SECONDS_ALPHA <= TIMER_MAX_LIMIT) {
      Vibrations.vibrateDefault();
      setSeconds(seconds + TIMER_SECONDS_ALPHA);
    }
  };

  const decreaseTime = () => {
    if (seconds - TIMER_SECONDS_ALPHA >= TIMER_MIN_LIMIT) {
      Vibrations.vibrateDefault();
      setSeconds(seconds - TIMER_SECONDS_ALPHA);
    }
  };

  useEffect(() => {
    if (timerId === TIMER_ID && seconds === TIMER_INITIAL_SECONDS) {
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
        timeToShow={["M", "S"]}
        timeLabels={{ m: "", s: "" }}
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
};

export default CountDownTimer;

const styles = StyleSheet.create({
  container: {
    height: 150,
    paddingTop: 20,
    marginBottom: 10,
  },
  digitStyle: {
    backgroundColor: "white",
    height: 80,
  },
  digitTxtStyle: {
    color: "crimson",
  },
  separatorStyle: {
    color: "crimson",
  },
  btnContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 10,
  },
  btn: {
    width: 65,
    paddingLeft: 15,
    marginHorizontal: 4,
  },
});
