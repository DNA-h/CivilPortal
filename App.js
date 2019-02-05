import React from 'react';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import NavigationService from './app/Service/NavigationService';
import Login from "./app/Login";
import SendCode from "./app/SendCode";
import MainPage from "./app/MainPage";
import AddNewSession from "./app/AddNewSession";
const RootStack = createStackNavigator(
    {
        Login: {
            screen: Login,
            navigationOptions: {
                header: null
            }
        },
        SendCode: {
            screen: SendCode,
            navigationOptions: {
                header: null
            }
        },
        MainPage: {
            screen: MainPage,
            navigationOptions: {
                header: null
            }
        },
        AddNewSession: {
            screen: AddNewSession,
            navigationOptions: {
                header: null
            }
        }
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
