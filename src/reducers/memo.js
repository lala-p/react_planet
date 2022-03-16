import produce from 'immer';

import * as memoAction from '../actions/memo';


const initialStates = {

    useTextList       : [],
    memoDataList      : [],
    sortedMemoDataList: [],
    definedSortMode   : {
        week: { orderBy: ['asc', 'desc']},
        day : { sort: ['normal', 'calendar'], reverse: [true, false] },
    },
    sortMode          : {
        week: { orderBy: 'desc'},
        day : { sort: 'calendar', reverse: false },
    },
    startDay          : 1,
    useDays           : { 0: false, 1: true, 2: true, 3: true, 4: true, 5: true, 6: false },

}

const reducers = (state = initialStates, actions) => {

    switch (actions.type) {
        case memoAction.SET_USE_TEXT_LIST: {
            return produce(state, draft =>{
                draft.useTextList = actions.payload
            })
        }
        case memoAction.SET_MEMO_DATA_LIST: {
            return produce(state, draft => {
                draft.memoDataList = actions.payload
            })
        }
        case memoAction.SET_SORTED_MEMO_DATA_LIST: {
            return produce(state, draft => {
                draft.sortedMemoDataList = actions.payload
            })
        }
        case memoAction.SET_SORT_MODE: {
            return produce(state, draft => {
                draft.sortMode = actions.payload
            })
        }

  
        default: {
            return {
                ...state
            }
        }
    }

}

export default reducers; 