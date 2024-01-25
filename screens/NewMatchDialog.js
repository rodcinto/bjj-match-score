import { Dialog, Text, Button } from "react-native-paper";

export default function NewMatchDialog({ visible, hideDialog, confirm }) {
  return (
    <Dialog visible={visible} onDismiss={hideDialog}>
      <Dialog.Title>New Match</Dialog.Title>
      <Dialog.Content>
        <Text variant="bodyMedium">
          Abondon this match and start a new one?
        </Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={hideDialog}>Cancel</Button>
        <Button onPress={confirm}>Yes!</Button>
      </Dialog.Actions>
    </Dialog>
  );
}
