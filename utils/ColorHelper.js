import {
  BLUE_CARD_BG_COLOR,
  BLUE_CORNER_BG_COLOR,
  BLUE_CORNER_TXT_COLOR,
  RED_CARD_BG_COLOR,
  RED_CORNER_BG_COLOR,
  RED_CORNER_TXT_COLOR,
} from "../constants/colors";

export default class ColorHelper {
  static defineNameColor(corner) {
    return corner === "BLUE" ? BLUE_CORNER_TXT_COLOR : RED_CORNER_TXT_COLOR;
  }

  static defineBgColorByWinner(winner) {
    if (!winner) {
      return "white";
    }

    return winner.corner === "BLUE"
      ? BLUE_CORNER_BG_COLOR
      : RED_CORNER_BG_COLOR;
  }

  static defineCardBgColor(corner) {
    return corner === "BLUE" ? BLUE_CARD_BG_COLOR : RED_CARD_BG_COLOR;
  }
}
