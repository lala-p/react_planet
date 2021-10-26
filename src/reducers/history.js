import produce from 'immer';

import * as historyAction from '../actions/history';


const initialStates = {

    msgHistory: [],
    guideScript: [],
    guideTempo: 250,

}


const reducers = (state = initialStates, actions) => {
    switch (actions.type) {
        case historyAction.ADD_MSG_HISTORY: {
            return produce(state, draft => {
                draft.msgHistory.push(actions.payload)
            })
        }
        case historyAction.CLEAR_MSG_HISTORY: {
            return produce(state, draft => {
                draft.msgHistory = []
            })
        }
        case historyAction.SET_GUIDE_SCRIPT: {
            return produce(state, draft => {                
                draft.guideScript = actions.payload
            })
        }
        case historyAction.SHIFT_GUIDE_SCRIPT: {
            return produce(state, draft => {                
                draft.guideScript.shift()
            })
        }
        case historyAction.SET_GUIDE_TEMPO: {
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