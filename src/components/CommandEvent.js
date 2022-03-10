import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';

import * as boardTextAction from '../actions/boardText';
import * as messageAction from '../actions/message';
import * as commandAction from '../actions/command';
import * as modeAction from '../actions/mode';

import { sendAxiosGet, sendAxiosPost } from '../api/sendAxios';

import { SERVER_CONNECT } from "../api/etcApiUrl";
import * as textApi from '../api/textApiUrl';

// import { serverConnect } from '../api/etcApi';
// import * as textApi from '../api/textApi';


const CommandEvent = () => {

    const dispatch = useDispatch()
    const [cookies, setCookie, removeCookie] = useCookies()    

    const sendCommand     = useSelector((state) => state.command.sendCommand)
    const sendCommandList = useSelector((state) => state.command.sendCommandList)
    const runCommandData  = useSelector((state) => state.command.runCommandData)
    const commandCounter  = useSelector((state) => state.command.commandCounter)

    const boardText        = useSelector((state) => state.boardText.boardText)    
    const currentTextTitle = useSelector((state) => state.boardText.currentTextTitle)

    const normalTempo = useSelector((state) => state.message.normalTempo) 

    const week = useSelector((state) => state.astronaut.week)

    const mode = useSelector((state) => state.mode.mode)


    // ===================================================
    const wordFill = (str, len, word) => {

        let returnWord = str;
        for (let index = str.length; index < len; index++) {
            returnWord = word + returnWord;
        }
    
        return returnWord;
    }
    // ===================================================
    // 서버 연결 확인하기
    const pingCmd = useCallback(
        () => {
            
            sendAxiosGet(
                SERVER_CONNECT,
                (response) => {
                    let script = [
                        { say: 'connect', tempo: 0, last: true },
                    ]
                    dispatch(messageAction.setGuideScript(script))
                },
                (error) => {
                    let script = [
                        { say: 'connect failed', tempo: 0, last: true },
                    ]
                    dispatch(messageAction.setGuideScript(script))
                    console.log(error)
                },
                false
            )

            // serverConnect(
            //     (response) => {
            //         let script = [
            //             { say: 'connect', tempo: 0, last: true },
            //         ]
            //         dispatch(messageAction.setGuideScript(script))
            //     },
            //     (error) => {
            //         let script = [
            //             { say: 'connect failed', tempo: 0, last: true },
            //         ]
            //         dispatch(messageAction.setGuideScript(script))
            //         console.log(error)
            //     },
            //     false
            // )

        }, [commandCounter['ping']]
    )
    // ===================================================
    // axios post 
    const loadTextCmd = useCallback(
        () => {
            
            let script = [
                { say: 'loading...', tempo: 600, last: false },
            ]
            dispatch(messageAction.setGuideScript(script))


            const loadTextTitle = runCommandData['parameter'].length != 0 ? runCommandData['parameter'][0] : 'current'   
        
            const dataContainer = {
                userId   : cookies['user_id'],
                textTitle: loadTextTitle,
            }

            sendAxiosPost(
                textApi.GET_TEXT_BY_TEXT_TITLE,
                dataContainer,
                (response) => {
                    const text = response.data[0]['text_content']
                    
                    dispatch(boardTextAction.setBoardText(text))
                    dispatch(boardTextAction.setCurrentTextTitle(loadTextTitle))

                    let script = [
                        { say: '!@!@!@!@!@!@!@!@!@!', tempo: 1000, last: true },
                    ]
                    if (runCommandData['say']) {
                        dispatch(messageAction.setGuideScript(script))
                    }  
                },
                (error) => {
                    console.log(error)
                    let script = [
                        { say: 'failed', tempo: 0, last: true },
                    ]
                    dispatch(messageAction.setGuideScript(script))
                    
                },
                false
            )


            // textApi.getTextByTextTitle(
            //     dataContainer,
            //     (response) => {
            //         const text = response.data[0]['text_content']
                    
            //         dispatch(boardTextAction.setBoardText(text))
            //         dispatch(boardTextAction.setCurrentTextTitle(loadTextTitle))

            //         let script = [
            //             { say: '!@!@!@!@!@!@!@!@!@!', tempo: 1000, last: true },
            //         ]
            //         if (runCommandData['say']) {
            //             dispatch(messageAction.setGuideScript(script))
            //         }  
            //     },
            //     (error) => {
            //         console.log(error)
            //         let script = [
            //             { say: 'failed', tempo: 0, last: true },
            //         ]
            //         dispatch(messageAction.setGuideScript(script))
                    
            //     },
            //     false
            // )

        }, [commandCounter['load+text']]
    )
    // ===================================================
    // 
    const getTextListCmd = useCallback(
        () => {

            const dataContainer = {
                userId: cookies['user_id'],
            }
    
            sendAxiosPost(
                textApi.GET_TEXT_TITLE_LIST,
                dataContainer,
                (response) => {
                    dispatch(boardTextAction.setTextTitleList(response.data))
                    let script = [
                        { say: 'Completed', tempo: 0 + 600, last: false },
                        { say: '!@!!@!@!@21', tempo: normalTempo + 600, last: true },
                    ]
                    dispatch(messageAction.setGuideScript(script))
                },
                (error) => {
                    console.log(error)
                    let script = [
                        { say: 'failed', tempo: 0, last: false },
                        { say: '!@!!@!@!@21', tempo: normalTempo, last: true },
                    ]
                    dispatch(messageAction.setGuideScript(script))
                },
                false
            )

            // textApi.getTextList(
            //     dataContainer,
            //     (response) => {
            //         dispatch(boardTextAction.setTextTitleList(response.data))
            //         let script = [
            //             { say: 'Completed', tempo: 0 + 600, last: false },
            //             { say: '!@!!@!@!@21', tempo: normalTempo + 600, last: true },
            //         ]
            //         dispatch(messageAction.setGuideScript(script))
            //     },
            //     (error) => {
            //         console.log(error)
            //         let script = [
            //             { say: 'failed', tempo: 0, last: false },
            //             { say: '!@!!@!@!@21', tempo: normalTempo, last: true },
            //         ]
            //         dispatch(messageAction.setGuideScript(script))
            //     },
            //     false
            // )

        }, [commandCounter['get+textlist']]
    )
    // ===================================================
    // 
    const saveCmd = useCallback(
        () => {
            let script = [
                {say: 'Saving...', tempo: 0, last: false}
            ]
            dispatch(messageAction.setGuideScript(script))


            const dataContainer = {
                userId: cookies['user_id'],
                text: boardText,
                textTitle: currentTextTitle,
            }

            sendAxiosPost(
                textApi.SAVE,
                dataContainer,
                (response) => {
                    let script = [
                        { say: 'Save Completed', tempo: 0, last: true },
                    ]
                    dispatch(messageAction.setGuideScript(script))
                    
                    dispatch(commandAction.sendCommand('get textlist', false))  
                },
                (error) => {
                    let script = [
                        { say: 'Save failed.', tempo: 0, last: true },
                    ]
                    dispatch(messageAction.setGuideScript(script))
                    
                    console.log(error)
                },
                false

            )


            // textApi.saveText(
            //     dataContainer,
            //     (response) => {
            //         let script = [
            //             { say: 'Save Completed', tempo: 0, last: true },
            //         ]
            //         dispatch(messageAction.setGuideScript(script))
                    
            //         dispatch(commandAction.sendCommand('get textlist', false))  
            //     },
            //     (error) => {
            //         let script = [
            //             { say: 'Save failed.', tempo: 0, last: true },
            //         ]
            //         dispatch(messageAction.setGuideScript(script))
                    
            //         console.log(error)
            //     },
            //     false
            // )

        }, [commandCounter['save']]
    )

    // ===================================================
    // 
    const saveAsCmd = useCallback(
        () => {
            if (runCommandData['parameter'][0] == 'current') {
                let script = [
                    { say: '\'current\' not allowed', tempo: normalTempo, last: true },
                ]
                dispatch(messageAction.setGuideScript(script))
    
                
            } else if (currentTextTitle != 'current') {
                let script = [
                    { say: 'lt\'s not current.', tempo: normalTempo, last: true },
                ]
                dispatch(messageAction.setGuideScript(script))
                
            } else {
                const dataContainer = {
                    userId: cookies['user_id'],
                    text: boardText,
                    textTitle: runCommandData['parameter'][0],
                }

                sendAxiosPost(
                    textApi.SAVE_AS,
                    dataContainer,
                    (response) => {
                        let script = [
                            { say: 'Save as Completed.', tempo: 0, last: true},
                        ]
                        dispatch(messageAction.setGuideScript(script))
                        dispatch(commandAction.sendCommand('get textlist', false))
                    },
                    (error) => {
                        let script = [
                            { say: 'Save as failed.', tempo: 0, last: true},
                        ]
                        dispatch(messageAction.setGuideScript(script))
                        console.log(error)
                    },
                    false
                )

                // textApi.saveAsText(
                //     dataContainer,
                //     (response) => {
                //         let script = [
                //             { say: 'Save as Completed.', tempo: 0, last: true},
                //         ]
                //         dispatch(messageAction.setGuideScript(script))
                //         dispatch(commandAction.sendCommand('get textlist', false))
                //     },
                //     (error) => {
                //         let script = [
                //             { say: 'Save as failed.', tempo: 0, last: true},
                //         ]
                //         dispatch(messageAction.setGuideScript(script))
                //         console.log(error)
                //     },
                //     false
                // )
            }

        }, [commandCounter['save+as']]
    )
    // ===================================================
    //
    const useTextCmd = useCallback(
        () => {

            for (let index = 0; index < runCommandData['parameter'].length; index++) {
                
            }

        }, [commandCounter['use+text']]
    )    
    // ===================================================
    //
    const sortMemoCmd = useCallback(
        () => {

        }, [commandCounter['sort+memo']]
    )
    // ===================================================
    // 
    const renameTextTitleCmd = useCallback(
        () => {
            let textTitle    = runCommandData['parameter'][0]
            let newTextTitle = runCommandData['parameter'][1]

            if (textTitle == 'current' || newTextTitle == 'current') {
                let script = [
                    { say: 'current', tempo: normalTempo, last: false },
                    { say: 'not', tempo: normalTempo, last: false },
                    { say: 'allowed.', tempo: normalTempo, last: true }, 
                ]

                dispatch(messageAction.setGuideScript(script))
            } else {

                const dataContainer = {
                    userId       : cookies['user_id'],
                    textTitle    : textTitle,
                    newTextTitle : newTextTitle,
                }


                sendAxiosPost(
                    textApi.RENAME_TEXT_TITLE,
                    dataContainer,
                    (response) => {
                        let script = [
                            { say: 'Completed', tempo: 0, last: true },
                        ]
                        dispatch(messageAction.setGuideScript(script))
                        dispatch(commandAction.sendCommand('get textlist', false))
                    },
                    (error) => {
                        console.log(error)
                        let script = [
                            { say: 'failed', tempo: 0, last: true },
                        ]
                        dispatch(messageAction.setGuideScript(script))
                    },
                    false
                )


                // textApi.renameTextTitle(
                //     dataContainer,
                //     (response) => {
                //         let script = [
                //             { say: 'Completed', tempo: 0, last: true },
                //         ]
                //         dispatch(messageAction.setGuideScript(script))
                //         dispatch(commandAction.sendCommand('get textlist', false))
                //     },
                //     (error) => {
                //         console.log(error)
                //         let script = [
                //             { say: 'failed', tempo: 0, last: true },
                //         ]
                //         dispatch(messageAction.setGuideScript(script))
                //     },
                //     false
                // )
            }

        }, [commandCounter['rename+text+title']]
    )
    // ===================================================
    // 
    const showTitleCmd = useCallback(
        () => {
            const script = [
                { say: currentTextTitle, tempo: normalTempo, last: true },
            ]
            dispatch(messageAction.setGuideScript(script))
        }, [commandCounter['show+title']]
    )
    // ===================================================
    // 
    const showUseTextCmd = useCallback(
        () => {
            
        }, [commandCounter['show+use+text']]
    )
    // ===================================================
    // mainContent에 있는 component 바꾸기/ mode 바꾸기
    const setModeCmd = useCallback(
        () => {

            let notExist = true;
            let changeMode = runCommandData['parameter'][0]

            for (let index = 0; index < mode.length; index++) {
                if (changeMode == mode[index]) {
                    dispatch(modeAction.setMode(index))
                    notExist = false
                }
            }
            
            if (notExist) {
                let script = [
                    { say: changeMode + ' mode does not exist.', tempo: normalTempo, last: true }, 
                ]
                dispatch(messageAction.setGuideScript(script))
            }
        
        }, [commandCounter['set+mode']]
    )
    // ===================================================
    // return 현재 시간 
    // ex) PM 02:08:33
    const nowCmd = useCallback(
        () => {

            let getToday = new Date()

            let hours = getToday.getHours()
            let ampm = hours < 12 ? '  AM' : '  PM'

            hours = hours <= 12 ? hours : hours - 12
            hours = wordFill(hours.toString(), 2, '0')

            let minutes = wordFill(getToday.getMinutes().toString(), 2, '0')
            let seconds = wordFill(getToday.getSeconds().toString(), 2, '0')

            let now = ampm + "  " + hours + ":" + minutes + ":" + seconds
            
            let script = [
                { say: now, tempo: normalTempo, last: true }, 
            ]
            dispatch(messageAction.setGuideScript(script))
        }, [commandCounter['now']]
    )
    // ===================================================
    // return 현재 날짜
    // ex) 2021-08-30 THU
    const todayCmd = useCallback(
        () => {

            let today = new Date()
            let year = today.getFullYear()
            let month = wordFill((today.getMonth() + 1).toString(), 2, '0')
            let date = wordFill(today.getDate().toString(), 2, '0')
            let day = week[today.getDay()]

            today = year + "-" + month + "-" + date + " " + day;
            
            let script = [
                { say: today, tempo: normalTempo, last: true }, 
            ]
            dispatch(messageAction.setGuideScript(script))
        }, [commandCounter['today']]
    )
    // ===================================================
    // input : get week (year, month, date)
    // return 특정 날짜의 요일 
    // ex) 2021-08-30 was... / THU
    const getWeekCmd = useCallback(
        () => {

            let that_date = runCommandData['parameter']
            let year  = that_date[0]
            let month = that_date[1]
            let date  = that_date[2]
            
            const that_day = new Date()
            that_day.setFullYear(year)
            that_day.setMonth(month-1)
            that_day.setDate(date)
            
            year = wordFill(that_day.getFullYear().toString(), 4, '0')
            month = wordFill((that_day.getMonth() + 1).toString(), 2, '0')
            date = wordFill(that_day.getDate().toString(), 2, '0')

            let script = []

            script[0] = {}
            script[1] = { say: week[that_day.getDay()], tempo: normalTempo, last: true }

            const now = new Date()


            if (now.getFullYear() <= that_day.getFullYear() && now.getMonth() <= that_day.getMonth() && now.getDate() < that_day.getDate()) {
                script[0] = { say: `${year}-${month}-${date} is...`, tempo: normalTempo, last: false } 

            } else if (now.getFullYear() === that_day.getFullYear() && now.getMonth() === that_day.getMonth() && now.getDate() === that_day.getDate()) {
                script[0] = { say: `${year}-${month}-${date} today is...`, tempo: normalTempo, last: false }

            } else if (that_day.getFullYear() < 0) {
                script[0] =  { say: `B.C. &nbsp;${wordFill(Math.abs(that_day.getFullYear()).toString(), 4, '0')}-${month}-${date} was...`, tempo: normalTempo, last: false }

            } else {
                script[0] = { say: `${year}-${month}-${date} was...`, tempo: normalTempo, last: false }
            }

            dispatch(messageAction.setGuideScript(script))

        }, [commandCounter['get+week']]
    ) 

    const IsCommand = (command) => {

        let commandType = command.match(/[a-zA-z\.+\?+]+|\(.+\)/g)
        let parameter = []

        const pr = /^\(.*\)$/g;
        if (pr.test(commandType[commandType.length -1])) {
            parameter = commandType.pop()
            parameter = parameter.replace(/\(|\)/g, "")
            parameter = parameter.split(/,/g)
        }

        for (let index = 0; index < parameter.length; index++) {
            parameter[index] = parameter[index].trim() 
        } 

        commandType = commandType.join('+')

        if (commandType in commandCounter) {
            return {'commandType': commandType, 'parameter': parameter}        
        } else {
            return false;
        
        }
    }

    useEffect(() => {
        if (sendCommandList.length != 0) {
            dispatch(commandAction.sendCommand(sendCommandList[0]['command'], sendCommandList[0]['say']))
        }
    }, [sendCommandList])

    useEffect(() => {
        if (sendCommand['command'] != undefined) {
            let send = IsCommand(sendCommand['command'])

            if (send != false) {
                dispatch(commandAction.runCommand(send['commandType'], send['parameter'], sendCommand['say']))
                dispatch(commandAction.countCommand(send['commandType']))
            }
        }

    }, [sendCommand])

    useEffect(() => {
        if (runCommandData['commandType'] != undefined) {
            switch (runCommandData['commandType']) {
                case 'now': nowCmd()
                    break;
                case 'today': todayCmd()
                    break;

                case 'ping': pingCmd()
                    break;

                // get
                case 'get+week': getWeekCmd()
                    break;
                case 'get+textlist': getTextListCmd()
                    break;

                // load 
                case 'load+text': loadTextCmd()
                    break;

                // set
                case 'set+mode': setModeCmd()
                    break;

                // save
                case 'save': saveCmd()
                    break;
                case 'save+as': saveAsCmd()
                    break;

                // sort
                case 'sort+memo': sortMemoCmd()
                    break;

                // show
                case 'show+title': showTitleCmd()
                    break;

                // rename
                case 'rename+text+title': renameTextTitleCmd()
                    break;

                case 'test': 
                    let commandList = []

                    commandList.push({command: 'ping', say: true})
                    commandList.push({command: 'load text', say: true})
                    commandList.push({command: 'get textlist', say: true})

                    dispatch(commandAction.sendCommandList(commandList))
                break;

            }
        }
    }, [commandCounter])

    return <></>
}

export default CommandEvent;