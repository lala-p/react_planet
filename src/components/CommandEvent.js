import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';

import * as mainTextAction from '../actions/mainText';
import * as messageAction from '../actions/message';
import * as commandAction from '../actions/command';
import * as modeAction from '../actions/mode';
// import * as astronautAction from '../actions/astronaut';


// import random from "random";

import { serverConnect } from '../api/etcApi';
import * as textApi from '../api/textApi';

import { wordFill } from "./etc";



const CommandEvent = () => {

    const dispatch = useDispatch()

    const textTitle = useSelector((state) => state.mainText.textTitle)

    const sendCommand    = useSelector((state) => state.command.sendCommand)
    const runCommandData = useSelector((state) => state.command.runCommandData)
    const commandCounter = useSelector((state) => state.command.commandCounter)

    // const astronautId       = useSelector((state) => state.astronaut.astronautId)
    // const astronautNickname = useSelector((state) => state.astronaut.astronautNickname)
    // const astronautPassword = useSelector((state) => state.astronaut.astronautPassword)
    // const mealMenu          = useSelector((state) => state.astronaut.mealMenu)
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
                    dispatch(messageAction.addMsgHistory('gu:connect'))
                },
                (error) => {
                    console.log(error)
                    dispatch(messageAction.addMsgHistory('gu:connect failed'))
                },
                () => {
                    dispatch(messageAction.setReadOnly(false))
                },
            )

        }, [commandCounter['ping']]
    )
    // ===================================================
    // axios post
    const getTextCmd = useCallback(
        () => {

            dispatch(messageAction.setReadOnly(true))
            dispatch(messageAction.addMsgHistory('gu:loading...'))
            dispatch(mainTextAction.setMainText('loading...'))

            const dataContainer = {
                userId: cookies['user_id'],
                textTitle: 'current',
            }

            textApi.getTextByTextTitle(
                dataContainer,
                (response) => {
                    console.log(response.data)
                    const text = response.data[0]['text_content']
    
                    dispatch(mainTextAction.setMainText(text))
                    dispatch(mainTextAction.setTextTitle('current'))
                    dispatch(messageAction.addMsgHistory('gu:!@!@!@!@!@!'))
                },
                (error) => {
                    console.log(error)
                    dispatch(messageAction.addMsgHistory('gu:failed'))
                    const sec = new Date().getSeconds().toString()
                    dispatch(mainTextAction.setMainText(sec))

                },
                () => {
                    dispatch(messageAction.setReadOnly(false))
                }
            )

        }, [commandCounter['get+text']]
    )
    // ===================================================
    // axios post 
    const loadTextCmd = useCallback(
        () => {
            
            dispatch(messageAction.setReadOnly(true))
            dispatch(mainTextAction.setMainText('loading...'))

            let loadTextTitle = runCommandData['parameter'][0]   
            
            
            const dataContainer = {
                userId: cookies['user_id'],
                textTitle: loadTextTitle,
            }

            textApi.getTextByTextTitle(
                dataContainer,
                (response) => {
                    console.log(response.data)
                    const text = response.data[0]['text_content']
                    
                    dispatch(mainTextAction.setMainText(text))
                    dispatch(mainTextAction.setTextTitle(loadTextTitle))
                    dispatch(messageAction.addMsgHistory('gu:!@!@!@!@!@!@!@!@!@!'))
                },
                (error) => {
                    console.log(error)
                    dispatch(messageAction.addMsgHistory('gu:failed'))
                },
                () => {
                    dispatch(messageAction.setReadOnly(false))
                }
            )
        }, [commandCounter['load+text']]
    )
    // ===================================================
    // ?????????
    // const updateCmd = useCallback(
    //     () => {
    //         dispatch(mainTextAction.setUpdateTime(new Date()))
    //     }, [commandCounter['update']]
    // )
    // ===================================================
    // axios post
    const saveTextCmd = useCallback(
        () => {
            dispatch(mainTextAction.setSaveTime(new Date()))
        }, [commandCounter['saveText']]
    )
    // ===================================================
    // mainContent에 있는 component 바꾸기/ mode 바꾸기
    const setModeCmd = useCallback(
        () => {

            let notExist = true;
            let changeMode = runCommandData['parameter']

            for (let index = 0; index < mode.length; index++) {
                if (changeMode[0] == mode[index]) {
                    dispatch(modeAction.setMode(index))
                    notExist = false
                }
            }
            
            if (notExist) {
                const script = [changeMode[0] + ' mode does not exist.']

                if (runCommandData['say']) {
                    dispatch(messageAction.setGuideScript(script))
                }

            }
        
        }, [commandCounter['set+mode']]
    )
    // ===================================================
    // say 
    const sayCmd = useCallback(
        () => {
            let userSay = runCommandData['parameter'][0]
            dispatch(messageAction.addMsgHistory('me:' + userSay))
        }, [commandCounter['say']]
    )
    // ===================================================
    // return 현재 시간 
    // ex) PM 02:08:33
    const nowCmd = useCallback(
        () => {

            let getToday = new Date();

            let hours = getToday.getHours();
            let ampm = hours < 12 ? '  AM' : '  PM';

            hours = hours <= 12 ? hours : hours - 12;
            hours = wordFill(hours.toString(), 2, '0')

            let minutes = wordFill(getToday.getMinutes().toString(), 2, '0')
            let seconds = wordFill(getToday.getSeconds().toString(), 2, '0')

            let now = ampm + "  " + hours + ":" + minutes + ":" + seconds;
            now = [now]

            if (runCommandData['say']) {
                dispatch(messageAction.setGuideScript(now))
            }

        }, [commandCounter['now']]
    )
    // ===================================================
    // return 현재 날짜
    // ex) 2021-08-30 THU
    const todayCmd = useCallback(
        () => {

            let today = new Date();
            let year = today.getFullYear();
            let month = wordFill((today.getMonth() + 1).toString(), 2, '0');
            let date = wordFill(today.getDate().toString(), 2, '0');
            let day = week[today.getDay()];

            today = year + "-" + month + "-" + date + " " + day;
            today = [today]

            if (runCommandData['say']) {
                dispatch(messageAction.setGuideScript(today))
            }
        
        }, [commandCounter['today']]
    )
    // ===================================================
    // input : get week (year, month, date)
    // return 특적 날짜의 요일 
    // ex) 2021-08-30 was... / THU
    const getWeekCmd = useCallback(
        () => {

            let that_date = runCommandData['parameter']

            let year  = that_date[0];
            let month = that_date[1];
            let date  = that_date[2];
                
            const that_day = new Date();
            that_day.setFullYear(year)
            that_day.setMonth(month-1)
            that_day.setDate(date)
            
            year = wordFill(that_day.getFullYear().toString(), 4, '0')
            month = wordFill((that_day.getMonth() + 1).toString(), 2, '0')
            date = wordFill(that_day.getDate().toString(), 2, '0')

            let script = [];

            script[0] = ''
            script[1] = week[that_day.getDay()]

            const now = new Date();


            if (now.getFullYear() <= that_day.getFullYear() && now.getMonth() <= that_day.getMonth() && now.getDate() < that_day.getDate()) {
                script[0] = `${year}-${month}-${date} is...`;

            } else if (now.getFullYear() === that_day.getFullYear() && now.getMonth() === that_day.getMonth() && now.getDate() === that_day.getDate()) {
                script[0] = `${year}-${month}-${date} today is...`;

            } else if (that_day.getFullYear() < 0) {
                script[0] = `B.C. &nbsp;${wordFill(Math.abs(that_day.getFullYear()).toString(), 4, '0')}-${month}-${date} was...`;

            } else {
                script[0] = `${year}-${month}-${date} was...`;
            }


            if (runCommandData['say']) {
                dispatch(messageAction.setGuideScript(script))
            }

        }, [commandCounter['get+week']]
    ) 
    // ===================================================
    // return mealMenu
    // const showMealMenuCmd = useCallback(
    //     () => {

    //         let script = [];

    //         for (let index = 0; index < mealMenu.length; index++) {
    //             script = script.concat('[' + (index + 1) + '] ' + mealMenu[index])
    //         }

    //         if (runCommandData['say']) {
    //             dispatch(messageAction.setGuideScript(script))
    //         }


    //     }, [commandCounter['show+meal_menu']]
    // )

    // ===================================================
    // return random으로 mealMenu 중 하나를 뽑음
    // const randomMealCmd = useCallback(
    //     () => {

    //         const ranInt = random.int(0, mealMenu.length - 1)
    //         let meal = mealMenu[ranInt]
    //         meal = [meal]

    //         if (runCommandData['say']) {
    //             dispatch(messageAction.setGuideScript(meal))
    //         }


    //     }, [commandCounter['random+meal']]
    // )

    // ===================================================
    // return meal로 array를 받은 후, mealMenu 요소를 추가함.
    // const addMealMenuCmd = useCallback(
    //     () => {

    //         let meal = runCommandData['parameter']

    //         dispatch(astronautAction.addMealMenu(meal))
    //         const script = ['Completed.']

    //         if (runCommandData['say']) {
    //             dispatch(messageAction.setGuideScript(script))
    //         }

    //     }, [commandCounter['add+meal_menu']]
    // )
    // ===================================================
    // return meal로 array를 받은 후, mealMenu 요소를 삭제함.
    // const deleteMealMenuCmd = useCallback(
    //     () => {
    //         let meal = runCommandData['parameter']
    //         dispatch(astronautAction.deleteMealMenu(meal))
    //         const script = ['Completed.']

    //         if (runCommandData['say']) {
    //             dispatch(messageAction.setGuideScript(script))
    //         }

    //     }, [commandCounter['delete+meal_menu']]
    // )

    const commandInit = useCallback(
        () => {
            let cmdList = {}

            cmdList['haha'] = () => { dispatch(messageAction.setGuideScript(["haha!@!", "hoho", "asdfasdf"])) }
            cmdList['hi'] = () => { dispatch(messageAction.setGuideScript([`hi, ????`, "nice meet you"])) }
            cmdList['hello'] = () => { dispatch(messageAction.setGuideScript(["it's me..."])) }

            cmdList['say'] = sayCmd
            cmdList['now']   = nowCmd
            cmdList['today'] = todayCmd

            cmdList['ping']   = pingCmd
            // cmdList['update'] = updateCmd
            
            // get 
            cmdList['get+week'] = getWeekCmd
            cmdList['get+text'] = getTextCmd

            // load
            cmdList['load+text'] = loadTextCmd

            // set
            cmdList['set+mode'] = setModeCmd

            // save
            cmdList['save+text'] = saveTextCmd

            // random
            // cmdList['random+meal'] = randomMealCmd

            // show
            // cmdList['show+meal_menu'] = showMealMenuCmd
            // cmdList['show+test']      = () => { dispatch(messageAction.setGuideScript(["test!@!@!@!@"])) }

            //add 
            // cmdList['add+meal_menu']  = addMealMenuCmd

            // delete
            // cmdList['delete+meal_menu'] = deleteMealMenuCmd


            setCommandList(cmdList)

        }, [runCommandData]
    )

    

    const IsCommand = (command) => {

        let commandType = command.match(/[a-zA-z\.+\?+]+|\(.+\)/g)
        let parameter = []

        const pr = /^\(.*\)$/g;
        if ( pr.test(commandType[commandType.length -1])) {
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