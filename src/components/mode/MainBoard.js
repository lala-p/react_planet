import React, { useState, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useSelector, useDispatch } from 'react-redux';

import ToggleSwitch from 'react-switch';

import * as mainTextAction from '../../actions/mainText';


const MainBoard = () => {

    const dispatch = useDispatch()
    const selectMainText = useSelector((state) => state.mainText.mainText)

    const boardRef = useRef(null) 
    const [boardText, setboardText] = useState("")
    const [removeSpace, setremoveSpace] = useState(false)

    const onChange = (e) => {

        setboardText(e.target.value)
        dispatch(mainTextAction.setMainText(e.target.value))

        if (selectMainText.length >= 165000) {

            alert("165,000!@!")

        }


    }

    const keyDownHandler = (e) => {
        switch (e.keyCode) {
            case 9: // tab
                e.preventDefault();
                setboardText(boardText + '\t')
                dispatch(mainTextAction.setMainText(boardText + '\t'))
                break;
            case 27: // esc
                boardRef.current.blur()
                break;

            default:
                break;
        }
    }
    
    // ===================================================
    // 단축키 설정 -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    useHotkeys('insert', () => {
        boardRef.current.focus()    
    })

    return(
        
        <div>
            <div>
                <textarea ref={boardRef} cols="150" rows="40" onKeyDown={keyDownHandler} onChange={onChange}>
                    {selectMainText} 
                    {/* textarea value 안에 넣으면 ctrl+z할 때 한글자씩 지워짐. */}
                </textarea>    
                <br />
                removeSpace &nbsp; &nbsp; 
                <ToggleSwitch onChange={(checked) => setremoveSpace(checked)} checked={removeSpace} />
                
                <h1>총  {removeSpace ? selectMainText.replace(/\s/ig, "").length : selectMainText.length}자</h1>
                {/* <h1>총  {removeSpace ? boardText.replace(/\s/ig, "").length : boardText.replace(/\r?\n|\r/g, "").length}자</h1> 
                줄바꿈 포함 */}
                </div>
            {document.activeElement == boardRef.current?
                <div>true</div>
                :
                <div>false</div>
            }


        </div>

    )

}

export default MainBoard;