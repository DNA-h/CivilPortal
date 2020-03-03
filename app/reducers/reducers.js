//const initial =
import {NavigationActions} from 'react-navigation';

const initialState = {
  currentMobile: '',
  currentCode: '',
  count: 0,
  x: 0,
  y: 0,
  avatar: 'http://185.211.57.73/static/uploads/4.png',
  shamsiEvents: [],
  hijriEvents: [],
  shamsiDayOff: [],
  hijriDayOff: []
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
        x: action.x,
        y: action.y
      });
    case 'setEvents':
      return Object.assign({}, state, {
        shamsiEvents: action.shamsiEvents,
        hijriEvents: action.hijriEvents,
        shamsiDayOff: action.shamsiDayOff,
        hijriDayOff: action.hijriDayOff
      });
    case 'navSendCode':
      NavigationActions.navigate({routeName: 'SendCode'});
      return state;
    default:
      return state;
  }
}
