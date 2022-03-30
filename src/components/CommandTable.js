import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { useHistory } from 'react-router-dom'
import { useCookies } from 'react-cookie'

import * as messageAction from '../actions/message'
import * as commandAction from '../actions/command'

import { useHotkeys } from 'react-hotkeys-hook'

const MainCommandTable = () => {
	const dispatch = useDispatch()

	const sendCommandList = useSelector(state => state.command.sendCommandList)
	const runCommandData = useSelector(state => state.command.runCommandData)

	const msgHistory = useSelector(state => state.message.msgHistory)
	const guideScript = useSelector(state => state.message.guideScript)
	const readOnly = useSelector(state => state.message.readOnly)

	const history = useHistory()

	const [cookies, setCookie, removeCookie] = useCookies()

	const tableRef = useRef(null)
	const inputRef = useRef(null)
	const [userInput, setUserInput] = useState('')

	const [inputHistory, setInputHistory] = useState([])
	const [inputHistoryCurrentAddress, setInputHistoryCurrentAddress] = useState(-100)

	// ===================================================
	const keyDownHandler = e => {
		if (!readOnly) {
			switch (e.keyCode) {
				case 9: // tab
					e.preventDefault()
					setUserInput(userInput + '\t')
					break
				case 13: // enter
					if (userInput == 'clear') {
						dispatch(messageAction.clearMsgHistory())
					} else {
						dispatch(messageAction.addMsgHistory('me:' + userInput))
						if (userInput.length != 0) {
							dispatch(commandAction.sendCommand(userInput, true))
						}
					}

					if (userInput.replace(/\s/g, '') && userInput != inputHistory[inputHistory.length - 1]) {
						setInputHistory(inputHistory.concat(userInput))
						setInputHistoryCurrentAddress(inputHistory.length + 1)
					} else {
						setInputHistoryCurrentAddress(inputHistory.length)
					}

					break
				case 27: // esc
					inputRef.current.blur()
					break
				case 38: // arrow up
					if (inputHistoryCurrentAddress > 0) {
						setInputHistoryCurrentAddress(inputHistoryCurrentAddress - 1)
					}
					break
				case 40: // arrow down
					if (inputHistoryCurrentAddress < inputHistory.length) {
						setInputHistoryCurrentAddress(inputHistoryCurrentAddress + 1)
					}
					break

				default:
					break
			}
		}
	}

	// ===================================================
	// 단축키 설정 -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	useHotkeys('enter', () => {
		inputRef.current.focus()
	})

	// ===================================================
	// useEffect -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
	useEffect(() => {
		if (cookies['user_id']) {
			dispatch(commandAction.sendCommand('ping', false))
			dispatch(commandAction.sendCommand('get textlist', false))
			dispatch(commandAction.sendCommand('load text', false))
			dispatch(commandAction.sendCommand('use text (current)', false))
		} else {
			history.push('/')
		}
	}, [])

	useEffect(() => {
		if (inputHistoryCurrentAddress == inputHistory.length) {
			setUserInput('')
		} else {
			setUserInput(inputHistory[inputHistoryCurrentAddress])
		}
	}, [inputHistoryCurrentAddress])

	useEffect(() => {
		const scroll = tableRef.current.scrollHeight - tableRef.current.clientHeight
		tableRef.current.scrollTo(0, scroll)
		setUserInput('')
	}, [msgHistory])

	const msgList = msgHistory.map((msg, index) => (
		<div key={index}>
			{msg.substr(0, 3) === 'me:' ? (
				<div style={{ minHeight: '25px', overflow: 'hidden', wordBreak: 'break-all', backgroundColor: 'pink' }}>
					&lt;{cookies['user_id']}&gt; {msg.substr(3)}
				</div>
			) : (
				<div
					dangerouslySetInnerHTML={{ __html: msg.substr(3) }}
					key={index}
					style={{ minHeight: '25px', overflow: 'hidden', wordBreak: 'break-all', backgroundColor: 'pink' }}
				></div>
			)}
		</div>
	))

	return (
		<div className="MainCommandTable">
			<div>
				<div
					ref={tableRef}
					style={{
						display: 'flex',
						width: '320px',
						height: '550px',
						backgroundColor: 'coral',
						overflow: 'auto',
						flexDirection: 'column-reverse',
					}}
				>
					<div>{msgList}</div>
				</div>

				<input
					ref={inputRef}
					type="text"
					style={{ width: '310px', height: '25px' }}
					onKeyDown={keyDownHandler}
					value={userInput}
					onChange={e => setUserInput(e.target.value)}
					readOnly={readOnly}
				/>

				{readOnly ? <div>readOnly true</div> : <div>readOnly false</div>}
			</div>
		</div>
	)
}

export default MainCommandTable
