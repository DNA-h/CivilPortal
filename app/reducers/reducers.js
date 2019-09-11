//const initial =
import {NavigationActions} from 'react-navigation';

const initialState = {
    currentMobile: '',
    currentCode: '',
    count: 0
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case 'ADD':
            return Object.assign({}, state, {
                count: state.count + 1
            });
        case 'SUB':
            return Object.assign({}, state, {
                count: state.count - 1
            });
        case 'SET':
            return Object.assign({}, state, {
                currentCode: action.code,
                currentMobile: action.mobile
            });
        case 'navSendCode':
            NavigationActions.navigate({routeName: 'SendCode'});
            return state;
        default:
            return state;
    }
}
