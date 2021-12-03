import produce from 'immer';

import * as commandAction from '../actions/command';


const initialStates = {

    sendCommand: {
        command: undefined,
        when   : "",
        say    : false,
    },
    runCommandData: {
        commandType: undefined,
        parameter  : undefined,
        say        : false,
    },
    commandCounter: {

        'haha': 0,
        'hi': 0,
        'hello': 0,

        'now': 0,
        'today': 0,
        
        'ping': 0,
        'update': 0,

        // get
        'get+week' : 0,
        'get+text' : 0,

        // set
        'set+mode' : 0,
        
        // save
        'save+text' : 0,
        
        // random
        'random+meal' : 0,
        
        // show
        'show+meal_menu' : 0,
        'show+test' : 0,
        
        // add
        'add+meal_menu' : 0,
        
        // delete
        'delete+meal_menu' : 0,
        
    }, 

}

const reducers = (state = initialStates, actions) => {    
    switch (actions.type) {
        case commandAction.SEND_COMMAND: {
            return produce(state, draft => {
                draft.sendCommand['command'] = actions.payload1
                draft.sendCommand['when']    = actions.payload2
                draft.sendCommand['say']     = actions.payload3
            })
        }
        case commandAction.RUN_COMMAND: {
            return produce(state, draft => {
                draft.runCommandData['commandType'] = actions.payload1
                draft.runCommandData['parameter']   = actions.payload2
                draft.runCommandData['say']         = actions.payload3
            })
        }
        case commandAction.COUNT_COMMAND: {
            return produce(state, draft => {
                draft.commandCounter[actions.payload] += 1
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
