import produce from 'immer';

import * as mainTextAction from '../actions/mainText';


const initialStates = {

    mainText: false,
    saveTime: false,
    updateTime: false,
    textLength: 0,
    removeSpaceTextLength: 0,
    fontSize: 14,
    weekDataList: [],
    textList: [],
}

const reducers = (state = initialStates, actions) => {
    
    switch (actions.type) {
        case mainTextAction.SET_MAIN_TEXT: {
            return produce(state, draft => {
                draft.mainText = actions.payload
            })
        }
        case mainTextAction.SET_SAVE_TIME: {
            return produce(state, draft => {
                draft.saveTime = actions.payload
            })
        }
        case mainTextAction.SET_UPDATE_TIME: {
            return produce(state, draft => {
                draft.updateTime = actions.payload
            })
        }
        case mainTextAction.SET_TEXT_LENGTH: {
            return produce(state, draft => {
                draft.textLength = actions.payload
            })            
        }
        case mainTextAction.SET_REMOVE_SPACE_TEXT_LENGTH: {
            return produce(state, draft => {
                draft.removeSpaceTextLength = actions.payload
            })            
        }
        case mainTextAction.SET_FONT_SIZE: {
            return produce(state, draft => {
                draft.fontSize = actions.payload
            })            
        }    
        case mainTextAction.SET_WEEK_DATA_LIST: {
            return produce(state, draft => {
                draft.weekDataList = actions.payload
            })            
        }
        case mainTextAction.SET_TEXT_LIST: {
            return produce(state, draft => {
                draft.textList = actions.payload
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