import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import reducer from './app/reducers/reducers';
import bgMessaging from './app/Utils/bgMessaging';
import messaging from '@react-native-firebase/messaging';
import {Notifications} from "react-native-notifications";
import DBManager from "./app/Utils/DBManager";

const store = createStore(reducer);

console.disableYellowBox = true;

const AppContainer = () =>
    <Provider
      store={store}>
      <App/>
    </Provider>
;

// Register background handler
messaging().setBackgroundMessageHandler(async message => {
  const notification =Notifications.postLocalNotification({
    body:DBManager.toArabicNumbers(message.data.body),
    title: 'جلسه جدید!',

  });
});
AppRegistry.registerComponent(appName, () => AppContainer);
// AppRegistry.registerHeadlessTask('ReactNativeFirebaseMessagingService', () => bgMessaging);

//react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/