import produce from 'immer';

import * as memoAction from '../actions/memo';


const initialStates = {

    memoUseTextList   : [],
    memoDataList      : [],
    sortedMemoDataList: [],
    sortMode          : {
        week: {sort: 0, orderBy: 'asc'},
        day : {sort: 'normal', reverse: false},
    },
    useDays           : { 0: false, 1: true, 2: true, 3: true, 4: true, 5: true, 6: false },

}

const reducers = (state = initialStates, actions) => {

    switch (actions.type) {
        case memoAction.SET_MEMO_USE_TEXT_LIST: {
            return produce(state, draft =>{
                draft.memoUseTextList = actions.payload
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