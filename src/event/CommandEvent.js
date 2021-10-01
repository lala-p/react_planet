import React, { useState, useEffect } from 'react';
import axios from 'axios';
import random from 'random';
import { useCookies } from 'react-cookie';

const week = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

const cmdScript = {}

const CommandEvent = () => {

    const [astronautId, setAstronaut] = useState("??")
    // const [astronautId, setAstronaut] = useState("??")


    const [cookie, setCookie, removeCookie] = useCookies()


    const wordFill = (str, len, word) => {
        return str.length < len ? word+str : str;
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
        let month = wordFill(today.getMonth().toString(), 2, '0');
        let date = wordFill(today.getDate().toString(), 2, '0'); 
        let day = week[today.getDay()];

        
        let returntoday = year + "-" + month + "-" + date + " "+ day;

        return [returntoday];
    }

    // ===================================================

    const getMealMenu = () => {

    }

    const getMeal = () => {

    }

    const addMealMenu = () => {

    }

    const removeMealMenu = () => {

    }


    useEffect(() => {


        cmdScript['haha'] = ["haha!@!", "hoho", "asdfasdf"]
        cmdScript['hi'] = [`hi, ${cookie['astronaut_id']}`, "nice meet you"]
        cmdScript['hello'] = ["it's me..."]
        cmdScript['hello..?'] = ['','planet에 오신 걸 환영합니다.', '저는 이 planet 안내원', 'pungpung이라고 합니다.', '']


        cmdScript['now'] = getNow()
        cmdScript['today'] = getToday()
        
        cmdScript['get'] = {}
        cmdScript['get']['week'] = getMealMenu()
        cmdScript['get']['meal'] = getMeal()
    
        cmdScript['show'] = {}
        cmdScript['show']['meal_menu'] = getMealMenu()
    
        cmdScript['add'] = {}
        cmdScript['add']['meal_menu'] = addMealMenu()
    
        cmdScript['rm'] = {}
        cmdScript['rm']['meal_menu'] = removeMealMenu()
        

    })

    return <></>;

}

export const Command = (cmd) => {

    let returnData = []
    returnData = cmdScript[cmd];

    return returnData;
}


export default CommandEvent;