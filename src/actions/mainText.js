export const SET_MAIN_TEXT = 'SET_MAIN_TEXT';
export const SET_UPDATE_TIME = 'SET_UPDATE_TIME';

export const setMainText = (text) => {
    return {
        type: SET_MAIN_TEXT,
        payload: text,
    }
};

export const setUpdateTime = (time) => {
    return {
        type: SET_UPDATE_TIME,
        payload: time,
    }
}