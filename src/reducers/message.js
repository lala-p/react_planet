import produce from 'immer';

import * as messageAction from '../actions/message';


const initialStates = {

    msgHistory: [],
    guideScript: [],
    guideTempo: 250,

}


const reducers = (state = initialStates, actions) => {
    switch (actions.type) {
        case messageAction.ADD_MSG_HISTORY: {
            return produce(state, draft => {
                draft.msgHistory.push(actions.payload)
            })
        }
        case messageAction.CLEAR_MSG_HISTORY: {
            return produce(state, draft => {
                draft.msgHistory = []
            })
        }
        case messageAction.SET_GUIDE_SCRIPT: {
            return produce(state, draft => {                
                draft.guideScript = actions.payload
            })
        }
        case messageAction.SHIFT_GUIDE_SCRIPT: {
            return produce(state, draft => {                
                draft.guideScript.shift()
            })
        }
        case messageAction.SET_GUIDE_TEMPO: {
            return produce(state, draft => {
                draft.guideTempo = actions.payload
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