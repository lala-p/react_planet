import produce from 'immer';

import * as mainTextAction from '../actions/mainText';


const initialStates = {

    mainText: "",
    time: false, 
    connect: "",
}


const reducers = (state = initialStates, actions) => {
    
    switch (actions.type) {
        case mainTextAction.SET_MAIN_TEXT: {
            return produce(state, draft => {
                draft.mainText = actions.payload;
            });

        }

        case mainTextAction.CHECK_CONNECT: {
            return produce(state, draft => {
                draft.time = actions.time;
                draft.connect = actions.connect;
            });
        }
            
        default: {
            return {
                ...state
            }
        }
    }



}

export default reducers; 