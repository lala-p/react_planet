export const SET_CURRENT_MODE = 'SET_CURRENT_MODE'
export const MOVE_CURRENT_MODE = 'MOVE_CURRENT_MODE'

export const setCurrentMode = mode => {
	return {
		type: SET_CURRENT_MODE,
		payload: mode,
	}
}

export const moveCurrentMode = move => {
	return {
		type: MOVE_CURRENT_MODE,
		payload: move,
	}
}
