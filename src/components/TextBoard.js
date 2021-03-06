import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook'
import { useCookies } from 'react-cookie'

import Editor from '@monaco-editor/react'
import ToggleSwitch from 'react-switch'

import * as textAction from '../actions/text'
import * as commandAction from '../actions/command'

const MainBoard = () => {
	const dispatch = useDispatch()

	const boardText = useSelector(state => state.text.boardText)
	const currentTextTitle = useSelector(state => state.text.currentTextTitle)
	const fontSize = useSelector(state => state.text.fontSize)

	const [cookies, setCookie, removeCookie] = useCookies()

	const editorRef = useRef(null)
	const btnRef = useRef(null)

	const [removeSpace, setRemoveSpace] = useState(false)

	const eMount = (editor, monaco) => {
		monaco.languages.register({ id: 'planet' })
		monaco.languages.setMonarchTokensProvider('planet', {
			tokenizer: {
				root: [
					[/-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-/, 'week-line'],
					[/={3}\s\d{4}\/\d{2}\/\d{2}\s\={20}/, 'date-start-line'],
					[/\-{35}/, 'date-end-line'],
				],
			},
		})

		monaco.languages.registerCompletionItemProvider('planet', {
			provideCompletionItems: () => {
				var suggestions = [
					{
						label: 'weekLine',
						kind: monaco.languages.CompletionItemKind.Text,
						insertText: '-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-',
					},
					{
						label: 'date-start-line',
						kind: monaco.languages.CompletionItemKind.Keyword,
						insertText: '=== ${1:0000}/${2:00}/${3:00} ====================',
						insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
					},
					{
						label: 'date-end-line',
						kind: monaco.languages.CompletionItemKind.Text,
						insertText: '-----------------------------------',
					},
					{
						label: 'one-date-plan',
						kind: monaco.languages.CompletionItemKind.Keyword,
						insertText: ['=== ${1:0000}/${2:00}/${3:00} ====================', '', '', '1. ', '2. ', '3. ', '', '', '-----------------------------------'].join('\n'),
						insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
					},
				]

				return {
					suggestions: suggestions,
				}
			},
		})

		monaco.editor.defineTheme('planet-theme', {
			base: 'vs-dark',
			inherit: true,
			rules: [
				{
					token: 'week-line',
					foreground: '808080',
				},
				{
					token: 'date-start-line',
					foreground: 'ffffff',
					fontStyle: 'bold',
				},
				{
					token: 'date-end-line',
					foreground: 'FFA500',
				},
			],
			colors: {
				'editor.foreground': '#FFFFFF',
			},
		})
		monaco.editor.setTheme('planet-theme')

		editor.addCommand(monaco.KeyCode.Escape, () => {
			btnRef.current.focus()
			console.log('Escape!@!')
		})
		editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
			console.log('asd')
			dispatch(commandAction.sendCommand('save', true))
		})

		editorRef.current = editor
	}

	const [options, setOptions] = useState({
		minimap: {
			enabled: true,
		},
		quickSuggestions: {
			other: false,
			comments: false,
			strings: false,
		},
		fontSize: fontSize,
	})

	// ===================================================
	// ????????? ?????? -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	useHotkeys('insert', () => {
		editorRef.current.focus()
	})

	return (
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
						onChange={(newValue, e) => dispatch(textAction.setBoardText(newValue))}
						onMount={eMount}
						options={options}
					/>
					<button
						ref={btnRef}
						onFocus={() => {
							btnRef.current.blur()
						}}
						// style={{ visibility: 'hidden' }}
					></button>
					<br />
					<br />
					removeSpace &nbsp; &nbsp;
					<ToggleSwitch onChange={checked => setRemoveSpace(checked)} checked={removeSpace} />
					<h1>??? {removeSpace ? boardText.replace(/\s/gi, '').length : boardText.length}???</h1>
					{/* <h1>???  {removeSpace ? boardText.replace(/\s/ig, "").length : boardText.length}???</h1> */}
					{/* <h1>???  {removeSpace ? boardText.replace(/\s/ig, "").length : boardText.replace(/\r?\n|\r/g, "").length}???</h1> 
                    ????????? ?????? */}
				</div>
			</div>
		</div>
	)
}

export default MainBoard
