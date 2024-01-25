import { PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import MatchScreen from './screens/MatchScreen';
import light from './themes/redAndBlue/light.json'

const theme = {
  ...DefaultTheme,
  colors: light.colors,
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <MatchScreen />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

