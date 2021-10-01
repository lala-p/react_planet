import React, { useState, useEffect } from 'react';
import axios from 'axios';
import random from 'random';
import { useCookies } from 'react-cookie';

const week = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

const cmdScript = {}
const astronaut_id = "lululala";


//
// 구조 컴포넌트식으로 그에 맞게 구조 바꾸기
// 

export function cmd(cmd) {

    let returnData = []

    cmdScript['haha'] = ["haha!@!", "hoho", "asdfasdf"]
    cmdScript['hi'] = [`hi, ${astronaut_id}`, "nice meet you"]
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




    returnData = cmdScript[cmd];

    return returnData;
}

// ===================================================

function word_fill(str, len, word) {
    return str.length < len ? word+str : str;
}


// return 현재 시간 
// ex) PM 02:08:33
function getNow() {
    
    let getToday = new Date();

    let hours = getToday.getHours();
    let ampm = hours < 12 ? '  AM' : '  PM'; 

    hours = hours < 12 ? hours : hours-12;
    hours = word_fill(hours.toString(), 2, '0')

    let minutes = word_fill(getToday.getMinutes().toString(), 2, '0');
    let seconds = word_fill(getToday.getSeconds().toString(), 2, '0');  
    
    let now = ampm + "  " + hours + ":" + minutes + ":" + seconds;

    return [now];

}

// return 현재 날짜
// ex) 2021-08-30 THU
function getToday() {
    
    let today = new Date();

    let year = today.getFullYear();
    let month = word_fill(today.getMonth().toString(), 2, '0');
    let date = word_fill(today.getDate().toString(), 2, '0'); 
    let day = week[today.getDay()];

     
    let returntoday = year + "-" + month + "-" + date + " "+ day;

    return [returntoday];
}




// ===================================================

function getMealMenu() {

    const menu = ['냉면', '맘스터치', '와플', '꿀떡', '굶어'];

    const url = "http://localhost:3001/getMealMenu";


    axios.get(url)
    .then((response) => {

        console.log(response.data)

    })
    .catch((error) => {
        console.log(error)
    })



    return menu;
}


function getMeal() {

    const url = "http://localhost:3001/getMeal";


    axios.get(url)
    .then((response) => {

        console.log(response.data)

    })
    .catch((error) => {
        console.log(error)
    })


    return ['gaga'];
    
}


function addMealMenu() {

        
}


function removeMealMenu() {

        
}



// export default CommandEvent;