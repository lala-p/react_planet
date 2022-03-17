import produce from 'immer'

import * as commandAction from '../actions/command'

const initialStates = {
    sendCommandList: [],
    next: false,
    runCommandData: {
        commandType: undefined,
        parameter: undefined,
        say: false,
        at: '',
    },
    commandCounter: {
        now: 0,
        today: 0,

        ping: 0,

        // get
        'get+week': 0,
        'get+textlist': 0,

        // load
        'load+text': 0,

        // set
        'set+mode': 0,

        // save
        save: 0,
        'save+as': 0,

        'use+text': 0,

        // sort
        'sort+memo': 0,

        // show
        'show+title': 0,
        'show+use+text': 0,

        // rename
        'rename+text+title': 0,
    },
}

const isCommand = (command) => {
    let commandType = command.match(/[a-zA-z\.+\?+]+|\(.+\)/g)
    let parameter = []

    const pr = /^\(.*\)$/g
    if (pr.test(commandType[commandType.length - 1])) {
        parameter = commandType.pop()
        parameter = parameter.replace(/\(|\)/g, '')
        parameter = parameter.split(/,/g)
    }

    for (let index = 0; index < parameter.length; index++) {
        parameter[index] = parameter[index].trim()
    }

    commandType = commandType.join('+')

    if (commandType in initialStates['commandCounter']) {
        return { commandType: commandType, parameter: parameter }
    } else {
        return false
    }
}

const reducers = (state = initialStates, actions) => {
    switch (actions.type) {
        case commandAction.SEND_COMMAND: {
            return produce(state, (draft) => {
                if (draft.sendCommandList.length == 0) {
                    draft.next = true
                }

                const command = actions.payload1.length != 0 ? isCommand(actions.payload1) : false

                if (command != false) {
                    draft.sendCommandList.push({
                        commandType: command['commandType'],
                        parameter: command['parameter'],
                        say: actions.payload2,
                        at: new Date(),
                    })
                }
            })
        }
        case commandAction.SHIFT_SEND_COMMAND_LIST: {
            return produce(state, (draft) => {
                draft.sendCommandList.shift()
            })
        }
        case commandAction.SET_NEXT: {
            return produce(state, (draft) => {
                draft.next = actions.payload
            })
        }
        case commandAction.RUN_COMMAND: {
            return produce(state, (draft) => {
                draft.runCommandData['commandType'] = actions.payload1
                draft.runCommandData['parameter'] = actions.payload2
                draft.runCommandData['say'] = actions.payload3
                draft.runCommandData['at'] = new Date()
            })
        }
        case commandAction.COUNT_COMMAND: {
            return produce(state, (draft) => {
                draft.commandCounter[actions.payload] += 1
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
