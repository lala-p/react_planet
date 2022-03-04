export const SET_MODE = 'SET_MODE';
export const RANGE_CONTROL = 'RANGE_CONTROL';


export const setMode = (currentMode) => {
    return {
        type: SET_MODE,
        payload: currentMode,
    }
};

export const rangeControl = (num) => {
    return {
        type: RANGE_CONTROL,
        payload: num,
    }
};


