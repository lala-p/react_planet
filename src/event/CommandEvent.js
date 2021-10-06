import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import random from 'random';
import { useCookies } from 'react-cookie';


const week = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

const cmdScript = {}

let meal_menu = [];


const CommandEvent = () => {

    const [astronautId, setAstronaut] = useState("??")
    // const [astronautId, setAstronaut] = useState("??")


    const [cookie, setCookie, removeCookie] = useCookies()

    const setMealMenu = () => {

        meal_menu = cookie.meal_menu
    }


    useEffect(() => {
        meal_menu = cookie.meal_menu

    }, [])

    useEffect(() => {
    
        setCookie('meal_menu', meal_menu, {path: '/', sameSite: 'Lax'})

    }, [meal_menu])


    return <></>;

}

// ===================================================

const wordFill = (str, len, word) => {
    return str.length < len ? word+str : str;
}


// ===================================================
// return 현재 시간 
// ex) PM 02:08:33
export const getNow = () => {
    
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
export const getToday = () => {
    
    let today = new Date();

    let year = today.getFullYear();
    let month = wordFill((today.getMonth()+1).toString(), 2, '0');
    let date = wordFill(today.getDate().toString(), 2, '0'); 
    let day = week[today.getDay()];

    
    let returntoday = year + "-" + month + "-" + date + " "+ day;

    meal_menu = ['asdf', 'rewq', 'asdf', 'vcxz']

    return [returntoday];
}

// ===================================================

const getMealMenu = () => {



    return meal_menu
}

const getMeal = () => {

}

const addMealMenu = () => {

}

const removeMealMenu = () => {

}

export const CommandInit = () => {


    cmdScript['haha'] = () => ["haha!@!", "hoho", "asdfasdf"]
    cmdScript['hi'] = () => [`hi, ${week[2]}`, "nice meet you"]
    cmdScript['hello'] = () => ["it's me..."]
    cmdScript['hello..?'] = () => ['','planet에 오신 걸 환영합니다.', '저는 이 planet 안내원', 'pungpung이라고 합니다.', '']


    cmdScript['now'] = () => getNow()
    cmdScript['today'] = () => getToday()

    cmdScript['get'] = {}
    cmdScript['get']['week'] = () => getMealMenu()
    cmdScript['get']['meal'] = () => getMeal()

    cmdScript['show'] = {}
    // cmdScript['show']['meal_menu'] = () => getMealMenu()
    cmdScript['show meal_menu'] = () => getMealMenu()
    cmdScript['show']['test'] = (haha) => haha;

    cmdScript['add'] = {}
    cmdScript['add']['meal_menu'] = () => addMealMenu()

    cmdScript['rm'] = {}
    cmdScript['rm']['meal_menu'] = () => removeMealMenu()


}


export const Command = (cmd) => {


    let returnData = [];

    let cmdArr = cmd;


    if(cmdArr.length == 1){

        returnData = cmdScript[cmd[0]];

    }else{

        returnData = cmdScript[cmd[0]];

        
        const pr = /^{.*}$/g;

        for (let index = 1; index < cmdArr.length; index++) {
            
            if(pr.test(cmdArr[index])){

                // array로 만들어서 값 넘겨주기

                let prameterArr = cmdArr[index];

                prameterArr = prameterArr.replace(/{|}/g, "")
                prameterArr = prameterArr.split(/,/g)

                returnData = returnData(prameterArr)      

            }else{

                returnData = returnData[cmdArr[index]]

            }
            
            // alert(cmdArr[index]+ pr.test(cmdArr[index]) + " asdfasdfa")            
        } 
    
    }


    // returnData = cmdScript[cmd];

    return returnData;
}


export default CommandEvent;