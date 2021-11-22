import { combineReducers } from "redux";

import mainText from './mainText';
import astronaut from './astronaut';
import message from './message';
import mode from './mode';
import memo from './memo';

const rootReducer = combineReducers({
    mainText,
    astronaut,
    message,
    mode,
    memo,
    
});


export default rootReducer;