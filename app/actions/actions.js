export const counterAdd = () => {
  return {
    type: 'ADD'
  }
};

export const counterSub = () => {
  return {
    type: 'SUB'
  }
};

export const navSendCode = () => {
  return {
    type: 'navSendCode'
  }
};

export const setURI = (x, y) => {
  return {
    type: 'setURI',
    x: x,
    y: y
  }
};

export const setEvents = (shamsiEvents, hijriEvents, shamsiDayOff, hijriDayOff) => {
  return {
    type: 'setEvents',
    shamsiEvents: shamsiEvents,
    hijriEvents: hijriEvents,
    shamsiDayOff: shamsiDayOff,
    hijriDayOff: hijriDayOff
  }
};

export const setValues = (mobile, code) => {
  return {
    type: 'SET',
    mobile: mobile,
    code: code
  }
};
