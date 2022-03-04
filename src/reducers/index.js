import { combineReducers } from "redux";

import mainText from './mainText';
import astronaut from './astronaut';
import message from './message';
import mode from './mode';
import memo from './memo';
import command from './command';

const rootReducer = combineReducers({
    mainText,
    astronaut,
    message,
    mode,
    memo,
    command,
});


export default rootReducer;