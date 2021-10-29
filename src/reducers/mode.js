import produce from 'immer';

import * as modeAction from '../actions/mode';


const initialStates = {

    mode: [
        'board', 
        'MemoTable', 
        'help',
    ],
    currentMode: 0,

}


const reducers = (state = initialStates, actions) => {

    switch (actions.type) {
        case modeAction.SET_MODE: {
            return produce(state, draft => {
                draft.currentMode = actions.payload;
            })
        }
        case modeAction.RANGE_CONTROL: {
            return produce(state, draft => {
                if (draft.currentMode + actions.payload >= 0 && draft.currentMode + actions.payload < draft.mode.length) {
                    draft.currentMode += actions.payload;
                } else {

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