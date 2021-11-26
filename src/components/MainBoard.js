import React, { useState, useRef, useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useSelector, useDispatch } from 'react-redux';

import Editor, { editor, useMonaco } from "@monaco-editor/react";
import ToggleSwitch from 'react-switch';

import * as mainTextAction from '../actions/mainText';


const MainBoard = () => {

    const dispatch = useDispatch()
    const selectMainText = useSelector((state) => state.mainText.mainText)
    const updateTime = useSelector((state) => state.mainText.updateTime)

    const boardRef = useRef(null) 
    const [boardText, setboardText] = useState("")
    const [removeSpace, setRemoveSpace] = useState(false)

    const eRef = useRef(null)

    const monaco = useMonaco()

    const boardOnChange = (e) => {

        setboardText(e.target.value)

        if (selectMainText.length >= 165000) {

            alert("165,000!@!")

        }
    }

    const btnRef = useRef(null)
    const keyDownHandler = (e) => {
        switch (e.keyCode) {
            case 9: // tab
                // Document.execCommand('insertText', false, "\t")
                e.preventDefault();
                setboardText(boardText + 'asdfaf')
                break;
            case 27: // esc
                boardRef.current.blur()
                break;

            default:
                break;
        }
    }
    
    const [textLength, setTextLength] = useState(0)

    const [mountComplete, setMountComplete] = useState(false)

    useEffect(() => {
        console.log()
        if (mountComplete) {
            console.log(eRef.current.getValue().length)
            setTextLength(eRef.current.getValue().length)
            dispatch(mainTextAction.setMainText(eRef.current.getValue()))
        }
    }, [updateTime])

    // ===================================================
    // 단축키 설정 -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    useHotkeys('insert', () => {
        eRef.current.focus()    
    })

    const eMount = (editor, monaco) => {
        editor.addCommand(monaco.KeyCode.Escape , () => {
            btnRef.current.focus()
            console.log("Escape!@!")
        })

        eRef.current = editor
        setMountComplete(true)
        console.log("mount")

    }


    const getBoardTextLength = () => {

        
    }

    const [options, setOptions] = useState(
        {
            minimap: {
                enabled: true
            }

        }
    )

    // useEffect(() => {
    //     setboardText(selectMainText)

    // }, [selectMainText])

    return(
        <div className="MainBoard">
            <div>
                <div>
                    <button onClick={()=>{dispatch(mainTextAction.setUpdateTime(new Date()))}}>asdf</button>
                    <button ref={btnRef} onFocus={()=> {btnRef.current.blur()}}></button>
                    <Editor
                        height="70vh"
                        width="1000px"
                        ref={eRef}
                        defaultLanguage="plainText"
                        value={selectMainText}
                        theme="vs-dark"
                        onMount={eMount}
                        loading="hello...?"
                        options={options}
                    />
                    {/* {boardText} */}
                    <br /> 
                    {/* {selectMainText} */}
                    {/* <textarea ref={boardRef} id="boardText" cols="150" rows="40" onChange={boardOnChange} onBlur={boardOnBlur} onKeyDown={keyDownHandler} value={boardText}>
                    </textarea>     */}
                    <br />
                    removeSpace &nbsp; &nbsp; 
                    <ToggleSwitch onChange={(checked) => setRemoveSpace(checked)} checked={removeSpace} />
                    
                    <h1>총 {textLength}자</h1>
                    {/* <h1>총  {removeSpace ? boardText.replace(/\s/ig, "").length : boardText.length}자</h1> */}
                    {/* <h1>총  {removeSpace ? boardText.replace(/\s/ig, "").length : boardText.replace(/\r?\n|\r/g, "").length}자</h1> 
                    줄바꿈 포함 */}
                    </div>
                {document.activeElement == boardRef.current?
                    <div>true</div>
                    :
                    <div>false</div>
                }


            </div>
        </div>

    )

}

export default MainBoard;