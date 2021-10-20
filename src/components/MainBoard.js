import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import ToggleSwitch from 'react-switch';

import * as mainTextAction from '../actions/mainText';


const MainBoard = () => {

    const dispatch = useDispatch();
    const selectMainText = useSelector((state) => state.mainText.mainText);

    const [boardText, setboardText] = useState("");

    const [removeSpace, setremoveSpace] = useState(false);
    const [cookie, setCookie, removeCookie] = useCookies();  


    const onChange = (e) => {

        setboardText(e.target.value)
        
    }
    const save = () => {

        let url = "http://localhost:3001/main/saveText";

        const textBox = {
            text: selectMainText,
        }

        axios.post(url, textBox)
            .then((response) => {

                console.log("저장 완료!@!");

            })
            .catch((error) => {
                console.log(error)
            })

    }

    useEffect(() => {

        dispatch(mainTextAction.setMainText(boardText))
        console.log(selectMainText)
    
    }, [boardText])


    return(
        
        <div>

            <div>
                <textarea name="mainText" cols="150" rows="40" onChange={onChange} value={selectMainText}></textarea>
                <br />
                removeSpace &nbsp; &nbsp; 
                <ToggleSwitch onChange={(checked) => setremoveSpace(checked)} checked={removeSpace} />
                
                <h1>총  {removeSpace ? boardText.replace(/\s/ig, "").length : boardText.replace(/\r?\n|\r/g, "").length}자</h1>
                <h2>asdfasdfadf</h2>
            </div>
            <pre>

                {selectMainText}

            </pre>

            <button type="button" onClick={save}></button>
        </div>

    )

}

export default MainBoard;