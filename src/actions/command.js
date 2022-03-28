export const SEND_COMMAND = 'SEND_COMMAND'
export const NEXT_COMMAND = 'NEXT_COMMAND'
export const SHIFT_SEND_COMMAND_LIST = 'SHIFT_SEND_COMMAND_LIST'
export const SET_NEXT = 'SET_NEXT'
export const RUN_COMMAND = 'RUN_COMMAND'
export const COUNT_COMMAND = 'COUNT_COMMAND'

export const sendCommand = (command, say) => {
	return {
		type: SEND_COMMAND,
		payload1: command,
		payload2: say,
	}
}

export const nextCommand = commandArr => {
	return {
		type: NEXT_COMMAND,
		payload: commandArr,
	}
}

export const shiftSendCommandList = () => {
	return {
		type: SHIFT_SEND_COMMAND_LIST,
	}
}

export const setNext = next => {
	return {
		type: SET_NEXT,
		payload: next,
	}
}

export const runCommand = (commandType, parameter, say) => {
	return {
		type: RUN_COMMAND,
		payload1: commandType,
		payload2: parameter,
		payload3: say,
	}
}

export const countCommand = commandType => {
	return {
		type: COUNT_COMMAND,
		payload: commandType,
	}
}
