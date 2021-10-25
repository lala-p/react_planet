import { combineReducers } from "redux";

import mainText from './mainText';
import astronaut from './astronaut';
import mode from './mode';

const rootReducer = combineReducers({
    mainText,
    astronaut,
    mode,

});


export default rootReducer;