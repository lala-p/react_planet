import { kebabCase } from 'lodash'

export const SET_USE_TEXT_LIST = 'SET_USE_TEXT_LIST'
export const UPDATE_USE_TEXT_TITLE = 'UPDATE_USE_TEXT_TITLE'
export const SET_SORTED_MEMO_DATA_LIST = 'SET_SORTED_MEMO_DATA'
export const SET_SORT_MODE = 'SET_SORT_MODE'
export const SET_USE_DAYS = 'SET_USE_DAYS'
export const SET_DAY_MEMO_MODAL_OPEN = 'SET_DAY_MEMO_MODAL_OPEN'
export const SET_DAY_MEMO_MODAL_DATA = 'SET_DAY_MEMO_MODAL_DATA'

export const setUseTextList = textList => {
	return {
		type: SET_USE_TEXT_LIST,
		payload: textList,
	}
}

export const updateUseTextTitle = (textTitle, newTextTitle) => {
	return {
		type: UPDATE_USE_TEXT_TITLE,
		payload1: textTitle,
		payload2: newTextTitle,
	}
}

export const setSortedMemoDataList = dataList => {
	return {
		type: SET_SORTED_MEMO_DATA_LIST,
		payload: dataList,
	}
}

export const setSortMode = mode => {
	return {
		type: SET_SORT_MODE,
		payload: mode,
	}
}

export const setUseDays = useDays => {
	return {
		type: SET_USE_DAYS,
		payload: useDays,
	}
}

export const setDayMemoModalOpen = open => {
	return {
		type: SET_DAY_MEMO_MODAL_OPEN,
		payload: open,
	}
}

export const setDayMemoModalData = data => {
	return {
		type: SET_DAY_MEMO_MODAL_DATA,
		payload: data,
	}
}
