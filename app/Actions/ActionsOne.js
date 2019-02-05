export const counterAdd = () => {
    return {
        type : 'ADD'
    }
};

export const counterSub = () => {
    return {
        type : 'SUB'
    }
};

export const navSendCode = () => {
    return {
        type : 'navSendCode'
    }
};

export const setValues = (mobile, code) => {
    return {
        type: 'SET',
        mobile: mobile,
        code: code
    }
};
