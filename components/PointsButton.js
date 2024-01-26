import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper'

export default function PointsButton({ labelText, onPress }) {
  return (
    <Button
        mode="elevated"
        style={styles.btnPoint}
        onPress={onPress}
      >
        {labelText}
      </Button>
  );
}

const styles = StyleSheet.create({
  btnPoint: {
    width: 20,
    margin: 4,
  },
});
