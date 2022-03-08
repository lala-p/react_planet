import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';

import * as mainTextAction from '../actions/mainText';
import * as messageAction from '../actions/message';
import * as commandAction from '../actions/command';
import * as modeAction from '../actions/mode';

import { serverConnect } from '../api/etcApi';
import * as textApi from '../api/textApi';


const CommandEvent = () => {

    const dispatch = useDispatch()

    const textTitle = useSelector((state) => state.mainText.textTitle)

    const sendCommand     = useSelector((state) => state.command.sendCommand)
    const sendCommandList = useSelector((state) => state.command.sendCommandList)
    const runCommandData  = useSelector((state) => state.command.runCommandData)
    const commandCounter  = useSelector((state) => state.command.commandCounter)

    const normalTempo = useSelector((state) => state.message.normalTempo) 

    const week = useSelector((state) => state.astronaut.week)

    const mode = useSelector((state) => state.mode.mode)


    const [cookies, setCookie, removeCookie] = useCookies()    

    const [commandList, setCommandList] = useState({})

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
            serverConnect(
                (response) => {
                    let script = [
                        { say: 'connect', tempo: 0 },
                    ]
                    dispatch(messageAction.setGuideScript(script))
                    console.log(response.data)
                },
                (error) => {
                    let script = [
                        { say: 'connect failed', tempo: 0 },
                    ]
                    dispatch(messageAction.setGuideScript(script))
                    console.log(error)
                },
                false
            )

        }, [commandCounter['ping']]
    )
    // ===================================================
    // axios post 
    const loadTextCmd = useCallback(
        () => {
            
            let script = [
                { say: 'loading...', tempo: 0 },
            ]
            dispatch(messageAction.setGuideScript(script))
            dispatch(mainTextAction.setMainText('loading...'))


            const loadTextTitle = runCommandData['parameter'].length != 0 ? runCommandData['parameter'][0] : 'current'   
        
            const dataContainer = {
                userId   : cookies['user_id'],
                textTitle: loadTextTitle,
            }

            textApi.getTextByTextTitle(
                dataContainer,
                (response) => {
                    console.log(response.data)
                    const text = response.data[0]['text_content']
                    
                    dispatch(mainTextAction.setMainText(text))
                    dispatch(mainTextAction.setTextTitle(loadTextTitle))
                    let script = [
                        { say: '!@!@!@!@!@!@!@!@!@!', tempo: 0 },
                    ]
                    if (runCommandData['say']) {
                        dispatch(messageAction.setGuideScript(script))
                    }  
                },
                (error) => {
                    console.log(error)
                    let script = [
                        { say: 'failed', tempo: 0 },
                    ]
                    dispatch(messageAction.setGuideScript(script))
                    
                },
                false
            )

            console.log(dataContainer)
            console.log(runCommandData)
        }, [commandCounter['load+text']]
    )
    // ===================================================
    // 
    const getTextListCmd = useCallback(
        () => {

            const dataContainer = {
                userId: cookies['user_id'],
            }
    
            textApi.getTextList(
                dataContainer,
                (response) => {
                    dispatch(mainTextAction.setTextList(response.data))
                    let script = [
                        { say: 'Completed', tempo: 0 },
                        { say: '!@!!@!@!@21', tempo: normalTempo },
                    ]
                    dispatch(messageAction.setGuideScript(script))
                },
                (error) => {
                    console.log(error)
                    let script = [
                        { say: 'failed', tempo: 0 },
                        { say: '!@!!@!@!@21', tempo: normalTempo },
                    ]
                    dispatch(messageAction.setGuideScript(script))
                },
                false
            )

        }, [commandCounter['get+textlist']]
    )
    // ===================================================
    // 
    const saveTextCmd = useCallback(
        () => {
            dispatch(mainTextAction.setSaveAt(new Date()))
        }, [commandCounter['save+text']]
    )
    // ===================================================
    // 
    const saveAsCmd = useCallback(
        () => {
            if (runCommandData['parameter'][0] == 'current') {
                let script = [
                    { say: '\'current\' not allowed', tempo: normalTempo },
                ]
                dispatch(messageAction.setGuideScript(script))
    
                
            } else if (textTitle != 'current') {
                let script = [
                    { say: 'lt\'s not current.', tempo: normalTempo },
                ]
                dispatch(messageAction.setGuideScript(script))
                
            } else {
                dispatch(mainTextAction.setSaveAt(new Date()))
            }

        }, [commandCounter['save+as']]
    )
    // ===================================================
    // 
    const renameTextTitleCmd = useCallback(
        () => {
            let textTitle    = runCommandData['parameter'][0]
            let newTextTitle = runCommandData['parameter'][1]

            if (textTitle == 'current' || newTextTitle == 'current') {
                let script = [
                    { say: 'current', tempo: normalTempo },
                    { say: 'not', tempo: normalTempo },
                    { say: 'allowed.', tempo: normalTempo }, 
                ]

                dispatch(messageAction.setGuideScript(script))
            } else {

                const dataContainer = {
                    userId       : cookies['user_id'],
                    textTitle    : textTitle,
                    newTextTitle : newTextTitle,
                }

                textApi.renameTextTitle(
                    dataContainer,
                    (response) => {
                        let script = [
                            { say: 'Completed', tempo: 0 },
                        ]
                        dispatch(messageAction.setGuideScript(script))
                        dispatch(commandAction.sendCommand('get textlist', false))
                    },
                    (error) => {
                        console.log(error)
                        let script = [
                            { say: 'failed', tempo: 0 },
                        ]
                        dispatch(messageAction.setGuideScript(script))
                    },
                    false
                )
            }

        }, [commandCounter['rename+text+title']]
    )
    // ===================================================
    // 
    const showTitleCmd = useCallback(
        () => {
            const script = [
                { say: textTitle, tempo: normalTempo },
            ]
            dispatch(messageAction.setGuideScript(script))
        }, [commandCounter['show+text+title']]
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
                    { say: changeMode + ' mode does not exist.', tempo: normalTempo }, 
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
                { say: now, tempo: normalTempo }, 
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
                { say: today, tempo: normalTempo }, 
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
            script[1] = { say: week[that_day.getDay()], tempo: normalTempo }

            const now = new Date()


            if (now.getFullYear() <= that_day.getFullYear() && now.getMonth() <= that_day.getMonth() && now.getDate() < that_day.getDate()) {
                script[0] = { say: `${year}-${month}-${date} is...`, tempo: normalTempo } 

            } else if (now.getFullYear() === that_day.getFullYear() && now.getMonth() === that_day.getMonth() && now.getDate() === that_day.getDate()) {
                script[0] = { say: `${year}-${month}-${date} today is...`, tempo: normalTempo }

            } else if (that_day.getFullYear() < 0) {
                script[0] =  { say: `B.C. &nbsp;${wordFill(Math.abs(that_day.getFullYear()).toString(), 4, '0')}-${month}-${date} was...`, tempo: normalTempo }

            } else {
                script[0] = { say: `${year}-${month}-${date} was...`, tempo: normalTempo }
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

        commandType = commandType.join('+')

        if (commandType in commandCounter) {
            return { 'commandType': commandType, 'parameter': parameter}        
        } else {
            return false;
        
        }
    }

    useEffect(() => {
        if (sendCommandList.length != 0) {
            dispatch(commandAction.sendCommand(sendCommandList[0]['command'], sendCommandList[0]['say']))
            console.log(sendCommandList[0])
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
                case 'save+text': saveTextCmd()
                    break;
                case 'save+as': saveAsCmd()
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