import produce from 'immer';
import _ from 'lodash';

import * as modeAction from '../actions/mode';


const initialStates = {

    mode: {
        'board'    : 0,
        'memoTable': 1,
        'textTable': 2,
        'help'     : 3,
    },
    currentMode: 0,

}


const reducers = (state = initialStates, actions) => {

    switch (actions.type) {
        case modeAction.SET_MODE: {
            return produce(state, draft => {
                if (actions.payload in draft.mode) {
                    draft.currentMode = draft.mode[actions.payload]
                }
            })
        }
        case modeAction.MOVE_CURRENT_MODE: {
            return produce(state, draft => {
                let afterMoved = draft.currentMode + actions.payload
                if (Object.values(draft.mode).includes(afterMoved)) {
                    draft.currentMode += actions.payload
                }
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