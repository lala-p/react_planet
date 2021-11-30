import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import { useHistory } from 'react-router-dom';

import Editor from "@monaco-editor/react";
import ToggleSwitch from 'react-switch';
import axios from 'axios';

import * as mainTextAction from '../actions/mainText';
import * as messageAction from '../actions/message';

import { findVer01 } from '../find/ver_01';

const MainBoard = () => {

    const history = useHistory()

    const dispatch = useDispatch()
    const mainText              = useSelector((state) => state.mainText.mainText)
    const saveTime              = useSelector((state) => state.mainText.saveTime)
    const textLength            = useSelector((state) => state.mainText.textLength)
    const removeSpaceTextLength = useSelector((state) => state.mainText.removeSpaceTextLength)
    const fontSize              = useSelector((state) => state.mainText.fontSize)

    const readOnly = useSelector((state) => state.message.readOnly)

    const editorRef = useRef(null)
    const btnRef = useRef(null)
    
    const [mountComplete, setMountComplete] = useState(false)
    const [removeSpace, setRemoveSpace] = useState(false)


    const eMount = (editor, monaco) => {

        monaco.languages.register({id: 'planet'})
        monaco.languages.setMonarchTokensProvider('planet', {
            tokenizer: {
                root: [
                    [/-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-/, 'week-line'],
                    [/={3}\s\d{4}\/\d{2}\/\d{2}\s\={20}/, 'date-start-line'],
                    [/\-{35}/, 'date-end-line'],
                ]
            }
        });
        monaco.languages.registerCompletionItemProvider('planet', {
            provideCompletionItems: () => {
                var suggestions = [{
                        label: 'weekLine',
                        kind: monaco.languages.CompletionItemKind.Text,
                        insertText: '-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-'
                    },
                    {
                        label: 'date-start-line',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: '=== ${1:0000}/${2:00}/${3:00} ====================',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    },
                    {
                        label: 'date-end-line',
                        kind: monaco.languages.CompletionItemKind.Text,
                        insertText: '-----------------------------------'
                    },
                    {
                        label: 'one-date-plan',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: [
                            '=== ${1:0000}/${2:00}/${3:00} ====================', 
                            '', 
                            '', 
                            '1. ', 
                            '2. ', 
                            '3. ', 
                            '', 
                            '',
                            '-----------------------------------',
                        ].join('\n'),  
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    },

                ];

                return {
                    suggestions: suggestions
                };
            }
        });


        monaco.editor.defineTheme('planet-theme', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                {
                    token: 'week-line',
                    foreground: '808080'
                },
                {
                    token: 'date-start-line',
                    foreground: 'ffffff',
                    fontStyle: 'bold'
                },
                {
                    token: 'date-end-line',
                    foreground: 'FFA500'
                },
            ],
            colors: {
                'editor.foreground': '#FFFFFF',
                // 'editor.background': '#202124',
            }
        });
        monaco.editor.setTheme('planet-theme')


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
        fontSize: fontSize,
    })

    const getMemoData = useCallback(
        (text) => {
            let weekTextArr = []

            if (text.length != 0) {
                weekTextArr = text.split(findVer01['baseLine']['weekLine'])
            }

            for (let index = 0; index < weekTextArr.length; index++) {
                let memoText = weekTextArr[index]
                let memoArr = memoText.split(findVer01['baseLine']['dateEndLine'])
                memoArr.pop()

                for (let index2 = 0; index2 < memoArr.length; index2++) {

                    let memo_copy = memoArr[index2]

                    let memoData = {
                        date: "",
                        day: -1,
                        plan: [],
                        etc: [],
                    }

                    let date = ""
                    let day = ""
                    let plan = []
                    let etc = []

                    date = memo_copy.match(findVer01['date'])
                    memoData['date'] = date[0]

                    day = new Date(date).getDay()
                    memoData['day'] = day

                    etc = memo_copy.split(findVer01['baseLine']['etcLine'])
                    etc.shift()
                    memoData['etc'] = etc
                    for (let index3 = 0; index3 < etc.length; index3++) {
                        memo_copy = memo_copy.replace('+' + memoData['etc'][index3], "")
                    }

                    plan = memo_copy.split(findVer01['baseLine']['planLine'])
                    plan.shift()
                    memoData['plan'] = plan

                    memoArr[index2] = memoData
                }
                weekTextArr[index] = memoArr
            }

            dispatch(mainTextAction.setMemoData(weekTextArr))

        }, [saveTime]
    )

    useEffect(() => {
        if (mountComplete) {
            if (saveTime && !readOnly) {
                if (mainText != editorRef.current.getValue()) { 
                    
                    dispatch(messageAction.setReadOnly(true))
                    dispatch(messageAction.addMsgHistory('gu:Saving...'))

                    dispatch(mainTextAction.setMainText(editorRef.current.getValue()))
                    dispatch(mainTextAction.setTextLength(editorRef.current.getValue().length))
                    dispatch(mainTextAction.setRemoveSpaceTextLength(editorRef.current.getValue().replace(/\s/g, "").length))
                    getMemoData(editorRef.current.getValue())


                    let url = "http://localhost:3001/main/saveText";

                    const dataBox = {
                        text: editorRef.current.getValue(),
                    }

                    axios
                        .post(url, dataBox)
                        .then((response) => {
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
                    
                
                } else {
                    console.log("same!@!")
                }
            }

        }
    }, [saveTime])


    // ===================================================
    // 단축키 설정 -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    useHotkeys('insert', () => {
        editorRef.current.focus()    
    })

    
    return(
        <div className="MainBoard">
            <div>
                <div>
                    <Editor
                        height="70vh"
                        width="1000px"
                        ref={editorRef}
                        defaultLanguage="planet"
                        value={mainText}
                        theme="planet-theme"
                        loading="hello...?"
                        onMount={eMount}
                        options={options}
                    />
                    <button onClick={()=>{console.log(mainText)}}>zxc</button>
                    <button onClick={()=>{history.push('/loading')}}>asdf</button>
                    <button ref={btnRef} onFocus={()=> {btnRef.current.blur()}}></button>

                    <br /> 
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
