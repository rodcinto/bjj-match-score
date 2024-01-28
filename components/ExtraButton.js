import { StyleSheet, View } from "react-native";
import { Badge, Button } from "react-native-paper";

export default function ExtraButton({
  amount,
  labelText,
  badgeStyles,
  onPress,
}) {
  return (
    <View style={styles.extraWrapper}>
      {amount > 0 ? <Badge style={badgeStyles}>{amount}</Badge> : <></>}
      <Button mode="elevated" style={styles.btnExtra} onPress={onPress}>
        {labelText}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  extraWrapper: {},
  btnExtra: {
    width: 80,
    margin: 4,
    zIndex: 1,
  },
});
