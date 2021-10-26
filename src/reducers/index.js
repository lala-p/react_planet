import { combineReducers } from "redux";

import mainText from './mainText';
import astronaut from './astronaut';
import history from './history';
import mode from './mode';

const rootReducer = combineReducers({
    mainText,
    astronaut,
    history,
    mode,

});


export default rootReducer;