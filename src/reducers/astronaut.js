import produce from 'immer';

import * as astronautAction from '../actions/astronaut';

const initialStates = {

    astronautNickname: "",
    weekFormat: { 0: 'SUN', 1: 'MON', 2: 'TUE', 3: 'WED', 4: 'THU', 5: 'FRI', 6: 'SAT' },

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