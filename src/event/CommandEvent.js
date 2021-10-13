import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import random from 'random';
import { useCookies } from 'react-cookie';


const week = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const cmdScript = {};

let astronaut_id = "";
let astronaut_nickname = "";
let astronaut_password = "";

let meal_menu = null;


const CommandEvent = () => {

    const [astronautId, setAstronaut] = useState("??")
    // const [astronautId, setAstronaut] = useState("??")


    const [cookie, setCookie, removeCookie] = useCookies()


    useEffect(() => {
        if (meal_menu) {
            setCookie('meal_menu', meal_menu, {path: '/', sameSite: 'Lax'})
        
        }    
    }, [meal_menu])

    useEffect(() => {
        if (astronaut_id) {
            setCookie('astronaut_id', astronaut_id, {path: '/', sameSite: 'Lax'})
        
        }
    }, [astronaut_id])


    useEffect(() => {
        astronaut_id = cookie.astronaut_id
        meal_menu = cookie.meal_menu
 
 
    }, [])
    


    return <></>;

}

// ===================================================

const wordFill = (str, len, word) => {

    let returnWord = str;

    for (let index = str.length; index < len; index++) {
        returnWord = word+returnWord;
    }

    return returnWord;
}


// ===================================================
// return 현재 시간 
// ex) PM 02:08:33
const getNow = () => {
    
    let getToday = new Date();

    let hours = getToday.getHours();
    let ampm = hours < 12 ? '  AM' : '  PM'; 

    hours = hours < 12 ? hours : hours-12;
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
    
    let script1 = ''
    let script2 = week[that_day.getDay()]
    
    const now = new Date();
    

    if (now.getFullYear() <= that_day.getFullYear() && now.getMonth() <= that_day.getMonth() && now.getDate() < that_day.getDate()) {
        script1 = `${year}-${month}-${date} is...`;

    } else if (now.getFullYear() === that_day.getFullYear() && now.getMonth() === that_day.getMonth() && now.getDate() === that_day.getDate()) {
        script1 = `${year}-${month}-${date} today is...`;

    } else if (that_day.getFullYear() < 0) {
        script1 = `B.C. &nbsp;${wordFill(Math.abs(that_day.getFullYear()).toString(), 4, '0')}-${month}-${date} was...`;

    } else {
        script1 = `${year}-${month}-${date} was...`;

    }


    const returnData = [script1, script2];

    return returnData;
}

// ===================================================
// return cookie에 저장된 meal_menu
const getMealMenu = () => {

    let script = [];

    for (let index = 0; index < meal_menu.length; index++) {
        script = script.concat('['+(index+1)+'] '+meal_menu[index])
    }

    return script;
}

// ===================================================
// return random으로 meal_menu 중 하나를 뽑음
const randomMeal = () => {

    const ranInt = random.int(0, meal_menu.length-1)
    let meal = meal_menu[ranInt]
    meal = [meal]

    return meal;
}

// ===================================================
// return meal로 array를 받은 후, meal_menu 요소를 추가함.
const addMealMenu = (meal) => {
    
    meal_menu = meal_menu.concat(meal)

    const script = ['Completed.']
    // axois로 node server에 값 보내기
    return script;
}

// ===================================================
// return meal로 array를 받은 후, meal_menu 요소를 삭제함.
const removeMealMenu = (meal) => {

    let menu = meal_menu;

    for (let index = 0; index < meal.length; index++) {
        menu.splice(menu.indexOf(meal[index]), 1)
    }

    meal_menu = menu 

    const script = ['Completed.']
    // axois로 node server에 값 보내기
    return script;
}

export const CommandInit = () => {


    cmdScript['haha'] = () => ["haha!@!", "hoho", "asdfasdf"]
    cmdScript['hi'] = () => [`hi, ${week[2]}`, "nice meet you"]
    cmdScript['hello'] = () => ["it's me..."]
    cmdScript['hello..?'] = () => ['','planet에 오신 걸 환영합니다.', '저는 이 planet 안내원', 'pungpung이라고 합니다.', '']


    cmdScript['now'] = () => getNow()
    cmdScript['today'] = () => getToday()

    cmdScript['get'] = {}
    cmdScript['get']['week'] = (that_date) => getWeek(that_date)
    
    cmdScript['random'] = {}
    cmdScript['random']['meal'] = () => randomMeal()
    
    cmdScript['show'] = {}
    cmdScript['show']['meal_menu'] = () => getMealMenu()
    cmdScript['show']['test'] = (haha) => haha;

    cmdScript['add'] = {}
    cmdScript['add']['meal_menu'] = (meal) => addMealMenu(meal)

    cmdScript['remove'] = {}
    cmdScript['remove']['meal_menu'] = (meal) => removeMealMenu(meal)


}


export const Command = (cmd) => {


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


export default CommandEvent;