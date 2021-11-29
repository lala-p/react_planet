import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';

import Editor from "@monaco-editor/react";
import ToggleSwitch from 'react-switch';
import axios from 'axios';

import * as mainTextAction from '../actions/mainText';
import * as messageAction from '../actions/message';


const MainBoard = () => {

    const dispatch = useDispatch()
    const mainText              = useSelector((state) => state.mainText.mainText)
    const saveTime              = useSelector((state) => state.mainText.saveTime)
    const textLength            = useSelector((state) => state.mainText.textLength)
    const removeSpaceTextLength = useSelector((state) => state.mainText.removeSpaceTextLength)

    const readOnly = useSelector((state) => state.message.readOnly)

    const editorRef = useRef(null)
    const btnRef = useRef(null)
    
    const [mountComplete, setMountComplete] = useState(false)
    const [removeSpace, setRemoveSpace] = useState(false)

    // useEffect(() => {
    //     if (mountComplete) {
    //         console.log(editorRef.current.getValue().length)
    //         setTextLength(editorRef.current.getValue().length)
    //         dispatch(mainTextAction.setMainText(editorRef.current.getValue()))
    //         console.log(mainText)
    //     }
    // }, [updateTime])


    useEffect(() => {
        if (mountComplete) {
            if (saveTime && !readOnly) {
                if (mainText == editorRef.current.getValue()) { 
                    console.log("same!@!")

                } else {
                    dispatch(messageAction.setReadOnly(true))
                    dispatch(messageAction.addMsgHistory('gu:Saving...'))

                    dispatch(mainTextAction.setMainText(editorRef.current.getValue()))
                    dispatch(mainTextAction.setTextLength(editorRef.current.getValue().length))
                    dispatch(mainTextAction.setRemoveSpaceTextLength(editorRef.current.getValue().replace(/\s/ig, "").length))

                    let url = "http://localhost:3001/main/saveText";

                    const dataBox = {
                        text: editorRef.current.getValue(),
                    }

                    axios
                        .post(url, dataBox)
                        .then((response) => {
                            console.log("저장 완료!@!");
                            dispatch(messageAction.addMsgHistory('gu:Save Completed.'))
                        })
                        .catch((error) => {
                            console.log(error)
                            dispatch(messageAction.addMsgHistory('gu:Save failed.'))
                        })
                        .finally(() => {
                            console.log(mainText)
                            dispatch(messageAction.setReadOnly(false))
                        })
                }
            }

        }
    }, [saveTime])


    const eMount = (editor, monaco) => {
        editor.addCommand(monaco.KeyCode.Escape , () => {
            btnRef.current.focus()
            console.log("Escape!@!")
        })


        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S , () => {
            dispatch(mainTextAction.setSaveTime(new Date()))
        })


        editorRef.current = editor
        setMountComplete(true)
    }
    
    const [options, setOptions] = useState({
        minimap: {
            enabled: true
        },
        quickSuggestions: {
            "other": false,
            "comments": false,
            "strings": false
        },

    })


    // ===================================================
    // 단축키 설정 -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    useHotkeys('insert', () => {
        editorRef.current.focus()    
    })


    return(
        <div className="MainBoard">
            <div>
                <div>
                    <button onClick={()=>{dispatch(mainTextAction.setUpdateTime(new Date()))}}>asdf</button>
                    <button onClick={()=>{console.log(mainText)}}>zxc</button>
                    <button ref={btnRef} onFocus={()=> {btnRef.current.blur()}}></button>
                    <Editor
                        height="70vh"
                        width="1000px"
                        ref={editorRef}
                        defaultLanguage="plainText"
                        value={mainText}
                        theme="vs-dark"
                        onMount={eMount}
                        loading="hello...?"
                        options={options}
                    />

                    <br /> 
                    {/* <textarea ref={boardRef} id="boardText" cols="150" rows="40" onChange={boardOnChange} onBlur={boardOnBlur} onKeyDown={keyDownHandler} value={boardText}>
                    </textarea>     */}
                    <br />
                    removeSpace &nbsp; &nbsp; 
                    <ToggleSwitch onChange={(checked) => setRemoveSpace(checked)} checked={removeSpace} />
                    
                    <h1>총 {removeSpace? removeSpaceTextLength : textLength}자</h1>
                    
                    {/* <h1>총  {removeSpace ? boardText.replace(/\s/ig, "").length : boardText.length}자</h1> */}
                    {/* <h1>총  {removeSpace ? boardText.replace(/\s/ig, "").length : boardText.replace(/\r?\n|\r/g, "").length}자</h1> 
                    줄바꿈 포함 */}
                    </div>

            </div>
        </div>
    )

}

export default MainBoard;