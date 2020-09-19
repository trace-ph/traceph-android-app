import 'react-native-gesture-handler';
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import {FxProvider} from './FxContext';

const HigherApp = () => (
  <FxProvider>
    <App />
  </FxProvider>
);

AppRegistry.registerComponent(appName, () => HigherApp);
