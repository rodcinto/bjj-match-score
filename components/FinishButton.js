import { StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";

export default function FinishButton(props) {
  const handlePress = () => {
    props.onLongPress();
  };
  return (
    <Button
      mode="elevated"
      icon="flag-checkered"
      onLongPress={handlePress}
      disabled={!props.canFinish}
      style={styles.finishBtn}
    >
      <Text variant="titleMedium">Finish</Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  finishBtn: {
    marginTop: 5,
    width: "55%",
  },
  finishBtnTxt: {},
});
