import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import { createStore } from 'redux';
import reducer from './app/Reducers/ReducerOne';

const store = createStore(reducer);

const AppContainer = () =>
    <Provider
        store={store}>
        <App/>
    </Provider>;

AppRegistry.registerComponent(appName, () => AppContainer);

//react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/