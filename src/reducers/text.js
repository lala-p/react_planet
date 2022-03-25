import produce from 'immer'

import * as textAction from '../actions/text'

const initialStates = {
	boardText: false,
	savedBoradText: false,
	currentTextTitle: '',
	saveAt: false,
	boardFontSize: 14,
	textTitleList: [],
}

const reducers = (state = initialStates, actions) => {
	switch (actions.type) {
		case textAction.SET_BOARD_TEXT: {
			return produce(state, draft => {
				draft.boardText = actions.payload
			})
		}
		case textAction.SET_CURRENT_TEXT_TITLE: {
			return produce(state, draft => {
				draft.currentTextTitle = actions.payload
			})
		}
		case textAction.SET_SAVE_AT: {
			return produce(state, draft => {
				draft.saveAt = actions.payload
			})
		}
		case textAction.SET_TEXT_TITLE_LIST: {
			return produce(state, draft => {
				draft.textTitleList = actions.payload
			})
		}
		case textAction.SET_BOARD_FONT_SIZE: {
			return produce(state, draft => {
				draft.boardFontSize = actions.payload
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
