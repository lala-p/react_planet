export const SET_ASTRONAUT_NICKNAME = 'SET_ASTRONAUT_NICKNAME';
export const SET_WEEK_FORMAT        = 'SET_WEEK_FORMAT';

export const setAstronautNickname = (nickname) => {
    return {
        type: SET_ASTRONAUT_NICKNAME,
        payload: nickname, 
    }
}

export const setWekkFormat = () => {
    return {
        type: SET_WEEK_FORMAT,
    }
}
