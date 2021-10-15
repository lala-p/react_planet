import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';

import ToggleSwitch from 'react-switch';

import * as mainTextAction from '../actions/mainText';


const MainBoard = () => {

    const [boardText, setboardText] = useState("");

    const [removeSpace, setremoveSpace] = useState(false);
    const [cookie, setCookie, removeCookie] = useCookies();  

    const selectMainText = useSelector((state) => state.mainText.mainText);


    return(
        
        <div>

            <div>
                <textarea name="mainText" cols="150" rows="40" onChange={(e) => setCookie('mainText', e.target.value, {path: '/', sameSite: 'Lax'})} value={cookie.mainText}></textarea>
                <br />
                removeSpace &nbsp; &nbsp; 
                <ToggleSwitch onChange={(checked) => setremoveSpace(checked)} checked={removeSpace} />
                
                {/* <h1>총  {removeSpace ? cookie.mainText.replace(/\s/ig, "").length : cookie.mainText.replace(/\r?\n|\r/g, "").length}자</h1> */}
                <h2>asdfasdfadf</h2>
            </div>
            <pre>

                {selectMainText}

            </pre>

        </div>

    )

}

export default MainBoard;