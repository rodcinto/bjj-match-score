const vibrationMap = [];
const DEFAULT = [0, 100];

// Alphabetic order, please :)
vibrationMap["adv"] = [0, 200];
vibrationMap["default"] = DEFAULT;
vibrationMap["endGame"] = [0, 200, 70, 200, 50, 100];
vibrationMap["finish"] = [0, 100, 50, 200];
vibrationMap["four"] = [0, 100, 50, 100, 50, 100, 50, 100];
vibrationMap["matchEnd"] = [0, 100, 50, 200];
vibrationMap["playPause"] = DEFAULT;
vibrationMap["pnlt"] = [0, 100, 50, 100, 50, 200];
vibrationMap["three"] = [0, 100, 50, 100, 50, 100];
vibrationMap["two"] = [0, 100, 50, 100];
vibrationMap["undo"] = DEFAULT;

export default vibrationMap;
