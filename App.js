import React from 'react';
import {StatusBar} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import NavigationService from './app/Service/NavigationService';
import Login from "./app/Login";
import MainPage from "./app/MainPage";
import AddNewSession from "./app/AddNewSession";
import ChoosePeople from "./app/ChoosePeople";
import SessionDetail from "./app/SessionDetail";
import CalendarPage from "./app/CalendarPage";
import AboutUs from "./app/AboutUs";
import SaveAddress from "./app/SaveAddress";
import ShareSession from "./app/ShareSession";
import SaveAddressNew from "./app/SaveAddressNew";
import {Immersive} from 'react-native-immersive'

const RootStack = createStackNavigator(
  {
    Login: {screen: Login, navigationOptions: {header: null}},
    MainPage: {screen: MainPage, navigationOptions: {header: null}},
    AddNewSession: {screen: AddNewSession, navigationOptions: {header: null}},
    ChoosePeople: {screen: ChoosePeople, navigationOptions: {header: null}},
    SessionDetail: {screen: SessionDetail, navigationOptions: {header: null}},
    CalendarPage: {screen: CalendarPage, navigationOptions: {header: null}},
    AboutUs: {screen: AboutUs, navigationOptions: {header: null}},
    Save: {screen: SaveAddress, navigationOptions: {header: null}},
    SaveNew: {screen: SaveAddressNew, navigationOptions: {header: null}},
    Share: {screen: ShareSession, navigationOptions: {header: null}},
  },
  {
    initialRouteName: 'MainPage',
    navigationOptions: {header: null},
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  componentDidMount() {
    Immersive.on();
    Immersive.setImmersive(true);

    const restoreImmersive = () => {
      StatusBar.setHidden(true);
      Immersive.on();
      Immersive.setImmersive(true);
    };
    Immersive.addImmersiveListener(restoreImmersive);
  }

  componentWillUnmount(){
    Immersive.removeImmersiveListener(restoreImmersive);
  }

  render() {
    return (
      <AppContainer
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    );
  }
}
