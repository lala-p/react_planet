import React, { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useCookies } from 'react-cookie'

import * as boardTextAction from '../actions/boardText'
import * as messageAction from '../actions/message'
import * as commandAction from '../actions/command'
import * as memoAction from '../actions/memo'
import * as modeAction from '../actions/mode'

import { sendAxiosGet, sendAxiosPost } from '../api/sendAxios'

import { SERVER_CONNECT } from '../api/etcApiUrl'
import * as textApi from '../api/textApiUrl'

import { findVer01 } from '../find/ver_01'

import _ from 'lodash'


const wordFill = (str, len, word) => {
	let returnWord = str
	for (let index = str.length; index < len; index++) {
		returnWord = word + returnWord
	}

	return returnWord
}

const CommandEvent = () => {
	const dispatch = useDispatch()
	const [cookies, setCookie, removeCookie] = useCookies()

	const sendCommandList = useSelector(state => state.command.sendCommandList)
	const next = useSelector(state => state.command.next)
	const runCommandData = useSelector(state => state.command.runCommandData)
	const commandCounter = useSelector(state => state.command.commandCounter)

	const boardText = useSelector(state => state.boardText.boardText)
	const currentTextTitle = useSelector(state => state.boardText.currentTextTitle)
	const textTitleList = useSelector(state => state.boardText.textTitleList)

	const useTextList = useSelector(state => state.memo.useTextList)
	const memoDataList = useSelector(state => state.memo.memoDataList)
	const definedSortMode = useSelector(state => state.memo.definedSortMode)
	const sortMode = useSelector(state => state.memo.sortMode)
	const useDays = useSelector(state => state.memo.useDays)

	const normalTempo = useSelector(state => state.message.normalTempo)

	const week = useSelector(state => state.astronaut.weekFormat)

	const mode = useSelector(state => state.mode.mode)


	// ===================================================
	// API 서버 연결 확인하기
	const cmdPing = useCallback(() => {
		sendAxiosGet(
			SERVER_CONNECT,
			response => {
				let script = [{ say: 'connect', tempo: 0, last: true }]
				dispatch(messageAction.setGuideScript(script))
			},
			error => {
				let script = [{ say: 'connect failed', tempo: 0, last: true }]
				dispatch(messageAction.setGuideScript(script))
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
		dispatch(boardTextAction.setBoardText('loading...'))

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

				dispatch(boardTextAction.setBoardText(text))
				dispatch(boardTextAction.setCurrentTextTitle(loadTextTitle))
				let script = [{ say: '!@!@!@!@!@!@!@!@!@!', tempo: 1000, last: true }]
				if (runCommandData['say']) {
					dispatch(messageAction.setGuideScript(script))
				}
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
				dispatch(boardTextAction.setTextTitleList(response.data))
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
				let script = [{ say: 'Save Completed', tempo: 0, last: true }]
				dispatch(messageAction.setGuideScript(script))

				dispatch(commandAction.sendCommand('get textlist', false))

				if (useTextList == undefined || useTextList.length == 0) {
					dispatch(commandAction.sendCommand('use text (current)', false))
				} else {
					let parameterStr = ''
					parameterStr += useTextList[0]['text_title']

					for (let index = 1; index < useTextList.length; index++) {
						parameterStr += ', ' + useTextList[index]['text_title']
					}
					dispatch(commandAction.sendCommand(`use text (${parameterStr}')`, false))
				}
			},
			error => {
				let script = [{ say: 'Save failed.', tempo: 0, last: true }]
				dispatch(messageAction.setGuideScript(script))

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
					let script = [{ say: 'Save as Completed.', tempo: 0, last: true }]
					dispatch(messageAction.setGuideScript(script))
					dispatch(commandAction.sendCommand('get textlist', false))
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
	// use text ({textTitle}, ...) =>  memoTable에서 보여질 텍스트 데이터들를 불러옴
	const cmdUseText = useCallback(() => {
		if (runCommandData['parameter'].length == 0) {
			let script = [{ say: '???', tempo: normalTempo, last: true }]
			dispatch(messageAction.setGuideScript(script))
		} else {
			let textTitleList2 = []
			for (let index = 0; index < textTitleList.length; index++) {
				textTitleList2.push(textTitleList[index]['text_title'])
			}

			let sendTextTitleList = runCommandData['parameter']
			let notExistedTitleList = []
			for (let index = 0; index < sendTextTitleList.length; index++) {
				if (!textTitleList2.includes(sendTextTitleList[index])) {
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

						let script = [{ say: 'Completed', tempo: normalTempo, last: true }]
						dispatch(messageAction.setGuideScript(script))

						const MemoDataList = getMemoDataList(response.data)
						dispatch(memoAction.setMemoDataList(MemoDataList))
						dispatch(commandAction.sendCommand(`sort memo (${sortMode['week']['orderBy']}, ${sortMode['day']['sort']}, ${sortMode['day']['reverse']})`, false))
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

	const getMemoDataList = data => {
		/* 
		input => 
			=== 2022/03/16 ====================


			1. a 
			2. b
			3. c
    
		    
			-----------------------------------
			...

		return => 
			[{
				title   : {titie}
				date    : {2022/03/16}
				day     : 3
				planList: Array(3)
				etc     : Array(0) 
			}, 
			...]
	*/

		let memoDataList = []
		let textList = data.slice()

		for (let index = 0; index < textList.length; index++) {
			const textTitle = textList[index]['text_title']

			let textContent = textList[index]['text_content']
			textContent = textContent.replace(findVer01['global']['baseLine']['weekLine'], '')

			let dayTextList = textContent.split(findVer01['global']['baseLine']['dateEndLine'])
			dayTextList.pop()
			for (let index1 = 0; index1 < dayTextList.length; index1++) {
				let dayText = dayTextList[index1]

				if (new RegExp(findVer01['global']['baseLine']['dateStartLine']).test(dayText)) {
					// ?????????
					let dayData = {
						title: textTitle,
						date: '',
						day: -1,
						planList: [],
						etc: [],
					}

					let date = dayText.match(findVer01['global']['find']['date'])
					let day = new Date(date).getDay()

					let etcList = dayText.split(findVer01['global']['rules']['etc'])
					etcList.shift()
					etcList.forEach(etc => {
						dayText = dayText.replace('+' + etc, '')
					})

					let planDataList = []
					let planTextList = dayText.split(findVer01['global']['rules']['plan'])
					planTextList.shift()
					for (let index2 = 0; index2 < planTextList.length; index2++) {
						let planText = planTextList[index2]
						let planData = {
							plan: '',
							state: 0,
							info: [],
							conclusion: [],
						}

						let infoList = planText.split(findVer01['global']['rules']['info'])
						infoList.shift()
						planText = planText.replace(findVer01['global']['rules']['info'], '')
						infoList.forEach(info => {
							planText = planText.replace(info, '')
						})

						let conclusionList = planText.split(findVer01['global']['rules']['conclusion'])
						conclusionList.shift()
						planText = planText.replace(findVer01['global']['rules']['conclusion'], '')
						conclusionList.forEach(conclusion => {
							planText = planText.replace(conclusion, '')
						})

						let state = 0
						if (findVer01['global']['find']['planSuccess'].test(planText)) {
							state = 1
							planText = planText.replace(findVer01['global']['find']['planSuccess'], '')
						} else if (findVer01['global']['find']['planFailed'].test(planText)) {
							state = 2
							planText = planText.replace(findVer01['global']['find']['planFailed'], '')
						} else if (findVer01['global']['find']['planDelay'].test(planText)) {
							state = 3
							planText = planText.replace(findVer01['global']['find']['planDelay'], '')
						} else if (findVer01['global']['find']['planSomeday'].test(planText)) {
							state = 4
							planText = planText.replace(findVer01['global']['find']['planSomeday'], '')
						}

						planData['plan'] = planText
						planData['state'] = state
						planData['info'] = infoList
						planData['conclusion'] = conclusionList

						planDataList.push(planData)
					}

					dayData['date'] = date[0]
					dayData['day'] = day
					dayData['planList'] = planDataList
					dayData['etc'] = etcList

					memoDataList.push(dayData)
				}
			}
		}
		return memoDataList
	}
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
			console.log()

			let sortedMemoDataList = []
			sortedMemoDataList = memoDataList.slice()
			sortedMemoDataList = sortedMemoDataList.sort((a, b) => new Date(a.date) - new Date(b.date))

			let weekList = []
			let weekNum = 0

			switch (daySortMode) {
				case 'normal':
					let maxWeekDays = 0

					for (let index = 0; index < 7; index++) {
						if (useDays[index]) {
							maxWeekDays += 1
						}
					}

					weekList.push(new Array())
					weekList[0].push(sortedMemoDataList[0])

					for (let index = 1; index < sortedMemoDataList.length; index++) {
						const previousData = sortedMemoDataList[index - 1]
						const currentData = sortedMemoDataList[index]

						const min = new Date(previousData['date']) < new Date(currentData['date']) ? previousData : currentData
						const max = new Date(previousData['date']) < new Date(currentData['date']) ? currentData : previousData

						const isSameWeek =
							Math.ceil(new Date(max['date']).getTime() / (1000 * 60 * 60 * 24)) -
							(Math.ceil(new Date(min['date']).getTime() / (1000 * 60 * 60 * 24)) + (7 - (min['day'] == 0 ? 7 : min['day']))) <=
							0

						if (!isSameWeek) {
							if (weekList[weekNum].length != maxWeekDays) {
								for (let index = weekList[weekNum].length; index < maxWeekDays; index++) {
									weekList[weekNum].push(false)
								}
							}

							weekList.push(new Array())
							weekNum += 1
						}

						if (useDays[currentData['day']]) {
							if (dayReverse) {
								weekList[weekNum].unshift(currentData)
							} else {
								weekList[weekNum].push(currentData)
							}
						}
					}

					if (weekList[weekNum].length != maxWeekDays) {
						for (let index = weekList[weekNum].length; index < maxWeekDays; index++) {
							weekList[weekNum].push(false)
						}
					}

					break

				case 'calendar':
					let oneWeek = _.cloneDeep(useDays)
					for (let index = 0; index < 7; index++) {
						if (useDays[index]) {
							oneWeek[index] = false
						} else {
							delete oneWeek[index]
						}
					}

					weekList.push(_.cloneDeep(oneWeek))

					let address = 0
					while (address < sortedMemoDataList.length) {
						if (useDays[sortedMemoDataList[address]['day']]) {
							weekList[0][sortedMemoDataList[address]['day']] = sortedMemoDataList[address]
							break
						} else {
							address += 1
						}
					}

					for (let index = address + 1; index < sortedMemoDataList.length; index++) {
						const previousData = sortedMemoDataList[index - 1]
						const currentData = sortedMemoDataList[index]

						const min = new Date(previousData['date']) < new Date(currentData['date']) ? previousData : currentData
						const max = new Date(previousData['date']) < new Date(currentData['date']) ? currentData : previousData

						const isSameWeek =
							Math.ceil(new Date(max['date']).getTime() / (1000 * 60 * 60 * 24)) -
							(Math.ceil(new Date(min['date']).getTime() / (1000 * 60 * 60 * 24)) + (7 - (min['day'] == 0 ? 7 : min['day']))) <=
							0

						if (!isSameWeek) {
							weekList[weekNum] = Object.values(weekList[weekNum])
							if (dayReverse) {
								weekList[weekNum] = weekList[weekNum].reverse()
							}

							weekList.push(_.cloneDeep(oneWeek))
							weekNum += 1
						}

						if (useDays[currentData['day']]) {
							weekList[weekNum][currentData['day']] = currentData
						}
					}

					if (!Array.isArray(weekList[weekList.length - 1])) {
						weekList[weekNum] = Object.values(weekList[weekNum])
						if (dayReverse) {
							weekList[weekNum] = weekList[weekNum].reverse()
						}
					}

					break
			}

			if (weekOrderBy == 'desc') {
				weekList = weekList.reverse()
			}

			sortedMemoDataList = weekList
			console.log(sortedMemoDataList)
			dispatch(memoAction.setSortedMemoDataList(sortedMemoDataList))

			script = [{ say: 'sorttttttttt', tempo: normalTempo, last: true }]
		}

		dispatch(messageAction.setGuideScript(script))
	}, [commandCounter['sort+memo']])
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
					let script = [{ say: 'Completed', tempo: 0, last: true }]
					dispatch(messageAction.setGuideScript(script))
					dispatch(commandAction.sendCommand('get textlist', false))
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
	// show title => say-현재 textBoard에 들어있는 덱스트 데이터 title
	const cmdShowTitle = useCallback(() => {
		const script = [{ say: currentTextTitle, tempo: normalTempo, last: true }]
		dispatch(messageAction.setGuideScript(script))
	}, [commandCounter['show+title']])
	// ===================================================
	// show use text => 현재 memoTable에서 사용하고 있는 덱스트 데이터 Title들을 보여줌.
	const cmdShowUseText = useCallback(() => {
		let script = []

		for (let index = 0; index < useTextList.length; index++) {
			if (index == useTextList.length - 1) {
				script.push({ say: useTextList[index]['text_title'], tempo: normalTempo, last: true })
			} else {
				script.push({ say: useTextList[index]['text_title'], tempo: normalTempo, last: false })
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
		let day = week[today.getDay()]

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
		script[1] = { say: week[that_day.getDay()], tempo: normalTempo, last: true }

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
	// useEffect -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

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

	return <></>
}

export default CommandEvent
