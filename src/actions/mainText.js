export const SET_MAIN_TEXT = 'SET_MAIN_TEXT';
export const CHECK_CONNECT = 'CHECK_CONNECT';

export const setMainText = (text) => {
    return {
        type: SET_MAIN_TEXT,
        payload: text,
    }  
};

export const checkConnect = (time, connect) => {
    return {
        type: CHECK_CONNECT,
        time: time,
        connect: connect,
    }
}