import produce from 'immer';

import * as astronautAction from '../actions/astronaut';


const initialStates = {

    astronautId       : "",
    astronautNickname : "",
    astronautPassword : "",
    mealMenu          : ['김밥', '하하'],
    week              : ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
    oneWeek           : {1: false, 2: false, 3: false, 4: false, 5: false},

}


const reducers = (state = initialStates, actions) => {    
    switch (actions.type) {
        case astronautAction.SET_ASTRONAUT_ID: {
            return produce(state, draft => {
                draft.astronautId = actions.payload;
            })
        }
        case astronautAction.SET_ASTRONAUT_NICKNAME: {
            return produce(state, draft => {
                draft.astronautNickname = actions.payload;
            })
        }
        case astronautAction.SET_ASTRONAUT_PASSWORD: {
            return produce(state, draft => {
                draft.astronautPassword = actions.payload;
            })
        }
        case astronautAction.SET_MEALMENU: {
            return produce(state, draft => {
                draft.mealMenu = actions.payload;
            })
        }
        case astronautAction.ADD_MEALMENU: {
            return produce(state, draft => {
                draft.mealMenu = draft.mealMenu.concat(actions.payload)
            })
        }
        case astronautAction.DELETE_MEALMENU: {
            return produce(state, draft => {

            let menu = draft.mealMenu

            for (let index = 0; index < actions.payload.length; index++) {
                menu.splice(menu.indexOf(actions.payload[index]), 1)
            }
            
            draft.mealMenu = menu
            })
        }
        case astronautAction.SET_ONE_WEEK: {
            return produce(state, draft => {
                draft.oneWeek = actions.payload
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