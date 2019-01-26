//const initial =
import {NavigationActions} from 'react-navigation';

export default function reducer(state = 2, action) {
    switch (action.type) {
        case 'ADD':
            return state + 1;
        case 'SUB':
            return state - 1;
        case 'navSendCode':
            console.log('we are inside reducer');
            NavigationActions.navigate({routeName: 'SendCode'});
            return state;
        default:
            return state;
    }
}