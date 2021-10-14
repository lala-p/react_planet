import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TextareaAutosize from 'react-textarea-autosize';
import ToggleSwitch from 'react-switch';

import MainBoard from '../components/MainBoard';
import MainCommandTable from '../components/MainCommandTable';
import MainGuide from '../components/MainGuide';
import { useCookies } from 'react-cookie';

const MainPage = () => {


    useEffect(() => {

        
    }, [])


    // const getText = () =>{

    //     let url = "http://localhost:3001/getText";


    //     axios.get(url)
    //     .then((response) => {

    //         console.log(response.data)
    //         setMainText(response.data)

    //     })
    //     .catch((error) => {
    //         console.log(error)
    //     })


    // }


    // const saveText = () =>{


    //     console.log("저장 중...");

    //     let url = "http://localhost:3001/saveText";

    //     const textBox = {
    //         text: mainText,
    //     }


    //     axios.post(url, textBox)
    //     .then((response) => {

    //         console.log("저장 완료!@!");
                        
    //     })
    //     .catch((error) => {
    //         console.log(error)
    //     })



    // }





    
    return(
        <div>


                <div style={{width: "300px",float: "left"}}>

                    <div>

                        {/* MainGuide */}
                        <MainGuide></MainGuide>

                    </div>

                    <div>

                        <MainCommandTable></MainCommandTable>
                        {/* MainCommandTable */}

                    </div>

                </div>

                {/* <div style={{float: "left"}}>

                    <MainBoard></MainBoard>

                </div> */}


                {/* <button type="button" onClick={() => getText}>text 가져오기</button>&nbsp;
                <button type="button" onClick={() => saveText}>저장하기</button> */}

        </div>
    )

}

export default MainPage;

