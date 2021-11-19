export const SET_WEEK_BOX_LINE_UP = 'SET_WEEK_BOX_LINE_UP';
export const SET_MEMO_BOX_LINE_UP = 'SET_MEMO_BOX_LINE_UP';
export const SET_MEMO_BOX_REVERSE = 'SET_MEMO_BOX_REVERSE';


export const setWeekBoxLineUp = (lineUpCode) => {
    return {
        type: SET_WEEK_BOX_LINE_UP,
        payload: lineUpCode,
    }
};

export const setMemoBoxLineUp = (lineUpCode) => {
    return {
        type: SET_MEMO_BOX_LINE_UP,
        payload: lineUpCode,
    }
};

export const setMemoBoxReverse = (reverse) => {
    return {
        type: SET_MEMO_BOX_REVERSE,
        payload: reverse,
    }
};