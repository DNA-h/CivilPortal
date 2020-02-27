import React from 'react';
import {StatusBar} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import NavigationService from './app/service/NavigationService';
import Login from "./app/Modules/Login";
import MainPage from "./app/Modules/MainPage";
import AddNewSession from "./app/Modules/AddNewSession";
import ChoosePeople from "./app/Modules/ChoosePeople";
import CalendarPage from "./app/Modules/Drawer/CalendarPage";
import OnBoarding from "./app/Modules/Drawer/OnBoarding";
import SaveAddress from "./app/Modules/SaveAddress";
import ShareSession from "./app/Modules/ShareSession";
import {Immersive} from 'react-native-immersive'

const RootStack = createStackNavigator(
  {
    Login: {screen: Login, navigationOptions: {header: null}},
    MainPage: {screen: MainPage, navigationOptions: {header: null}},
    AddNewSession: {screen: AddNewSession, navigationOptions: {header: null}},
    ChoosePeople: {screen: ChoosePeople, navigationOptions: {header: null}},
    CalendarPage: {screen: CalendarPage, navigationOptions: {header: null}},
    OnBoarding: {screen: OnBoarding, navigationOptions: {header: null}},
    Save: {screen: SaveAddress, navigationOptions: {header: null}},
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

    this.restoreImmersive = () => {
      StatusBar.setHidden(true);
      Immersive.on();
      Immersive.setImmersive(true);
    };
    Immersive.addImmersiveListener(this.restoreImmersive);
  }

  componentWillUnmount(){
    Immersive.removeImmersiveListener(this.restoreImmersive);
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
