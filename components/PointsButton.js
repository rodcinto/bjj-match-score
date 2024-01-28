import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";

const PointsButton = ({ labelText, onPress }) => {
  return (
    <Button mode="elevated" style={styles.btnPoint} onPress={onPress}>
      {labelText}
    </Button>
  );
};

export default PointsButton;

const styles = StyleSheet.create({
  btnPoint: {
    width: 20,
    margin: 4,
  },
});
