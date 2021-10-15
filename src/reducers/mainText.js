import * as mainTextAction from '../actions/mainText';


const initialStates = {

    mainText: "asdfasdfasdfasdf123123123123aaaaaaaaabbbbbb",

}


const reducers = (state = initialStates, actions) => {
    const { type } = actions
    
    switch (type) {
        case mainTextAction.SET_MAIN_TEXT: {
            return {
                ...state,
                mainText: actions.payload,
            }
        }
            
        default: {
            return {
                ...state
            }
        }
    }



}

export default reducers; 