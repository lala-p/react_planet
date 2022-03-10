export const SET_MEMO_TEXT             = 'SET_MEMO_TEXT';
export const SET_USE_MEMO_TEXT_LIST    = 'SET_USE_MEMO_TEXT_LIST';
export const SET_MEMO_DATA_LIST        = 'SET_MEMO_DATA';
export const SET_SORTED_MEMO_DATA_LIST = 'SET_SORTED_MEMO_DATA';
export const SET_SORT_MODE             = 'SET_SORT_MODE';


export const setMemoText = (text) => {
    return {
        type: SET_MEMO_TEXT,
        payload: text,
    }
}

export const setUseMemoTextList = (textList) => {
    return {
        type: SET_USE_MEMO_TEXT_LIST,
        payload: textList,
    }
}

export const setMemoDataList = (dataList) => {
    return {
        type: SET_MEMO_DATA_LIST,
        payload: dataList,
    }
}

export const setSortedMemoDataList = (dataList) => {
    return {
        type: SET_SORTED_MEMO_DATA_LIST,
        payload: dataList,
    }
}

export const setSortMode = (mode) => {
    return {
        type: SET_SORT_MODE,
        payload: mode,
    }
}