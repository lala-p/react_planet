import produce from 'immer'

import * as modeAction from '../actions/mode'

const initialStates = {
	mode: {
		board: 0,
		memoTable: 1,
		textTable: 2,
		help: 3, // help는 무조건 마지막에 두기
	},
	currentMode: 0,
}

const reducers = (state = initialStates, actions) => {
	switch (actions.type) {
		case modeAction.SET_CURRENT_MODE: {
			return produce(state, draft => {
				if (actions.payload in draft.mode) {
					draft.currentMode = draft.mode[actions.payload]
				}
			})
		}
		case modeAction.MOVE_CURRENT_MODE: {
			return produce(state, draft => {
				let afterMoved = draft.currentMode + actions.payload
				if (Object.values(draft.mode).includes(afterMoved)) {
					draft.currentMode += actions.payload
				}
			})
		}

		default: {
			return {
				...state,
			}
		}
	}
}

export default reducers
