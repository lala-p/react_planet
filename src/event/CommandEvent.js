import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import random from 'random';
import { useCookies } from 'react-cookie';

import * as mainTextAction from '../actions/mainText';


const week = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];


// let astronaut_id = "";
// let astronaut_nickname = "";
// let astronaut_password = "";

// let meal_menu = null;

// let mainText = "";

// let onSave = false;
// let gaga = false;


const CommandEvent = forwardRef((props, ref) => {

    const dispatch = useDispatch();
    const selectMainText = useSelector((state) => state.mainText.mainText);

    const [mainText, setMainText] = useState("asdasdasd")

    const [cmdScript, setCmdScript] = useState({})

    const [astronautId, setAstronautId]             = useState("hahaha")
    const [astronautNickname, setAstronautNickname] = useState("lululu")
    const [astronautPassword, setAstronautPassword] = useState("1234")

    const [mealMenu, setMealMenu] = useState(['11111','222222','33333'])

    const [onSave, setOnSave] = useState(false);

    const wordFill = (str, len, word) => {

        let returnWord = str;

        for (let index = str.length; index < len; index++) {
            returnWord = word+returnWord;
        }

        return returnWord;
    }


    const save = () => {

        setOnSave(true)
        const script = ['Save Completed.'] 
        
        return script;
        
    }

    const getMainText = () => {
  
        let url = "http://localhost:3001/main/getText";

        axios.get(url)
        .then((response) => {

            console.log(response.data)
            dispatch(mainTextAction.setMainText(response.data))

        })
        .catch((error) => {
            console.log(error)
        })

        const script = ['Completed.'] 
        
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

        return [now];

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

        
        let returntoday = year + "-" + month + "-" + date + " "+ day;


        return [returntoday];
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
    }

    // ===================================================
    // return meal로 array를 받은 후, mealMenu 요소를 삭제함.
    const removeMealMenu = (meal) => {

        let menu = mealMenu;

        for (let index = 0; index < meal.length; index++) {
            menu.splice(menu.indexOf(meal[index]), 1)
        }

        setMealMenu(menu) 

        const script = ['Completed.']

        return script;
    }


    const commandInit = () => {

        const script = {}

        script['haha'] = () => ["haha!@!", "hoho", "asdfasdf"]
        script['hi'] = () => [`hi, ${week[2]}`, "nice meet you"]
        script['hello'] = () => ["it's me..."]

        script['now'] = () => getNow()
        script['today'] = () => getToday()

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

        script['remove'] = {}
        script['remove']['meal_menu'] = (meal) => removeMealMenu(meal)


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


    const sayHaha = () => {
        alert("haha!@!")
    }

    const sayLulu = () => {
        alert("lulu~")
    } 


    useImperativeHandle(ref, () => ({
        sayHaha, 
        sayLulu,
        command
    }));

    useEffect(() => {

        commandInit()

    }, [])

    useEffect(() => {

        if (onSave) {
            let url = "http://localhost:3001/main/saveText";
            
            const textBox = {
                text: selectMainText,
            }

            axios
            .post(url, textBox)
            .then((response) => {
                console.log("저장 완료!@!");
                setOnSave(false)
            })
            .catch((error) => {
                console.log(error)
            })
        }

    }, [onSave])

    
    return <></>;

});


export default CommandEvent;