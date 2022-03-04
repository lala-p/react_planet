import produce from 'immer';

import * as memoAction from '../actions/memo';


const initialStates = {

    weekBoxLineUp: 0,
    memoBoxLineUp: 0,
    memoBoxReverse: false,

}


const reducers = (state = initialStates, actions) => {

    switch (actions.type) {
        case memoAction.SET_WEEK_BOX_LINE_UP: {
            return produce(state, draft => {
                draft.weekBoxLineUp = actions.payload;
            })
        }
        case memoAction.SET_MEMO_BOX_LINE_UP: {
            return produce(state, draft => {
                draft.memoBoxLineUp = actions.payload;
            })
        }
        case memoAction.SET_MEMO_BOX_REVERSE: {
            return produce(state, draft => {
                draft.memoBoxReverse = actions.payload;
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