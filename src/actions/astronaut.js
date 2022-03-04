export const SET_ASTRONAUT_ID       = 'SET_ASTRONAUT_ID';
export const SET_ASTRONAUT_NICKNAME = 'SET_ASTRONAUT_NICKNAME';
export const SET_ASTRONAUT_PASSWORD = 'SET_ASTRONAUT_PASSWORD';
export const SET_MEALMENU           = 'SET_MEALMENU';
export const ADD_MEALMENU           = 'ADD_MEALMENU';
export const DELETE_MEALMENU        = 'DELETE_MEALMENU';
export const SET_ONE_WEEK           = 'SET_ONE_WEEK';

export const setAstronautId = (id) => {
    return {
        type: SET_ASTRONAUT_ID,
        payload: id, 
    }
};

export const setAstronautNickname = (nickname) => {
    return {
        type: SET_ASTRONAUT_NICKNAME,
        payload: nickname, 
    }
};

export const setAstronautPassword = (password) => {
    return {
        type: SET_ASTRONAUT_PASSWORD,
        payload: password, 
    }
};

export const setMealMenu = (menu) => {
    return {
        type: SET_MEALMENU,
        payload: menu, 
    }
};

export const addMealMenu = (menu) => {
    return {
        type: ADD_MEALMENU,
        payload: menu, 
    }
};

export const deleteMealMenu = (menu) => {
    return {
        type: DELETE_MEALMENU,
        payload: menu, 
    }
};

export const setOneWeek = (oneWeek) => {
    return {
        type: SET_ONE_WEEK,
        payload: oneWeek, 
    }
};