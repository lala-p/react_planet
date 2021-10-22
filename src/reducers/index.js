import { combineReducers } from "redux";

import mainText from './mainText';
import astronaut from './astronaut';

const rootReducer = combineReducers({
    mainText,
    astronaut,

});


export default rootReducer;