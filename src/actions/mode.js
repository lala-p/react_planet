export const SET_MODE          = 'SET_MODE';
export const MOVE_CURRENT_MODE = 'MOVE_CURRENT_MODE';

export const setMode = (mode) => {
    return {
        type   : SET_MODE,
        payload: mode,
    }
}

export const moveCurrentMode = (move) => {
    return {
        type   : MOVE_CURRENT_MODE,
        payload: move,
    }
}

