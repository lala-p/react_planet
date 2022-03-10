import produce from 'immer';

import * as memoAction from '../actions/memo';


const initialStates = {

    memoText: '',
    memoDataList: [],
    sortedMemoDataList: [],
    sortMode: {
        week: {sort: 0, reverse: false},
        day: {sort: 0, reverse: false},
    },

}

const reducers = (state = initialStates, actions) => {

    switch (actions.type) {
        case memoAction.SET_MEMO_TEXT: {
            return produce(state, draft =>{
                draft.memoText = actions.payload
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