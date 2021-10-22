export const SET_MAIN_TEXT = 'SET_MAIN_TEXT';

export const setMainText = (text) => {
    return {
        type: SET_MAIN_TEXT,
        payload: text,
    }  
};
