import { combineReducers } from "redux";

import mainText from './mainText';
import astronaut from './astronaut';
import history from './history';
import mode from './mode';
import memo from './memo';

const rootReducer = combineReducers({
    mainText,
    astronaut,
    history,
    mode,
    memo,
    
});


export default rootReducer;