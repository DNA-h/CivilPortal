import React from 'react';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import NavigationService from './app/Service/NavigationService';
import Login from "./app/Login";
import SendCode from "./app/SendCode";
import MainPage from "./app/MainPage";
import AddNewSession from "./app/AddNewSession";
import ChoosePeople from "./app/ChoosePeople";
import SessionDetail from "./app/SessionDetail";
import CalendarPage from "./app/CalendarPage";
import AddSessionTitle from "./app/AddSessionTitle";
import AddSessionTime from "./app/AddSessionTime";
const RootStack = createStackNavigator(
    {
        Login: {screen: Login, navigationOptions: {header: null}},
        SendCode: {screen: SendCode, navigationOptions: {header: null}},
        MainPage: {screen: MainPage, navigationOptions: {header: null}},
        AddNewSession: {screen: AddNewSession, navigationOptions: {header: null}},
        AddSessionTitle: {screen: AddSessionTitle, navigationOptions: {header: null}},
        AddSessionTime: {screen: AddSessionTime, navigationOptions: {header: null}},
        ChoosePeople: {screen: ChoosePeople, navigationOptions: {header: null}},
        SessionDetail: {screen: SessionDetail, navigationOptions: {header: null}},
        CalendarPage: {screen: CalendarPage, navigationOptions: {header: null}}
    },
    {
        initialRouteName: 'MainPage',
        navigationOptions: {header: null},
    }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component{
    render(){
        return(
            <AppContainer
                ref={navigatorRef => {
                    NavigationService.setTopLevelNavigator(navigatorRef);
                }}
            />
        );
    }
}
