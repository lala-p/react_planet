export const ADD_MSG_HISTORY    = 'ADD_MSG_HISTORY';
export const CLEAR_MSG_HISTORY  = 'CLEAR_MSG_HISTORY';
export const SET_GUIDE_SCRIPT   = 'SET_GUIDE_SCRIPT';
export const SHIFT_GUIDE_SCRIPT = 'SHIFT_GUIDE_SCRIPT'  
export const SET_GUIDE_TEMPO    = 'SET_GUIDE_TEMPO';



export const addMsgHistory = (msg) => {
    return {
        type: ADD_MSG_HISTORY,
        payload: msg,
    }
};

export const clearMsgHistory = () => {
    return {
        type: CLEAR_MSG_HISTORY,
    }
};

export const setGuideScript = (script) => {
    return {
        type: SET_GUIDE_SCRIPT,
        payload: script,
    }
};

export const shiftGuideScript = () => {
    return {
        type: SHIFT_GUIDE_SCRIPT,
    }
}

export const setGuideTempo = (speed) => {
    return {
        type: SET_GUIDE_TEMPO,
        payload: speed,
    }
};

