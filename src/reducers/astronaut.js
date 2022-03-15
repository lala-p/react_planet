import produce from 'immer';

import * as astronautAction from '../actions/astronaut';

const initialStates = {

    astronautNickname : "",
    weekFormat        : { 0: 'SUN', 1: 'MON', 2: 'TUE', 3: 'WED', 4: 'THU', 5: 'FRI', 6: 'SAT' },
    // workingDays       : { 0: false, 1: true, 2: true, 3: true, 4: true, 5: true, 6: false },

}


const reducers = (state = initialStates, actions) => {    
    switch (actions.type) {
        case astronautAction.SET_ASTRONAUT_NICKNAME: {
            return produce(state, draft => {
                draft.astronautNickname = actions.payload;
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