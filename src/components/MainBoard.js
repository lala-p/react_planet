import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ToggleSwitch from 'react-switch';

import * as mainTextAction from '../actions/mainText';


const MainBoard = () => {

    const dispatch = useDispatch();
    const selectMainText = useSelector((state) => state.mainText.mainText);

    const [boardText, setboardText] = useState("");
    const [removeSpace, setremoveSpace] = useState(false);


    const onChange = (e) => {

        setboardText(e.target.value)
        dispatch(mainTextAction.setMainText(e.target.value))

    }

    
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

        </div>

    )

}

export default MainBoard;