import React, { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useCookies } from 'react-cookie'

import _ from 'lodash'

import * as textAction from '../actions/text'
import * as messageAction from '../actions/message'
import * as commandAction from '../actions/command'
import * as memoAction from '../actions/memo'
import * as modeAction from '../actions/mode'

import { sendAxiosGet, sendAxiosPost } from '../api/sendAxios'

import { SERVER_CONNECT } from '../api/etcApiUrl'
import * as textApi from '../api/textApiUrl'

const wordFill = (str, len, word) => {
	let returnWord = str
	for (let index = str.length; index < len; index++) {
		returnWord = word + returnWord
	}

	return returnWord
}

const useCommandEvent = () => {
	const dispatch = useDispatch()
	const [cookies, setCookie, removeCookie] = useCookies()

	const sendCommandList = useSelector(state => state.command.sendCommandList)
	const next = useSelector(state => state.command.next)
	const runCommandData = useSelector(state => state.command.runCommandData)
	const commandCounter = useSelector(state => state.command.commandCounter)

	const boardText = useSelector(state => state.text.boardText)
	const currentTextTitle = useSelector(state => state.text.currentTextTitle)
	const textTitleList = useSelector(state => state.text.textTitleList)

	const useTextList = useSelector(state => state.memo.useTextList)
	const definedSortMode = useSelector(state => state.memo.definedSortMode)

	const guideScript = useSelector(state => state.message.guideScript)
	const normalTempo = useSelector(state => state.message.normalTempo)

	const weekFormat = useSelector(state => state.astronaut.weekFormat)

	const mode = useSelector(state => state.mode.mode)

	// ===================================================

	const getTextTitleList = useCallback(() => {
		let titleList = new Array()
		textTitleList.forEach(textTitle => {
			titleList.push(textTitle['text_title'])
		})

		return titleList
	}, [textTitleList])

	const getUseTextTitleList = useCallback(() => {
		let titleList = new Array()
		useTextList.forEach(useText => {
			titleList.push(useText['text_title'])
		})

		return titleList
	}, [useTextList])

	// ===================================================
	// API 서버 연결 확인하기
	const cmdPing = useCallback(() => {
		sendAxiosGet(
			SERVER_CONNECT,
			response => {
				dispatch(messageAction.setGuideScript(new Array({ say: 'connect', tempo: 0, last: true })))
			},
			error => {
				dispatch(messageAction.setGuideScript(new Array({ say: 'connect failed', tempo: 0, last: true })))
				console.log(error)
			},
			false,
		)
	}, [commandCounter['ping']])
	// ===================================================
	// load text | load text ({textTitle}) => 불러온 텍스트 boardText에 넣어줌
	const cmdLoadText = useCallback(() => {
		let script = [{ say: 'loading...', tempo: 600, last: false }]
		dispatch(messageAction.setGuideScript(script))
		dispatch(textAction.setBoardText('loading...'))

		const loadTextTitle = runCommandData['parameter'].length != 0 ? runCommandData['parameter'][0] : 'current'

		const dataContainer = {
			userId: cookies['user_id'],
			textTitle: loadTextTitle,
		}

		sendAxiosPost(
			textApi.GET_TEXT_BY_TEXT_TITLE,
			dataContainer,
			response => {
				const text = response.data[0]['text_content']

				dispatch(textAction.setBoardText(text))
				dispatch(textAction.setCurrentTextTitle(loadTextTitle))

				let script = [{ say: '!@!@!@!@!@!@!@!@!@!', tempo: 1000, last: true }]
				dispatch(messageAction.setGuideScript(script))
			},
			error => {
				console.log(error)
				let script = [{ say: 'failed', tempo: 0, last: true }]
				dispatch(messageAction.setGuideScript(script))
			},
			false,
		)
	}, [commandCounter['load+text']])
	// ===================================================
	// get textlist => 사용자의 모든 텍스트 데이터를 불러옴
	const cmdGetTextList = useCallback(() => {
		const dataContainer = {
			userId: cookies['user_id'],
		}

		sendAxiosPost(
			textApi.GET_TEXT_TITLE_LIST,
			dataContainer,
			response => {
				dispatch(textAction.setTextTitleList(response.data))
				let script = [
					{ say: 'Completed', tempo: 0 + 600, last: false },
					{ say: '!@!!@!@!@21', tempo: normalTempo + 600, last: true },
				]
				dispatch(messageAction.setGuideScript(script))
			},
			error => {
				console.log(error)
				let script = [
					{ say: 'failed', tempo: 0, last: false },
					{ say: '!@!!@!@!@21', tempo: normalTempo, last: true },
				]
				dispatch(messageAction.setGuideScript(script))
			},
			false,
		)
	}, [commandCounter['get+textlist']])
	// ===================================================
	// save => 현재 textBoard에 있는 내용을 db에 저장
	const cmdSave = useCallback(() => {
		let script = [{ say: 'Saving...', tempo: 0, last: false }]
		dispatch(messageAction.setGuideScript(script))

		const dataContainer = {
			userId: cookies['user_id'],
			text: boardText,
			textTitle: currentTextTitle,
		}

		sendAxiosPost(
			textApi.SAVE,
			dataContainer,
			response => {
				let nextCommandList = new Array()
				nextCommandList.push({ command: 'get textlist', say: false })
				if (useTextList == undefined || useTextList.length == 0) {
					nextCommandList.push({ command: 'use text (current)', say: false })
				} else {
					let parameterStr = getUseTextTitleList().join(',')
					nextCommandList.push({ command: `use text (${parameterStr})`, say: false })
				}
				dispatch(commandAction.nextCommand(nextCommandList))

				dispatch(messageAction.setGuideScript(new Array({ say: 'Save Completed', tempo: 0, last: true })))
			},
			error => {
				dispatch(messageAction.setGuideScript(new Array({ say: 'Save failed.', tempo: 0, last: true })))
				console.log(error)
			},
			false,
		)
	}, [commandCounter['save']])

	// ===================================================
	// save as ({textTitle}) => current가 {textTitle}로 바뀌어서 db에 저장되고 또 다른 current가 생성됨.
	const cmdSaveAs = useCallback(() => {
		if (runCommandData['parameter'][0] == 'current') {
			let script = [{ say: "'current' not allowed", tempo: normalTempo, last: true }]
			dispatch(messageAction.setGuideScript(script))
		} else if (currentTextTitle != 'current') {
			let script = [{ say: "lt's not current.", tempo: normalTempo, last: true }]
			dispatch(messageAction.setGuideScript(script))
		} else {
			const dataContainer = {
				userId: cookies['user_id'],
				text: boardText,
				textTitle: runCommandData['parameter'][0],
			}

			sendAxiosPost(
				textApi.SAVE_AS,
				dataContainer,
				response => {
					let nextCommandList = new Array()

					nextCommandList.push({ command: 'get textlist', say: false })

					if (useTextList == undefined || useTextList.length == 0) {
						nextCommandList.push({ command: 'use text (current)', say: false })
					} else {
						let parameterStr = getUseTextTitleList().join(',')
						parameterStr += ',' + runCommandData['parameter'][0]
						nextCommandList.push({ command: `use text (${parameterStr})`, say: false })
					}
					dispatch(commandAction.nextCommand(nextCommandList))

					let script = [{ say: 'Save as Completed.', tempo: 0, last: true }]
					dispatch(messageAction.setGuideScript(script))
				},
				error => {
					let script = [{ say: 'Save as failed.', tempo: 0, last: true }]
					dispatch(messageAction.setGuideScript(script))
					console.log(error)
				},
				false,
			)
		}
	}, [commandCounter['save+as']])
	// ===================================================
	// renam text title ({textTitle}, {newTextTitle}) => 텍스트 테이터 title을 바꿔줌
	// {textTitle}, {newTextTitle} 모두 current는 사용할 수 없음
	const cmdRenameTextTitle = useCallback(() => {
		let textTitle = runCommandData['parameter'][0]
		let newTextTitle = runCommandData['parameter'][1]

		if (textTitle == 'current' || newTextTitle == 'current') {
			let script = [
				{ say: 'current', tempo: normalTempo, last: false },
				{ say: 'not', tempo: normalTempo, last: false },
				{ say: 'allowed.', tempo: normalTempo, last: true },
			]

			dispatch(messageAction.setGuideScript(script))
		} else {
			const dataContainer = {
				userId: cookies['user_id'],
				textTitle: textTitle,
				newTextTitle: newTextTitle,
			}

			sendAxiosPost(
				textApi.RENAME_TEXT_TITLE,
				dataContainer,
				response => {
					dispatch(memoAction.updateUseTextTitle(textTitle, newTextTitle))

					dispatch(commandAction.nextCommand({ command: 'get textlist', say: false }))

					let script = [{ say: 'Completed', tempo: 0, last: true }]
					dispatch(messageAction.setGuideScript(script))
				},
				error => {
					console.log(error)
					let script = [{ say: 'failed', tempo: 0, last: true }]
					dispatch(messageAction.setGuideScript(script))
				},
				false,
			)
		}
	}, [commandCounter['rename+text+title']])
	// ===================================================
	// use text ({textTitle}, ...) =>  memoTable에서 보여질 텍스트 데이터들를 불러옴
	const cmdUseText = useCallback(() => {
		if (runCommandData['parameter'].length == 0) {
			let script = [{ say: '???', tempo: normalTempo, last: true }]
			dispatch(messageAction.setGuideScript(script))
		} else {
			let textTitleList1 = getTextTitleList()

			let sendTextTitleList = runCommandData['parameter']
			let notExistedTitleList = []
			for (let index = 0; index < sendTextTitleList.length; index++) {
				if (!textTitleList1.includes(sendTextTitleList[index])) {
					notExistedTitleList.push(sendTextTitleList[index])
				}
			}

			if (notExistedTitleList.length != 0) {
				let script = [{ say: 'Hmm...', tempo: normalTempo, last: false }]
				for (let index = 0; index < notExistedTitleList.length; index++) {
					script.push({ say: notExistedTitleList[index], tempo: normalTempo, last: false })
				}

				script.push({ say: "These don't exist. --;;", tempo: normalTempo, last: true })
				dispatch(messageAction.setGuideScript(script))
			} else {
				const dataContainer = {
					userId: cookies['user_id'],
					textTitleList: sendTextTitleList,
				}

				sendAxiosPost(
					textApi.GET_TEXT_LIST,
					dataContainer,
					response => {
						dispatch(memoAction.setUseTextList(response.data))

						let script = [{ say: 'Completeddddd', tempo: normalTempo, last: true }]
						dispatch(messageAction.setGuideScript(script))
					},
					error => {
						let script = [{ say: 'failed', tempo: normalTempo, last: true }]
						dispatch(messageAction.setGuideScript(script))
						console.log(error)
					},
					false,
				)
			}
		}
	}, [commandCounter['use+text']])
	// // ===================================================
	//
	const cmdAddUseText = useCallback(() => {
		let script = new Array()
		let titleList = getTextTitleList()
		let useTitleList = getUseTextTitleList()

		let addTextTitleList = new Array()

		if (runCommandData['parameter'].length != 0) {
			runCommandData['parameter'].forEach(title => {
				let state = ''

				if (!titleList.includes(title)) {
					state = ' not exist'
				} else if (!useTitleList.includes(title)) {
					addTextTitleList.push(title)
					state = ' add'
				} else {
					state = ' already used.'
				}

				script.push({ say: `${title}, ${state}`, tempo: normalTempo, last: false })
			})

			const dataContainer = {
				userId: cookies['user_id'],
				textTitleList: addTextTitleList,
			}

			sendAxiosPost(
				textApi.GET_TEXT_LIST,
				dataContainer,
				response => {
					const addedUseTextList = useTextList.concat(response.data)
					dispatch(memoAction.setUseTextList(addedUseTextList))

					dispatch(messageAction.setGuideScript(script))
				},
				error => {
					let script = [{ say: 'failed', tempo: normalTempo, last: true }]
					dispatch(messageAction.setGuideScript(script))
					console.log(error)
				},
				false,
			)
		} else {
			script = [{ say: '?????', tempo: normalTempo, last: true }]
		}
	}, [commandCounter['add+use+text']])
	// ===================================================
	//
	const cmdRemoveUseText = useCallback(() => {
		let removeTitleList = runCommandData['parameter']

		const removeFilter = useText => {
			return !removeTitleList.includes(useText['text_title'])
		}

		const removedUseTextList = useTextList.filter(removeFilter)

		dispatch(memoAction.setUseTextList(removedUseTextList))
	}, [commandCounter['remove+use+text']])
	// ===================================================
	// sort memo ({weekOrderBy}, {daySortMode}, {dayReverse}) => memoTable에서 보여질 데이터들을 사용자가 보기 쉽게 정렬을 바꿔줌
	const cmdSortMemo = useCallback(() => {
		let weekOrderBy = runCommandData['parameter'][0]
		let daySortMode = runCommandData['parameter'][1]
		let dayReverse = JSON.parse(runCommandData['parameter'][2].toLowerCase())

		let script = []

		if (weekOrderBy in definedSortMode['week']['orderBy']) {
			script = [{ say: `" ${weekOrderBy} " not allowed`, tempo: normalTempo, last: true }]
		} else if (daySortMode in definedSortMode['day']['sort']) {
			script = [{ say: `" ${daySortMode} " not allowed`, tempo: normalTempo, last: true }]
		} else if (dayReverse in definedSortMode['day']['reverse']) {
			script = [{ say: `" ${dayReverse} " not allowed`, tempo: normalTempo, last: true }]
		} else {
			dispatch(
				memoAction.setSortMode({
					week: { orderBy: weekOrderBy },
					day: { sort: daySortMode, reverse: dayReverse },
				}),
			)
			script = [{ say: 'sorttttttttt', tempo: normalTempo, last: true }]
		}

		dispatch(messageAction.setGuideScript(script))
	}, [commandCounter['sort+memo']])
	// ===================================================
	// show title => say-현재 textBoard에 들어있는 덱스트 데이터 title
	const cmdShowTitle = useCallback(() => {
		const script = [{ say: currentTextTitle, tempo: normalTempo, last: true }]
		dispatch(messageAction.setGuideScript(script))
	}, [commandCounter['show+title']])
	// ===================================================
	// show use text => 현재 memoTable에서 사용하고 있는 덱스트 데이터 Title들을 보여줌.
	const cmdShowUseText = useCallback(() => {
		let script = []
		let useTextTitleList = getUseTextTitleList()

		if (useTextTitleList.length == 0) {
			script.push({ say: '"empty."', tempo: normalTempo, last: true })
		} else {
			for (let index = 0; index < useTextTitleList.length; index++) {
				if (index == useTextTitleList.length - 1) {
					script.push({ say: useTextTitleList[index], tempo: normalTempo, last: true })
				} else {
					script.push({ say: useTextTitleList[index], tempo: normalTempo, last: false })
				}
			}
		}

		dispatch(messageAction.setGuideScript(script))
	}, [commandCounter['show+use+text']])
	// ===================================================
	// mainContent에 있는 component 바꾸기/ mode 바꾸기
	const cmdSetMode = useCallback(() => {
		let changeMode = runCommandData['parameter'][0]
		let script = []

		if (changeMode in mode) {
			dispatch(modeAction.setCurrentMode(changeMode))
			script = [{ say: 'change!', tempo: normalTempo, last: true }]
		} else {
			script = [{ say: changeMode + ' mode does not exist.', tempo: normalTempo, last: true }]
		}

		dispatch(messageAction.setGuideScript(script))
	}, [commandCounter['set+mode']])
	// ===================================================
	// return 현재 시간
	// ex) PM 02:08:33
	const cmdNow = useCallback(() => {
		let getToday = new Date()

		let hours = getToday.getHours()
		let ampm = hours < 12 ? '  AM' : '  PM'

		hours = hours <= 12 ? hours : hours - 12
		hours = wordFill(hours.toString(), 2, '0')

		let minutes = wordFill(getToday.getMinutes().toString(), 2, '0')
		let seconds = wordFill(getToday.getSeconds().toString(), 2, '0')

		let now = ampm + '  ' + hours + ':' + minutes + ':' + seconds

		let script = [{ say: now, tempo: normalTempo, last: true }]
		dispatch(messageAction.setGuideScript(script))
	}, [commandCounter['now']])
	// ===================================================
	// return 현재 날짜
	// ex) 2021-08-30 THU
	const cmdToday = useCallback(() => {
		let today = new Date()
		let year = today.getFullYear()
		let month = wordFill((today.getMonth() + 1).toString(), 2, '0')
		let date = wordFill(today.getDate().toString(), 2, '0')
		let day = weekFormat[today.getDay()]

		today = year + '-' + month + '-' + date + ' ' + day

		let script = [{ say: today, tempo: normalTempo, last: true }]
		dispatch(messageAction.setGuideScript(script))
	}, [commandCounter['today']])
	// ===================================================
	// input : get week (year, month, date)
	// return 특정 날짜의 요일
	// ex) 2021-08-30 was... / THU
	const cmdGetWeek = useCallback(() => {
		let year = runCommandData['parameter'][0]
		let month = runCommandData['parameter'][1]
		let date = runCommandData['parameter'][2]

		const that_day = new Date()
		that_day.setFullYear(year)
		that_day.setMonth(month - 1)
		that_day.setDate(date)

		year = wordFill(that_day.getFullYear().toString(), 4, '0')
		month = wordFill((that_day.getMonth() + 1).toString(), 2, '0')
		date = wordFill(that_day.getDate().toString(), 2, '0')

		let script = []

		script[0] = {}
		script[1] = { say: weekFormat[that_day.getDay()], tempo: normalTempo, last: true }

		const now = new Date()

		if (now.getFullYear() <= that_day.getFullYear() && now.getMonth() <= that_day.getMonth() && now.getDate() < that_day.getDate()) {
			script[0] = { say: `${year}-${month}-${date} is...`, tempo: normalTempo, last: false }
		} else if (now.getFullYear() === that_day.getFullYear() && now.getMonth() === that_day.getMonth() && now.getDate() === that_day.getDate()) {
			script[0] = { say: `${year}-${month}-${date} today is...`, tempo: normalTempo, last: false }
		} else if (that_day.getFullYear() < 0) {
			script[0] = {
				say: `B.C. &nbsp;${wordFill(Math.abs(that_day.getFullYear()).toString(), 4, '0')}-${month}-${date} was...`,
				tempo: normalTempo,
				last: false,
			}
		} else {
			script[0] = { say: `${year}-${month}-${date} was...`, tempo: normalTempo, last: false }
		}

		dispatch(messageAction.setGuideScript(script))
	}, [commandCounter['get+week']])

	// ===================================================

	const noneParameter = useCallback(
		parameter => {
			if (parameter.length != 0) {
				const script = new Array()
				dispatch(messageAction.setGuideScript(script))
				return false
			} else {
				return true
			}
		},
		[runCommandData['parameter']],
	)

	const parametersExisted = useCallback(
		parameter => {
			if (parameter.length <= 0) {
				const script = new Array()
				dispatch(messageAction.setGuideScript(script))
				return false
			} else {
				return true
			}
		},
		[runCommandData['parameter']],
	)

	const parametersRange = useCallback(
		(parameter, min, max) => {
			if (parameter.length < min || parameter.length > max) {
				let script = new Array()

				if (parameter.length < min) {
					script.push()
				} else if (parameter.length > max) {
					script.push()
				}

				dispatch(messageAction.setGuideScript(script))
				return false
			} else {
				return true
			}
		},
		[runCommandData['parameter']],
	)

	const correctNumOfParameters = useCallback(
		(parameter, ...rightNum) => {
			if (!rightNum.includes(parameter.length)) {
				let script = new Array()
				dispatch(messageAction.setGuideScript(script))

				return false
			} else {
				return true
			}
		},
		[runCommandData['parameter']],
	)

	const parameterFilter = useCallback(
		(commandType, parameter) => {
			switch (commandType) {
				case '':
					break
			}
		},
		[runCommandData['commandType'], runCommandData['parameter']],
	)

	// ===================================================

	const sleep = ms => {
		return new Promise((resolve, reject) => {
			setTimeout(resolve, ms)
		})
	}

	const guideSay = async script => {
		for (let index = 0; index < script.length; index++) {
			if (runCommandData['say']) {
				await sleep(script[index]['tempo'])
				dispatch(messageAction.addMsgHistory('gu:' + script[index]['say']))
			}

			if (script[index]['last']) {
				dispatch(commandAction.setNext(true))

				if (sendCommandList.length <= 1) {
					dispatch(messageAction.setReadOnly(false))
				}
			}
		}
	}

	// ===================================================
	// useEffect -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

	useEffect(() => {
		if (guideScript && guideScript.length != 0) {
			dispatch(messageAction.setReadOnly(true))
			guideSay(guideScript)
		}
	}, [guideScript])

	useEffect(() => {
		if (next && sendCommandList.length != 0) {
			dispatch(commandAction.setNext(false))
			dispatch(commandAction.runCommand(sendCommandList[0]['commandType'], sendCommandList[0]['parameter'], sendCommandList[0]['say']))
			dispatch(commandAction.countCommand(sendCommandList[0]['commandType']))
			dispatch(commandAction.shiftSendCommandList())
		}
	}, [next, sendCommandList])

	useEffect(() => {
		if (runCommandData['commandType'] != undefined) {
			switch (runCommandData['commandType']) {
				case 'now':
					cmdNow()
					break
				case 'today':
					cmdToday()
					break

				case 'ping':
					cmdPing()
					break

				// get
				case 'get+week':
					cmdGetWeek()
					break
				case 'get+textlist':
					cmdGetTextList()
					break

				// load
				case 'load+text':
					cmdLoadText()
					break

				// set
				case 'set+mode':
					cmdSetMode()
					break

				// save
				case 'save':
					cmdSave()
					break
				case 'save+as':
					cmdSaveAs()
					break

				// use
				case 'use+text':
					cmdUseText()
					break

				// add
				case 'add+use+text':
					cmdAddUseText()
					break

				// remove
				case 'remove+use+text':
					cmdRemoveUseText()
					break

				// sort
				case 'sort+memo':
					cmdSortMemo()
					break

				// show
				case 'show+title':
					cmdShowTitle()
					break
				case 'show+use+text':
					cmdShowUseText()
					break

				// rename
				case 'rename+text+title':
					cmdRenameTextTitle()
					break
			}
		}
	}, [commandCounter])
}

export default useCommandEvent
