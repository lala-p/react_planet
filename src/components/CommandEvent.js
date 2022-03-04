import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';

import * as mainTextAction from '../actions/mainText';
import * as messageAction from '../actions/message';
import * as commandAction from '../actions/command';
import * as modeAction from '../actions/mode';

import { serverConnect } from '../api/etcApi';
import * as textApi from '../api/textApi';

import { wordFill } from "./etc";



const CommandEvent = () => {

    const dispatch = useDispatch()

    const textTitle = useSelector((state) => state.mainText.textTitle)

    const sendCommand    = useSelector((state) => state.command.sendCommand)
    const runCommandData = useSelector((state) => state.command.runCommandData)
    const commandCounter = useSelector((state) => state.command.commandCounter)

    const week = useSelector((state) => state.astronaut.week)

    const mode = useSelector((state) => state.mode.mode)


    const [cookies, setCookie, removeCookie] = useCookies()    

    const [commandList, setCommandList] = useState({})


    // ===================================================
    // 서버 연결 확인하기
    const pingCmd = useCallback(
        () => {

            dispatch(messageAction.setReadOnly(true))
            
            serverConnect(
                (response) => {
                    console.log(response.data)
                    if (runCommandData['say']) {
                        dispatch(messageAction.addMsgHistory('gu:connect'))
                    }
                },
                (error) => {
                    console.log(error)
                    if (runCommandData['say']) {
                        dispatch(messageAction.addMsgHistory('gu:connect failed'))   
                    }
                },
                () => {
                    dispatch(messageAction.setReadOnly(false))
                },
            )

        }, [commandCounter['ping']]
    )
    // ===================================================
    // axios post 
    const loadTextCmd = useCallback(
        () => {
            
            dispatch(messageAction.setReadOnly(true))
            if (runCommandData['say']) {
                dispatch(messageAction.addMsgHistory('gu:loading...'))
            }
            
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
                    if (runCommandData['say']) {
                        dispatch(messageAction.addMsgHistory('gu:!@!@!@!@!@!@!@!@!@!'))
                    }  
                },
                (error) => {
                    console.log(error)
                    if (runCommandData['say']) {
                        dispatch(messageAction.addMsgHistory('gu:failed'))
                    }
                },
                () => {
                    dispatch(messageAction.setReadOnly(false))
                }
            )

            console.log(dataContainer)
            console.log(runCommandData)
        }, [commandCounter['load+text']]
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
                if (runCommandData['say']) {
                    dispatch(messageAction.addMsgHistory('gu:\'current\' not allowed'))
                }
                
            } else if (textTitle != 'current') {
                if (runCommandData['say']) {
                    dispatch(messageAction.addMsgHistory('gu:lt\'s not current.'))
                }
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
                const script = ['current', 'not', 'allowed.']
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
                        if (runCommandData['say']) {
                            dispatch(messageAction.addMsgHistory('Completed'))
                        }
                    },
                    (error) => {
                        console.log(error)
                        if (runCommandData['say']) {
                            dispatch(messageAction.addMsgHistory('gu:failed'))
                        }
                    },
                    () => {
                        dispatch(messageAction.setReadOnly(false))
                    }
                )




            }

        }, [commandCounter['rename+text+title']]
    )
    // ===================================================
    // 
    const showTitleCmd = useCallback(
        () => {
            const script = [textTitle]
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
                const script = [changeMode + ' mode does not exist.']

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
            now = [now]

            
            dispatch(messageAction.setGuideScript(now))
            

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
            today = [today]

            
            dispatch(messageAction.setGuideScript(today))
        
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

            script[0] = ''
            script[1] = week[that_day.getDay()]

            const now = new Date()


            if (now.getFullYear() <= that_day.getFullYear() && now.getMonth() <= that_day.getMonth() && now.getDate() < that_day.getDate()) {
                script[0] = `${year}-${month}-${date} is...`

            } else if (now.getFullYear() === that_day.getFullYear() && now.getMonth() === that_day.getMonth() && now.getDate() === that_day.getDate()) {
                script[0] = `${year}-${month}-${date} today is...`

            } else if (that_day.getFullYear() < 0) {
                script[0] = `B.C. &nbsp;${wordFill(Math.abs(that_day.getFullYear()).toString(), 4, '0')}-${month}-${date} was...`

            } else {
                script[0] = `${year}-${month}-${date} was...`
            }

            dispatch(messageAction.setGuideScript(script))

        }, [commandCounter['get+week']]
    ) 


    const commandInit = useCallback(
        () => {
            let cmdList = {}

            cmdList['haha'] = () => { dispatch(messageAction.setGuideScript(["haha!@!", "hoho", "asdfasdf"])) }
            cmdList['hi'] = () => { dispatch(messageAction.setGuideScript([`hi, ????`, "nice meet you"])) }
            cmdList['hello'] = () => { dispatch(messageAction.setGuideScript(["it's me..."])) }

            cmdList['now']   = nowCmd
            cmdList['today'] = todayCmd

            cmdList['ping']   = pingCmd
            
            // get 
            cmdList['get+week'] = getWeekCmd

            // load
            cmdList['load+text'] = loadTextCmd

            // set
            cmdList['set+mode'] = setModeCmd

            // save
            cmdList['save+text'] = saveTextCmd
            cmdList['save+as'] = saveAsCmd

            // show
            cmdList['show+text+title'] = showTitleCmd

            cmdList['rename+text+title'] = renameTextTitleCmd
            setCommandList(cmdList)

        }, [runCommandData]
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
            commandInit()
            console.log("commandInit")
        }

    }, [commandCounter])


    useEffect(() => {
        if (runCommandData['commandType'] != undefined) {
            commandList[runCommandData['commandType']]()
        }
    }, [commandList])


    return <></>
}

export default CommandEvent;