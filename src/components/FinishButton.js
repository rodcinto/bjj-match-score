import { StyleSheet } from "react-native";
import { Button, Text } from 'react-native-paper';

export default function FinishButton(props) {
  const handlePress = () => {
    props.onLongPress();
  };
  return (
    <Button onLongPress={handlePress} disabled={!props.canFinish}>
      <Text>Finish</Text>
    </Button>
  );
}

const styles = StyleSheet.create({

});
