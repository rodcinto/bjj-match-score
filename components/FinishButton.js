import { useState } from "react";
import { StyleSheet } from "react-native";
import { Button, Text, Snackbar } from "react-native-paper";

const FinishButton = (props) => {
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const handlePress = () => {
    props.onLongPress();
  };

  const handleSimplePress = () => {
    setSnackbarVisible(true);
  };

  const hideSnackbar = () => {
    setSnackbarVisible(false);
  };

  return (
    <>
      <Button
        mode="elevated"
        icon="flag-checkered"
        onLongPress={handlePress}
        onPress={handleSimplePress}
        disabled={!props.canFinish}
        style={styles.finishBtn}
      >
        <Text variant="titleMedium">Finish</Text>
      </Button>
      <Snackbar
        duration={1000}
        visible={snackbarVisible}
        onDismiss={hideSnackbar}
        style={styles.snackbar}
        action={{
          label: "OK",
          onPress: hideSnackbar,
        }}
      >
        Long press to finish.
      </Snackbar>
    </>
  );
};

export default FinishButton;

const styles = StyleSheet.create({
  finishBtn: {
    marginTop: 5,
    width: "55%",
  },
  finishBtnTxt: {},
  snackbar: {
    zIndex: 1,
  },
});
