import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import Editor from "@monaco-editor/react";
import ToggleSwitch from 'react-switch';

import * as mainTextAction from '../actions/mainText';
import * as messageAction from '../actions/message';
import * as commandAction from '../actions/command';

import * as textApi from '../api/textApi';

import { findVer01 } from '../find/ver_01';

const MainBoard = () => {

    const history = useHistory()

    const dispatch = useDispatch()
    const mainText              = useSelector((state) => state.mainText.mainText)
    const textTitle             = useSelector((state) => state.mainText.textTitle)
    const saveAt                = useSelector((state) => state.mainText.saveAt)
    const textLength            = useSelector((state) => state.mainText.textLength)
    const removeSpaceTextLength = useSelector((state) => state.mainText.removeSpaceTextLength)
    const fontSize              = useSelector((state) => state.mainText.fontSize)

    const normalTempo = useSelector((state) => state.message.normalTempo) 
    const readOnly    = useSelector((state) => state.message.readOnly)
    
    const runCommandData = useSelector((state) => state.command.runCommandData)

    const [cookies, setCookie, removeCookie] = useCookies()    

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
            }
        });
        monaco.editor.setTheme('planet-theme')


        editor.addCommand(monaco.KeyCode.Escape , () => {
            btnRef.current.focus()
            console.log("Escape!@!")
        })
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S , () => {
            dispatch(commandAction.sendCommand('save text', true))
            console.log("asdfasdfadf")
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

    const dispatchWeekDataList = useCallback(
        (text) => {
            let weekTextList = []

            if (text.length != 0) {
                weekTextList = text.split(findVer01['global']['baseLine']['weekLine'])
            }

            let weekDataList = new Array(weekTextList.length)

            for (let index = 0; index < weekTextList.length; index++) {
                let weekText = weekTextList[index]
                let dayTextList = weekText.split(findVer01['global']['baseLine']['dateEndLine'])
                dayTextList.pop()

                let dayDataList = new Array(dayTextList.length)

                for (let index2 = 0; index2 < dayTextList.length; index2++) {
                    let dayText = dayTextList[index2]

                    let dayData = {
                        date: "",
                        day: -1,
                        planList: [],
                        etc: [],
                        graffiti: "", 
                    }

                    let date = dayText.match(findVer01['global']['find']['date'])
                    dayData['date'] = date[0]

                    let day = new Date(date).getDay()
                    dayData['day'] = day

                    let etc = dayText.split(findVer01['global']['rules']['etc'])
                    etc.shift()
                    dayData['etc'] = etc
                    for (let index3 = 0; index3 < etc.length; index3++) {
                        dayText = dayText.replace('+' + etc[index3], "")
                    }

                    let graffiti = dayText.split(findVer01['global']['rules']['graffiti'])
                    graffiti.shift()
                    dayText = dayText.replace(findVer01['global']['rules']['graffiti'], "")
                    for (let index4 = 0; index4 < graffiti.length; index4++) {
                        dayText = dayText.replace(graffiti[index4])
                    }

                    // let graffiti = dayText.match(findVer01['global']['find']['graffiti'])
                    // if (graffiti) {
                    //     dayData['graffiti'] = graffiti[0]
                    //     dayText = dayText.replace(findVer01['global']['find']['graffiti'], "")
                    //     dayText = dayText.replace(graffiti[0], "") 

                    // } else {
                    //     dayData['graffiti'] = []
                    // }


                    let planTextList = dayText.split(findVer01['global']['rules']['plan'])
                    planTextList.shift()

                    let planDataList = new Array(planTextList.length)
                    for (let index5 = 0; index5 < planTextList.length; index5++) {
                        let planText = planTextList[index5]
                        
                        let planData = {
                            plan: "",
                            state: 0,
                            info: [],
                            conclusion: [], 
                        }

                        let info = planText.split(findVer01['global']['rules']['info'])
                        info.shift()
                        planData['info'] = info 
                        planText = planText.replace(findVer01['global']['rules']['info'], "")
                        for (let index6 = 0; index6 < info.length; index6++) {
                            planText = planText.replace(info[index6], "")
                        }
                                                
                        
                        let conclusion = planText.split(findVer01['global']['rules']['conclusion'])
                        conclusion.shift()
                        planData['conclusion'] = conclusion
                        planText = planText.replace(findVer01['global']['rules']['conclusion'], "")
                        for (let index7 = 0; index7 < conclusion.length; index7++) {
                            planText = planText.replace(conclusion[index7], "")
                        }
                                                
                        let state = 0
                        if (findVer01['global']['find']['planSuccess'].test(planText)) {
                            state = 1
                            planText = planText.replace(findVer01['global']['find']['planSuccess'], "")
                        } else if (findVer01['global']['find']['planFailed'].test(planText)) {
                            state = 2
                            planText = planText.replace(findVer01['global']['find']['planFailed'], "")
                        } else if (findVer01['global']['find']['planDelay'].test(planText)) {
                            state = 3
                            planText = planText.replace(findVer01['global']['find']['planDelay'], "")
                        } else if (findVer01['global']['find']['planSomeday'].test(planText)) {
                            state = 4
                            planText = planText.replace(findVer01['global']['find']['planSomeday'], "")
                        }
                        
                        planData['state'] = state
                        planData['plan'] = planText

                        planDataList[index5] = planData
                    }

                    dayData['planList'] = planDataList
                    dayDataList[index2] = dayData
                }
                weekDataList[index] = dayDataList
            }

            console.log(weekDataList)
            dispatch(mainTextAction.setWeekDataList(weekDataList))
    
        }, [saveAt]
    )

    useEffect(() => {
        if (mountComplete) {
            if (saveAt && !readOnly) {
                if (mainText != editorRef.current.getValue() || runCommandData['commandType'] == 'save+as') { 
                
                    let script = [
                        { say: 'Saving...', tempo: 0}
                    ]
                    dispatch(messageAction.setGuideScript(script))

                    dispatch(mainTextAction.setMainText(editorRef.current.getValue()))
                    dispatch(mainTextAction.setTextLength(editorRef.current.getValue().length))
                    dispatch(mainTextAction.setRemoveSpaceTextLength(editorRef.current.getValue().replace(/\s/g, "").length))
                    dispatchWeekDataList(editorRef.current.getValue())


                    if (runCommandData['commandType'] == 'save+text') {

                        const dataContainer = {
                            userId: cookies['user_id'],
                            text: editorRef.current.getValue(),
                            textTitle: textTitle,
                        }

                        textApi.saveText(
                            dataContainer,
                            (response) => {
                                let script = [
                                    { say: 'Save Completed', tempo: 0 },
                                ]
                                dispatch(messageAction.setGuideScript(script))
                                
                                dispatch(commandAction.sendCommand('get textlist', false))  
                            },
                            (error) => {
                                let script = [
                                    { say: 'Save failed.', tempo: 0 },
                                ]
                                dispatch(messageAction.setGuideScript(script))
                                
                                console.log(error)
                            },
                            false
                        )

                    } else if (runCommandData['commandType'] == 'save+as') {

                        const dataContainer = {
                            userId: cookies['user_id'],
                            text: editorRef.current.getValue(),
                            textTitle: runCommandData['parameter'][0],
                        }
    
                        textApi.saveAsText(
                            dataContainer,
                            (response) => {
                                let script = [
                                    {
                                        say: 'Save as Completed.',
                                        tempo: 0,
                                    },
                                ]
                                dispatch(messageAction.setGuideScript(script))
                                dispatch(commandAction.sendCommand('get textlist', false))
                            },
                            (error) => {
                                let script = [
                                    {
                                        say: 'Save as failed.',
                                        tempo: 0,
                                    },
                                ]
                                dispatch(messageAction.setGuideScript(script))
                                console.log(error)
                            },
                            false
                        )
                        
                    } else {
                        console.log('?????')
                    }


                } else {
                    console.log("same!@!")
                }
            }

        }
    }, [saveAt])


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
                    <button onClick={()=>{dispatch(mainTextAction.setMainText("asdadasdsdas"))}}>zxc</button>
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
