import { Vibration } from "react-native";

import vibrationMap from "../domain/vibrationMap";

export default class Vibrations {
  static byPoints(points) {
    switch (points) {
      case 2:
        Vibration.vibrate(vibrationMap["two"]);
        break;
      case 3:
        Vibration.vibrate(vibrationMap["three"]);
        break;
      case 4:
        Vibration.vibrate(vibrationMap["four"]);
        break;
    }
  }

  static endGame() {
    Vibration.vibrate(vibrationMap["endGame"]);
  }

  static vibrateDefault() {
    Vibration.vibrate(vibrationMap["default"]);
  }

  static advantage() {
    Vibration.vibrate(vibrationMap["adv"]);
  }

  static penalty() {
    Vibration.vibrate(vibrationMap["pnlt"]);
  }

  static undo() {
    Vibration.vibrate(vibrationMap["undo"]);
  }

  static playPause() {
    Vibration.vibrate(vibrationMap["playPause"]);
  }

  static finish() {
    Vibration.vibrate(vibrationMap["finish"]);
  }
}
