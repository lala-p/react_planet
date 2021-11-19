import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';

import axios from 'axios';
import random from 'random';

import * as mainTextAction from '../actions/mainText';
import * as astronautAction from '../actions/astronaut';
import * as historyAction from '../actions/history';
import * as modeAction from '../actions/mode';
import { useHotkeys } from 'react-hotkeys-hook';

const MainCommandTable = () => {

    const dispatch = useDispatch();
    const mainText = useSelector((state) => state.mainText.mainText);
    
    const astronautId       = useSelector((state) => state.astronaut.astronautId)
    const astronautNickname = useSelector((state) => state.astronaut.astronautNickname)
    const astronautPassword = useSelector((state) => state.astronaut.astronautPassword)
    const mealMenu          = useSelector((state) => state.astronaut.mealMenu)
    const week              = useSelector((state) => state.astronaut.week)

    const msgHistory  = useSelector((state) => state.history.msgHistory)
    const guideScript = useSelector((state) => state.history.guideScript)
    const guideTempo  = useSelector((state) => state.history.guideTempo)

    const mode = useSelector((state) => state.mode.mode)

    const [cookie, setCookie, removeCookie] = useCookies()    

    const tableRef = useRef(null)    
    const inputRef = useRef(null)
    const [userInput, setUserInput] = useState("")
    const [loading, setLoading] = useState(true)
    const [readOnly, setReadOnly] = useState(false)

    const [cmdHistory, setCmdHistory] = useState([])
    const [cmdAddr, setCmdAddr] = useState(-100)
    
    const [cmdScript, setCmdScript] = useState({})

    // ===================================================
    // 문자열 길이만큼 특정문자로 채우기
    const wordFill = (str, len, word) => {

        let returnWord = str;

        for (let index = str.length; index < len; index++) {
            returnWord = word + returnWord;
        }

        return returnWord;
    }
    // ===================================================
    // 서버 연결 확인하기
    const ping = useCallback(
        () => {

            setReadOnly(true)
            
            let url = "http://localhost:3001/";
    
            axios
                .get(url)
                .then((response) => {
                    console.log(response.data)
                    dispatch(historyAction.addMsgHistory('gu:connect'))
                })
                .catch((error) => {
                    console.log(error)
                    dispatch(historyAction.addMsgHistory('gu:connect failed'))
                })
                .finally(() => {
                    setLoading(false)
                    setReadOnly(false)
                })

            return undefined;
        }, [msgHistory]
    )
    // ===================================================
    // axios post => server cosmic_dust/planet 덮어씌우기
    const save = useCallback(
        () => {

            setReadOnly(true)
            dispatch(historyAction.addMsgHistory('gu:Saving...'))

            let url = "http://localhost:3001/main/saveText";

            const textBox = {
                text: mainText,
            }

            axios
                .post(url, textBox)
                .then((response) => {
                    console.log("저장 완료!@!");
                    dispatch(historyAction.addMsgHistory('gu:Save Completed.'))
                })
                .catch((error) => {
                    console.log(error)
                    dispatch(historyAction.addMsgHistory('gu:Save failed.'))
                })
                .finally(() => {
                    setReadOnly(false)
                })

            return undefined;
        }, [msgHistory]
    )
    // ===================================================
    // axios get => return server cosmic_dust/planet
    const getMainText = useCallback(
        () => {

            setReadOnly(true)
            dispatch(historyAction.addMsgHistory('gu:loading...'))

            let url = "http://localhost:3001/main/getText";

            axios
                .get(url)
                .then((response) => {

                    console.log(response.data)
                    dispatch(mainTextAction.setMainText(response.data))
                    dispatch(historyAction.addMsgHistory('gu:!@!@!@!@!@!'))
                })
                .catch((error) => {
                    console.log(error)
                    dispatch(historyAction.addMsgHistory('gu:failed'))
                })
                .finally(() => {
                    setReadOnly(false)
                })

            return undefined;
        }, [msgHistory]
    )

    // ===================================================
    // mainContent에 있는 component 바꾸기/ mode 바꾸기
    const setMode = useCallback(
        (changeMode) => {

            let notExist = true;

            for (let index = 0; index < mode.length; index++) {
                if (changeMode[0] == mode[index]) {
                    dispatch(modeAction.setMode(index))
                    notExist = false
                    return undefined;
                }
            }

            if (notExist) {
                const script = [changeMode[0] + ' mode does not exist.']
                return script;
            }
        }, [msgHistory]
    )
    // ===================================================
    // return 현재 시간 
    // ex) PM 02:08:33
    const getNow = useCallback(
        () => {

            let getToday = new Date();

            let hours = getToday.getHours();
            let ampm = hours < 12 ? '  AM' : '  PM';

            hours = hours <= 12 ? hours : hours - 12;
            hours = wordFill(hours.toString(), 2, '0')

            let minutes = wordFill(getToday.getMinutes().toString(), 2, '0');
            let seconds = wordFill(getToday.getSeconds().toString(), 2, '0');

            let now = ampm + "  " + hours + ":" + minutes + ":" + seconds;
            now = [now]

            return now;

        }, [msgHistory]
    )
    // ===================================================
    // return 현재 날짜
    // ex) 2021-08-30 THU
    const getToday = useCallback(
        () => {

            let today = new Date();
            let year = today.getFullYear();
            let month = wordFill((today.getMonth() + 1).toString(), 2, '0');
            let date = wordFill(today.getDate().toString(), 2, '0');
            let day = week[today.getDay()];

            today = year + "-" + month + "-" + date + " " + day;
            today = [today]

            return today;
        }, [msgHistory]
    )
    
    // ===================================================
    // input : get week (year, month, date)
    // return 특적 날짜의 요일 
    // ex) 2021-08-30 was... / THU
    const getWeek = useCallback(
        (that_date) => {

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

            return script;

        }, [msgHistory]
    ) 
    // ===================================================
    // return mealMenu
    const getMealMenu = useCallback(
        () => {

            let script = [];

            for (let index = 0; index < mealMenu.length; index++) {
                script = script.concat('[' + (index + 1) + '] ' + mealMenu[index])
            }

            return script;

        }, [msgHistory]
    )

    // ===================================================
    // return random으로 mealMenu 중 하나를 뽑음
    const randomMeal = useCallback(
        () => {

            const ranInt = random.int(0, mealMenu.length - 1)
            let meal = mealMenu[ranInt]
            meal = [meal]

            return meal;

        }, [msgHistory]
    )

    // ===================================================
    // return meal로 array를 받은 후, mealMenu 요소를 추가함.
    const addMealMenu = useCallback(
        (meal) => {

            dispatch(astronautAction.addMealMenu(meal))
            const script = ['Completed.']

            return script;

        }, [msgHistory]
    )
    // ===================================================
    // return meal로 array를 받은 후, mealMenu 요소를 삭제함.
    const deleteMealMenu = useCallback(
        (meal) => {

            dispatch(astronautAction.deleteMealMenu(meal))
            const script = ['Completed.']

            return script;

        }, [msgHistory]
    )
    // ===================================================
    const commandInit = useCallback(
        () => {

            const script = {}

            script['haha'] = () => ["haha!@!", "hoho", "asdfasdf"]
            script['hi'] = () => [`hi, ${week[2]}`, "nice meet you"]
            script['hello'] = () => ["it's me..."]

            script['now'] = () => getNow()
            script['today'] = () => getToday()

            script['ping'] = () => ping()

            script['get'] = {}
            script['get']['week'] = (that_date) => getWeek(that_date)
            script['get']['text'] = () => getMainText()

            script['set'] = {}
            script['set']['mode'] = (mode) => setMode(mode)

            script['save'] = {}
            script['save']['text'] = () => save()

            script['random'] = {}
            script['random']['meal'] = () => randomMeal()

            script['show'] = {}
            script['show']['meal_menu'] = () => getMealMenu()
            script['show']['test'] = (haha) => haha;

            script['add'] = {}
            script['add']['meal_menu'] = (meal) => addMealMenu(meal)

            script['delete'] = {}
            script['delete']['meal_menu'] = (meal) => deleteMealMenu(meal)


            setCmdScript(script)

        }, [msgHistory])

    // ===================================================
    const command = useCallback(
        (cmd) => {

            let returnData = null;
            let cmdArr = cmd;

            try {
                if (cmdArr.length == 1) {
                    returnData = cmdScript[cmd[0]]();
                } else {
                    returnData = cmdScript[cmd[0]];
                    // console.log("cmd : " + cmd)
                    const pr = /^\(.*\)$/g;

                    for (let index = 1; index < cmdArr.length; index++) {
                        if (pr.test(cmdArr[index])) {
                            let prameterArr = cmdArr[index];
                            prameterArr = prameterArr.replace(/\(|\)/g, "")
                            prameterArr = prameterArr.split(/,/g)

                            for (let index = 0; index < prameterArr.length; index++) {
                                prameterArr[index] = prameterArr[index].replace(/^\s+|\s+$/gm, '')
                            }
                            returnData = returnData(prameterArr)
                            return returnData;

                        } else {
                            returnData = returnData[cmdArr[index]]
                        }
                    }

                    returnData = returnData()
                }

            } catch (error) {
                return undefined;
            }

            return returnData;
        }, [msgHistory]
    )
    // ===================================================
    const keyDownHandler = (e) => {
        switch (e.keyCode) {
            case 9: // tab
                e.preventDefault();
                setUserInput(userInput + '\t')
                break;
            case 13: // enter
                if (userInput == "clear") {
                    dispatch(historyAction.clearMsgHistory())
                } else {
                    console.log(userInput)
                    dispatch(historyAction.addMsgHistory('me:' + userInput))

                    const sendCmd = userInput.match(/[a-zA-z\.+\?+]+|\(.+\)/g);
                    const cmd = command(sendCmd)

                    if (cmd !== undefined) {
                        dispatch(historyAction.setGuideScript(cmd))
                    }
                }

                if (userInput.length != 0 && userInput != cmdHistory[cmdHistory.length - 1]) {
                    setCmdHistory(cmdHistory.concat(userInput))
                    setCmdAddr(cmdHistory.length + 1)

                } else {
                    setCmdAddr(cmdHistory.length)
                }

                break;
            case 27: // esc
                inputRef.current.blur()
                break;
            case 38: // arrow up
                if (cmdAddr > 0) {
                    setCmdAddr(cmdAddr - 1)
                }
                break;
            case 40: // arrow down
                if (cmdAddr < cmdHistory.length) {
                    setCmdAddr(cmdAddr + 1)
                }
                break;

            default:

                break;
        }
    }
    // ===================================================
    const guideSay = (say) => {
        setTimeout(() => {
            dispatch(historyAction.addMsgHistory('gu:' + say))
            dispatch(historyAction.shiftGuideScript())
            setReadOnly(false)
        }, guideTempo)
    }

    // ===================================================
    // 단축키 설정 -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    useHotkeys('enter', () => {
        inputRef.current.focus()
    })

    // ===================================================
    // useEffect -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    useEffect(() => {
        ping()
    }, [])

    useEffect(() => {

        if (cmdAddr == cmdHistory.length) {
            setUserInput("")
        } else {
            setUserInput(cmdHistory[cmdAddr])
        }

    }, [cmdAddr])

    useEffect(() => {

        if (guideScript && guideScript.length != 0) {
            guideSay(guideScript[0])
            setReadOnly(true)
        }

    }, [guideScript])

    useEffect(() => {

        commandInit()

        const scroll = tableRef.current.scrollHeight - tableRef.current.clientHeight;
        tableRef.current.scrollTo(0, scroll)
        setUserInput("")

    }, [msgHistory])


    const msgList = msgHistory.map((msg, index) => (
        <div> {msg.substr(0, 3) === 'me:' ? 
            <div key={index} style={{minHeight: '25px', overflow: "hidden", wordBreak: "break-all", backgroundColor: "pink"}}>&lt;{cookie['astronaut_id']}&gt; {msg.substr(3)}</div> :
            <div dangerouslySetInnerHTML={{__html: msg.substr(3)}} key={index} style={{minHeight: '25px',overflow: "hidden", wordBreak: "break-all", backgroundColor: "pink"}}></div> } 
        </div>
    ))

    return(

        <div>
            
            <div ref={tableRef} style={{display: "flex", width: "320px", height: "550px", backgroundColor: "coral", overflow: "auto", flexDirection: "column-reverse"}}>
            {loading ? 
                <div>
                    Loading....
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />            
                </div>                    
                :
                <div>
                    {msgList}
                </div>
                
            }
     
            </div>
            {/* {readOnly ? 
                <input ref={inputRef} type="text" style={{width: "310px", height: "30px"}} value={userInput} readOnly />
                :
                <input ref={inputRef} type="text" style={{width: "310px", height: "30px"}} onKeyDown={keyDownHandler} value={userInput} onChange={(e)=> setUserInput(e.target.value)} readOnly={readOnly ? readOnly : null} />
            } */}

            <input ref={inputRef} type="text" style={{width: "310px", height: "25px"}} onKeyDown={keyDownHandler} value={userInput} onChange={(e)=> setUserInput(e.target.value)} readOnly={readOnly ? readOnly : null} />

            {readOnly ? 
                <div>readOnly true</div>    
            :
                <div>readOnly false</div>
            }       
        </div>
    )

}

export default MainCommandTable;