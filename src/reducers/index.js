import { combineReducers } from 'redux'

import text from './text'
import astronaut from './astronaut'
import message from './message'
import mode from './mode'
import memo from './memo'
import command from './command'

const rootReducer = combineReducers({
	text,
	astronaut,
	message,
	mode,
	memo,
	command,
})

export default rootReducer
