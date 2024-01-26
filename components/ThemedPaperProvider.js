import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { useMemo } from "react";
import { useColorScheme } from 'react-native';
import {
  PaperProvider,
  MD3DarkTheme,
  MD3LightTheme
} from "react-native-paper";

// import md3Colors from "../themes/redAndBlue/theme.json";

export default function ThemedPaperProvider({ children }) {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();

  const paperTheme = useMemo(
    () =>
      colorScheme === 'dark' ?
        {
          ...MD3DarkTheme,
          colors: {
            ...theme.dark,
            // ...md3Colors.schemes.dark
          }
        }
      :
        {
          ...MD3LightTheme,
          colors: {
            ...theme.light,
            // ...md3Colors.schemes.light``
          }
        },
    [colorScheme, theme]
  );
  return (
      <PaperProvider theme={ paperTheme }>
        { children }
      </PaperProvider>
  );
}
