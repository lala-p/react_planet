export const SET_MAIN_TEXT                = 'SET_MAIN_TEXT';
export const SET_SAVE_TIME                = 'SET_SAVE_TIME';
export const SET_UPDATE_TIME              = 'SET_UPDATE_TIME';
export const SET_TEXT_LENGTH              = 'SET_TEXT_LENGTH';
export const SET_REMOVE_SPACE_TEXT_LENGTH = 'SET_REMOVE_SPACE_TEXT_LENGTH'; 


export const setMainText = (text) => {
    return {
        type: SET_MAIN_TEXT,
        payload: text,
    }
};

export const setSaveTime = (time) => {
    return {
        type: SET_SAVE_TIME,
        payload: time,
    }
};

export const setUpdateTime = (time) => {
    return {
        type: SET_UPDATE_TIME,
        payload: time,
    }
};

export const setTextLength = (length) => {
    return {
        type: SET_TEXT_LENGTH,
        payload: length,
    }    
};

export const setRemoveSpaceTextLength = (length) => {
    return {
        type: SET_REMOVE_SPACE_TEXT_LENGTH,
        payload: length,
    }    
};