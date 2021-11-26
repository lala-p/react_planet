import produce from 'immer';

import * as mainTextAction from '../actions/mainText';


const initialStates = {

    mainText: "",
    updateTime: "",

}


const reducers = (state = initialStates, actions) => {
    
    switch (actions.type) {
        case mainTextAction.SET_MAIN_TEXT: {
            return produce(state, draft => {
                draft.mainText = actions.payload
            })
        }
        case mainTextAction.SET_UPDATE_TIME: {
            return produce(state, draft => {
                draft.updateTime = actions.payload
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