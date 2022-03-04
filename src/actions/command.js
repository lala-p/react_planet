export const SEND_COMMAND  = 'SEND_COMMAND';
export const RUN_COMMAND   = 'RUN_COMMAND';
export const COUNT_COMMAND = 'COUNT_COMMAND';

export const sendCommand = (command, say) => {
    return {
        type: SEND_COMMAND,
        payload1: command,
        payload2: new Date(),
        payload3: say,
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

export const countCommand = (commandType) => {
    return {
        type: COUNT_COMMAND,
        payload: commandType
    }
}