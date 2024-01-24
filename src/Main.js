import * as React from 'react';
import { AppRegistry } from 'react-native';
import {
  PaperProvider,
  MD3LightTheme as DefaultTheme
} from 'react-native-paper';
import { name as appName } from './app.json';
import App from './App';

import light from './themes/redAndBlue/light.json'

const theme = {
  ...DefaultTheme,
  colors: light.colors,
};

export default function Main() {
  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
