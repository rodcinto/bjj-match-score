import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { IconButton } from 'react-native-paper';

import Vibrations from "./Vibrations";

export default function PlayPause({onPress, canStart, isMatchOn}) {
  const [isPlaying, setPlaying] = useState(false);

  const handlePress = () => {
    setPlaying(!isPlaying);
    Vibrations.playPause();
    onPress();
  }

  useEffect(() => {
    setPlaying(isMatchOn);
  }, [isMatchOn]);

  return (
    <IconButton
      mode="contained"
      icon={isPlaying ? "pause" : "play"}
      onPress={handlePress}
      disabled={!canStart}
      style={styles.playPauseBtn}
    />
  );
}

const styles = StyleSheet.create({
  playPauseBtn: {
    width: 60,
    height: 60,
    marginTop: 20,
  },
});
