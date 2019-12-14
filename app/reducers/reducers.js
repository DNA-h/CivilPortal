//const initial =
import {NavigationActions} from 'react-navigation';

const initialState = {
  currentMobile: '',
  currentCode: '',
  count: 0,
  uri: null,
  x: 0,
  y: 0,
  avatar: 'http://185.211.57.73/static/uploads/4.png'
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
    case 'setURI':
      return Object.assign({}, state, {
        uri: action.uri,
        x: action.x,
        y: action.y
      });
    case 'navSendCode':
      NavigationActions.navigate({routeName: 'SendCode'});
      return state;
    default:
      return state;
  }
}
