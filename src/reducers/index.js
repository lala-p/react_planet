import { combineReducers } from "redux";

import boardText from './boardText';
import astronaut from './astronaut';
import message from './message';
import mode from './mode';
import memo from './memo';
import command from './command';

const rootReducer = combineReducers({
    boardText,
    astronaut,
    message,
    mode,
    memo,
    command,
});


export default rootReducer;