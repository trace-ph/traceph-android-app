import 'react-native-gesture-handler';
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import {FxProvider} from './FxContext';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0888E2',
    accent: '#D63348',
    background: '#FFFFFF',
  },
};

const HigherApp = () => (
  <PaperProvider theme={theme}>
  <FxProvider>
    <App />
  </FxProvider>
  </PaperProvider>
);

AppRegistry.registerComponent(appName, () => HigherApp);
