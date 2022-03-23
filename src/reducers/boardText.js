import produce from 'immer'

import * as boardTextAction from '../actions/boardText'

const initialStates = {
	boardText: false,
	currentTextTitle: '',
	saveAt: false,
	textTitleList: [],
	boardFontSize: 14,
}

const reducers = (state = initialStates, actions) => {
	switch (actions.type) {
		case boardTextAction.SET_BOARD_TEXT: {
			return produce(state, draft => {
				draft.boardText = actions.payload
			})
		}
		case boardTextAction.SET_CURRENT_TEXT_TITLE: {
			return produce(state, draft => {
				draft.currentTextTitle = actions.payload
			})
		}
		case boardTextAction.SET_SAVE_AT: {
			return produce(state, draft => {
				draft.saveAt = actions.payload
			})
		}
		case boardTextAction.SET_TEXT_TITLE_LIST: {
			return produce(state, draft => {
				draft.textTitleList = actions.payload
			})
		}
		case boardTextAction.SET_BOARD_FONT_SIZE: {
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
