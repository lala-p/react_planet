export const SET_BOARD_TEXT = 'SET_BOARD_TEXT'
export const SET_CURRENT_TEXT_TITLE = 'SET_TEXT_TITLE'
export const SET_SAVE_AT = 'SET_SAVE_AT'
export const SET_BOARD_FONT_SIZE = 'SET_BOARD_FONT_SIZE'
export const GET_BOARD_TEXT = 'GET_BOARD_TEXT'
export const SET_TEXT_TITLE_LIST = 'SET_TEXT_TITLE_LIST'

export const setBoardText = text => {
	return {
		type: SET_BOARD_TEXT,
		payload: text,
	}
}

export const setCurrentTextTitle = title => {
	return {
		type: SET_CURRENT_TEXT_TITLE,
		payload: title,
	}
}

export const setSaveAt = time => {
	return {
		type: SET_SAVE_AT,
		payload: time,
	}
}

export const setBoardFontSize = size => {
	return {
		type: SET_BOARD_FONT_SIZE,
		payload: size,
	}
}

export const getBoardText = () => {
	return {
		type: GET_BOARD_TEXT,
	}
}

export const setTextTitleList = titleList => {
	return {
		type: SET_TEXT_TITLE_LIST,
		payload: titleList,
	}
}
