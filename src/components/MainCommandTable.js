import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';

import axios from 'axios';
import random from 'random';

import * as mainTextAction from '../actions/mainText';


const MainCommandTable = () => {

    const dispatch = useDispatch();
    const selectMainText    = useSelector((state) => state.mainText.mainText);

    // const astronautId       = useSelector((state) => state.astronaut.astronautId)
    // const astronautNickname = useSelector((state) => state.astronaut.astronautNickname)
    // const astronautPassword = useSelector((state) => state.astronaut.astronautPassword)
    // const mealMenu          = useSelector((state) => state.astronaut.mealMenu)

    // reducers 적용하기

    
    const [mealMenu, setMealMenu] = useState(['11111','222222','33333'])

    const week = useSelector((state) => state.astronaut.week)

    const [cookie, setCookie, removeCookie] = useCookies()    

    const [userInput, setUserInput] = useState("")

    const [msgHistory, setMsgHistory] = useState([])
    const [cmdHistory, setCmdHistory] = useState([])
    const [guideSayArr, setGuideSayArr] = useState([])
    const [cmdAddr, setCmdAddr] = useState(-100)
    
    const tableRef = useRef(null)    

    const [on, setOn] = useState(false)

    const [cmdScript, setCmdScript] = useState({})

    // ===================================================
    // 문자열 길이만큼 특정문자로 채우기
    const wordFill = (str, len, word) => {

        let returnWord = str;

        for (let index = str.length; index < len; index++) {
            returnWord = word+returnWord;
        }

        return returnWord;
    }
    // ===================================================
    // 서버 연결 확인하기
    const ping = () => {

        let url = "http://localhost:3001/";

        axios.get(url)
        .then((response) => {
            console.log(response.data)
            setGuideSayArr(['connect'])
        })
        .catch((error) => {
            console.log(error)
            setGuideSayArr(['connect failed'])
        })
        .finally(() => {
            setOn(true)
        })

        return undefined;
    }
    // ===================================================
    // axios post => server cosmic_dust/planet 덮어씌우기
    const save = () => {

        const script = ['Saveing...'] 

        let url = "http://localhost:3001/main/saveText";

        const textBox = {
            text: selectMainText,
        }

        axios
            .post(url, textBox)
            .then((response) => {
                console.log("저장 완료!@!");
                setGuideSayArr(['Save Completed.'])
            })
            .catch((error) => {
                console.log(error)
                setGuideSayArr(['Save failed.'])
            })

        
        return script;
        
    }
    // ===================================================
    // axios get => return server cosmic_dust/planet
    const getMainText = () => {

        const script = ['loading...'] 

        let url = "http://localhost:3001/main/getText";

        axios.get(url)
        .then((response) => {

            console.log(response.data)
            dispatch(mainTextAction.setMainText(response.data)) 
            setGuideSayArr(['!@!'])
        })
        .catch((error) => {
            console.log(error)
            setGuideSayArr(['failed.'])
        })
        
        return script;
    }
    // ===================================================
    // return 현재 시간 
    // ex) PM 02:08:33
    const getNow = () => {
        
        let getToday = new Date();

        let hours = getToday.getHours();
        let ampm = hours < 12 ? '  AM' : '  PM'; 

        hours = hours <= 12 ? hours : hours-12;
        hours = wordFill(hours.toString(), 2, '0')

        let minutes = wordFill(getToday.getMinutes().toString(), 2, '0');
        let seconds = wordFill(getToday.getSeconds().toString(), 2, '0');  
        
        let now = ampm + "  " + hours + ":" + minutes + ":" + seconds;
        now = [now]

        return now;

    }
    // ===================================================
    // return 현재 날짜
    // ex) 2021-08-30 THU
    const getToday = () => {
        
        let today = new Date();
        let year = today.getFullYear();
        let month = wordFill((today.getMonth()+1).toString(), 2, '0');
        let date = wordFill(today.getDate().toString(), 2, '0'); 
        let day = week[today.getDay()];

        today = year + "-" + month + "-" + date + " "+ day;
        today = [today]
        return today;
    }

    // ===================================================
    // input : get week (year, month, date)
    // return 특적 날짜의 요일 
    // ex) 2021-08-30 was... / THU
    const getWeek = (that_date) => {

        let year  = that_date[0];
        let month = that_date[1];
        let date  = that_date[2];
            
        const that_day = new Date();
        that_day.setFullYear(year)
        that_day.setMonth(month-1)
        that_day.setDate(date)
        
        year = wordFill(that_day.getFullYear().toString(), 4, '0')
        month = wordFill((that_day.getMonth()+1).toString(), 2, '0')
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
    }
    // ===================================================
    // return mealMenu
    const getMealMenu = () => {

        let script = [];

        for (let index = 0; index < mealMenu.length; index++) {
            script = script.concat('['+(index+1)+'] '+mealMenu[index])
        }

        return script;
    }

    // ===================================================
    // return random으로 mealMenu 중 하나를 뽑음
    const randomMeal = () => {

        const ranInt = random.int(0, mealMenu.length-1)
        let meal = mealMenu[ranInt]
        meal = [meal]

        return meal;
    }

    // ===================================================
    // return meal로 array를 받은 후, mealMenu 요소를 추가함.
    const addMealMenu = (meal) => {
        
        setMealMenu(mealMenu.concat(meal))
        const script = ['Completed.']

        return script;

        // reducers 적용하기 
    }

    // ===================================================
    // return meal로 array를 받은 후, mealMenu 요소를 삭제함.
    const deleteMealMenu = (meal) => {

        let menu = mealMenu;

        for (let index = 0; index < meal.length; index++) {
            menu.splice(menu.indexOf(meal[index]), 1)
        }
        setMealMenu(menu) 
        const script = ['Completed.']

        return script;

        // reducers 적용하기
    }


    const commandInit = () => {

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
    }


    const command = (cmd) => {

        let returnData = [];

        let cmdArr = cmd;
        try {

            if (cmdArr.length == 1) {
                returnData = cmdScript[cmd[0]];
            } else {
                returnData = cmdScript[cmd[0]];
                console.log("cmd : "+cmd)
                const pr = /^\(.*\)$/g;

                for (let index = 1; index < cmdArr.length; index++) {
                    if (pr.test(cmdArr[index])) {
                        let prameterArr = cmdArr[index];
                        prameterArr = prameterArr.replace(/\(|\)/g, "")
                        prameterArr = prameterArr.split(/,/g)

                        for (let index = 0; index < prameterArr.length; index++) {  
                            prameterArr[index] = prameterArr[index].replace(/^\s+|\s+$/gm,'')
                        }
                        returnData = returnData(prameterArr)

                    } else {
                        returnData = returnData[cmdArr[index]]
                    }
                }
            }

        } catch (error) {
            return undefined;
        }  

        return returnData;
    
    }

    const keyDownHandler = (e) => {
        switch (e.keyCode) {
            case 9: 
                e.preventDefault();
                 setUserInput(userInput+'\t')
                break;
            case 13: // enter
                if (userInput == "clear") {
                    setMsgHistory([])
                } else {
                    console.log(userInput)
                    setMsgHistory(msgHistory.concat('me:' + userInput))
                    
                    const sendCmd = userInput.match(/[a-zA-z\.+\?+]+|\(.+\)/g);
                
                    const cmd = command(sendCmd)
            
                    if (cmd !== undefined) {
                        setGuideSayArr(cmd)
                    }
                }
                
                if (userInput.length != 0 && userInput != cmdHistory[cmdHistory.length-1]) {
                    setCmdHistory(cmdHistory.concat(userInput))
                    setCmdAddr(cmdHistory.length+1)

                }else{
                    setCmdAddr(cmdHistory.length)
                }

                break;
            case 38: // arrow up
                if (cmdAddr > 0) {
                    setCmdAddr(cmdAddr-1)
                }

                break;
            case 40: // arrow down
                if (cmdAddr < cmdHistory.length-1) {
                    setCmdAddr(cmdAddr+1)
                }

                break;
            default:

                break;
        }    
    }
    
    const guideSaid = () => {
        setTimeout(()=>{
            if (Array.isArray(guideSayArr)) {
                setMsgHistory(msgHistory.concat('gu:' + guideSayArr[0]))
                guideSayArr.shift()
            }
            console.log(guideSayArr)
            // console.log("lnth: " + guideSayArr.length)
        }, 250)    
    }

    useEffect(() => {

        commandInit()
        ping()

    }, [])

    useEffect(() => {

        setUserInput(cmdHistory[cmdAddr])
        console.log("addr : " + cmdAddr)
        console.log(cmdHistory)

    }, [cmdAddr])


    useEffect(() => {
        if(guideSayArr && guideSayArr.length != 0){            
            guideSaid()
        }
        setUserInput("")

        const scroll = tableRef.current.scrollHeight - tableRef.current.clientHeight;
        tableRef.current.scrollTo(0, scroll)

    }, [msgHistory, guideSayArr])



    const msgList = msgHistory.map((msg, index) => (<div> {msg.substr(0, 3) === 'me:' ? 
                                                        <div key={index} style={{minHeight: '25px', overflow: "hidden", wordBreak: "break-all", backgroundColor: "pink"}}>&lt;{cookie['astronaut_id']}&gt; {msg.substr(3)}</div> : 
                                                        <div dangerouslySetInnerHTML={{__html: msg.substr(3)}} key={index} style={{minHeight: '25px',overflow: "hidden", wordBreak: "break-all", backgroundColor: "pink"}}></div> } 
                                                    </div>))

    return(

        <div>
            
            <div ref={tableRef} style={{display: "flex", width: "270px", height: "350px", backgroundColor: "coral", overflow: "auto", flexDirection: "column-reverse"}}>
                
            {on ? 
                <div>
                    {msgList}
                </div>
                :
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
            }
     
            </div>
            <input type="text" style={{width: "265px"}} onKeyDown={(e) => keyDownHandler(e)} value={userInput} onChange={(e)=> setUserInput(e.target.value)} />
        </div>

    )

}

export default MainCommandTable;