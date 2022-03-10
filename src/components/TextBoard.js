import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import Editor from "@monaco-editor/react";
import ToggleSwitch from 'react-switch';

import * as boardTextAction from '../actions/boardText';
import * as commandAction from '../actions/command';

const MainBoard = () => {

    const history = useHistory()

    const dispatch = useDispatch()
    const boardText             = useSelector((state) => state.boardText.boardText)
    const currentTextTitle = useSelector((state) => state.boardText.currentTextTitle)
    const fontSize              = useSelector((state) => state.boardText.fontSize)
    
    const [cookies, setCookie, removeCookie] = useCookies()    

    const editorRef = useRef(null)
    const btnRef = useRef(null)
    
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
            dispatch(commandAction.sendCommand('save', true))
        })


        editorRef.current = editor
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
                        value={boardText}
                        theme="planet-theme"
                        loading="hello...?"
                        onChange={(newValue, e) => dispatch(boardTextAction.setBoardText(newValue))}
                        onMount={eMount}
                        options={options}
                    />

                    {/* <button onClick={()=>{history.push('/loading')}}>asdf</button> */}
                    <button ref={btnRef} onFocus={()=> {btnRef.current.blur()}}></button>

                    <br /> 
                    <br />
                    removeSpace &nbsp; &nbsp; 
                    <ToggleSwitch onChange={(checked) => setRemoveSpace(checked)} checked={removeSpace} />
                    
                    <h1>총 {removeSpace? boardText.replace(/\s/ig, "").length : boardText.length}자</h1>
                    <h2>{currentTextTitle}</h2>
                    {/* <h1>총  {removeSpace ? boardText.replace(/\s/ig, "").length : boardText.length}자</h1> */}
                    {/* <h1>총  {removeSpace ? boardText.replace(/\s/ig, "").length : boardText.replace(/\r?\n|\r/g, "").length}자</h1> 
                    줄바꿈 포함 */}
                </div>
            </div>
        </div>
    )
}

export default MainBoard;
