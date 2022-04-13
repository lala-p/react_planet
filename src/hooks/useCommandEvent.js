import React, { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useCookies } from 'react-cookie'

import _ from 'lodash'

import useGuideEvent from './useGuideEvent'

import * as textAction from '../actions/text'
import * as messageAction from '../actions/message'
import * as commandAction from '../actions/command'
import * as memoAction from '../actions/memo'
import * as modeAction from '../actions/mode'

import { sendAxiosGet, sendAxiosPost } from '../api/sendAxios'

import apiUrl from '../api/apiUrl'

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
		let script = new Array()

		sendAxiosGet(
			apiUrl.server.get.SERVER_CONNECT,
			response => {
				script.push({ say: 'connect', tempo: 0 })
			},
			error => {
				console.log(error)
				script.push({ say: 'connect failed', tempo: 0 })
			},
			() => {
				script.push(false)
				dispatch(messageAction.setGuideScript(script))
			},
		)
	}, [commandCounter['ping']])
	// ===================================================
	// load text | load text ({textTitle}) => 불러온 텍스트 boardText에 넣어줌
	const cmdLoadText = useCallback(
		loadTextTitle => {
			let script = new Array()
			script.push({ say: 'loading...', tempo: 600 })

			dispatch(messageAction.setGuideScript(script))
			dispatch(textAction.setBoardText('loading...'))
			script = new Array()

			const dataContainer = {
				userId: cookies['user_id'],
				textTitleList: new Array(loadTextTitle),
			}

			sendAxiosPost(
				apiUrl.text.post.GET_TEXT_LIST,
				dataContainer,
				response => {
					const text = response.data[0]['text_content']

					dispatch(textAction.setBoardText(text))
					dispatch(textAction.setCurrentTextTitle(loadTextTitle))

					script.push({ say: '!@!@!@!@!@!@!@!@!@!', tempo: 1000 })
				},
				error => {
					console.log(error)
					script.push({ say: 'failed', tempo: 0 })
				},
				() => {
					script.push(false)
					dispatch(messageAction.setGuideScript(script))
				},
			)
		},
		[commandCounter['load+text']],
	)
	// ===================================================
	// get textlist => 사용자의 모든 텍스트 데이터를 불러옴
	const cmdGetTextList = useCallback(() => {
		let script = new Array()

		const dataContainer = {
			userId: cookies['user_id'],
		}

		sendAxiosPost(
			apiUrl.text.post.GET_TEXT_TITLE_LIST,
			dataContainer,
			response => {
				dispatch(textAction.setTextTitleList(response.data))

				script.push({ say: 'Completed', tempo: 0 + 600 })
				script.push({ say: '!@!!@!@!@21', tempo: normalTempo + 600 })
			},
			error => {
				console.log(error)

				script.push({ say: 'failed', tempo: 0 })
				script.push({ say: '!@!!@!@!@21', tempo: normalTempo })
			},
			() => {
				script.push(false)
				dispatch(messageAction.setGuideScript(script))
			},
		)
	}, [commandCounter['get+textlist']])
	// ===================================================
	// save => 현재 textBoard에 있는 내용을 db에 저장
	const cmdSave = useCallback(() => {
		let script = new Array()
		script.push({ say: 'Saving...', tempo: 0 })

		dispatch(messageAction.setGuideScript(script))
		script = new Array()

		const dataContainer = {
			userId: cookies['user_id'],
			text: boardText,
			textTitle: currentTextTitle,
		}

		sendAxiosPost(
			apiUrl.text.post.SAVE,
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

				script.push({ say: 'Save Completed', tempo: 0 })
			},
			error => {
				console.log(error)
				script.push({ say: 'Save failed.', tempo: 0 })
			},
			() => {
				script.push(false)
				dispatch(messageAction.setGuideScript(script))
			},
		)
	}, [commandCounter['save']])

	// ===================================================
	// save as ({textTitle}) => current가 {textTitle}로 바뀌어서 db에 저장되고 또 다른 current가 생성됨.
	const cmdSaveAs = useCallback(
		textTitle => {
			let script = new Array()

			const dataContainer = {
				userId: cookies['user_id'],
				text: boardText,
				textTitle: textTitle,
			}

			sendAxiosPost(
				apiUrl.text.post.SAVE_AS,
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

					script.push({ say: 'Save as Completed', tempo: 0 })
				},
				error => {
					console.log(error)
					script.push({ say: 'Save as failed.', tempo: 0 })
				},
				() => {
					script.push(false)
					dispatch(messageAction.setGuideScript(script))
				},
			)
		},
		[commandCounter['save+as']],
	)
	// ===================================================
	//
	const cmdDelete = useCallback(
		textTitle => {
			let script = new Array()
			script.push({ say: 'are you serious? (Y/n)', tempo: 0 })

			dispatch(messageAction.setGuideScript(script))
			script = new Array()

			dispatch(
				commandAction.checkWhether(
					['Y', 'y'],
					() => {
						const dataContainer = {
							userId: cookies['user_id'],
							textTitle: textTitle,
						}

						sendAxiosPost(
							apiUrl.text.post.DELETE_TEXT_BY_TITLE,
							dataContainer,
							response => {
								let nextCommandList = new Array()
								if (currentTextTitle == textTitle) nextCommandList.push({ command: 'load text', say: true })
								nextCommandList.push({ command: 'get textlist', say: false })

								let getUseTextTitleList1 = getUseTextTitleList()
								let parameterStr = ''

								if (getUseTextTitleList1.includes(textTitle)) getUseTextTitleList1.splice(getUseTextTitleList1.indexOf(textTitle), 1)

								parameterStr = getUseTextTitleList1.join(',')
								nextCommandList.push({ command: `use text (${parameterStr})`, say: false })

								dispatch(commandAction.nextCommand(nextCommandList))
							},
							error => {
								console.log(error)
								script.push({ say: 'delete failed.', tempo: 0 })
							},
							() => {
								script.push(false)
								dispatch(messageAction.setGuideScript(script))
							},
						)
					},
					() => {
						script.push(false)
						dispatch(messageAction.setGuideScript(script))
					},
				),
			)
		},
		[commandCounter['delete']],
	)
	// ===================================================
	// renam text title ({textTitle}, {newTextTitle}) => 텍스트 테이터 title을 바꿔줌
	// {textTitle}, {newTextTitle} 모두 current는 사용할 수 없음
	const cmdRenameTextTitle = useCallback(
		(textTitle, newTextTitle) => {
			let script = new Array()

			const dataContainer = {
				userId: cookies['user_id'],
				textTitle: textTitle,
				newTextTitle: newTextTitle,
			}

			sendAxiosPost(
				apiUrl.text.post.RENAME_TEXT_TITLE,
				dataContainer,
				response => {
					dispatch(memoAction.updateUseTextTitle(textTitle, newTextTitle))
					dispatch(commandAction.nextCommand({ command: 'get textlist', say: false }))

					script.push({ say: 'Completed', tempo: 0 })
				},
				error => {
					console.log(error)
					script.push({ say: 'failed', tempo: 0 })
				},
				() => {
					script.push(false)
					dispatch(messageAction.setGuideScript(script))
				},
			)
		},
		[commandCounter['rename+text+title']],
	)
	// ===================================================
	// use text ({textTitle}, ...) =>  memoTable에서 보여질 텍스트 데이터들를 불러옴
	const cmdUseText = useCallback(
		(...sendTextTitleList) => {
			let script = new Array()

			const dataContainer = {
				userId: cookies['user_id'],
				textTitleList: sendTextTitleList,
			}

			sendAxiosPost(
				apiUrl.text.post.GET_TEXT_LIST,
				dataContainer,
				response => {
					dispatch(memoAction.setUseTextList(response.data))
					script.push({ say: 'Completeddddddddd', tempo: 0 })
				},
				error => {
					console.log(error)
					script.push({ say: 'failed', tempo: 0 })
				},
				() => {
					script.push(false)
					dispatch(messageAction.setGuideScript(script))
				},
			)
		},
		[commandCounter['use+text']],
	)
	// // ===================================================
	//
	const cmdAddUseText = useCallback(
		(...addTextTitleList) => {
			let script = new Array()

			const dataContainer = {
				userId: cookies['user_id'],
				textTitleList: addTextTitleList,
			}

			sendAxiosPost(
				apiUrl.text.post.GET_TEXT_LIST,
				dataContainer,
				response => {
					const addedUseTextList = useTextList.concat(response.data)
					dispatch(memoAction.setUseTextList(addedUseTextList))

					script.push({ say: 'Completedasdf', tempo: 0 })
				},
				error => {
					console.log(error)
					script.push({ say: 'failed', tempo: 0 })
				},
				() => {
					script.push(false)
					dispatch(messageAction.setGuideScript(script))
				},
			)
		},
		[commandCounter['add+use+text']],
	)
	// ===================================================
	//
	const cmdRemoveUseText = useCallback(
		(...removeTitleList) => {
			let script = new Array()

			// const removeFilter = useText => {
			// 	return !removeTitleList.includes(useText['text_title'])
			// }

			const removedUseTextList = useTextList.filter(useText => !removeTitleList.includes(useText['text_title']))

			dispatch(memoAction.setUseTextList(removedUseTextList))

			script.push({ say: 'remove Completed', tempo: 0 })
			script.push(false)
			dispatch(messageAction.setGuideScript(script))
		},
		[commandCounter['remove+use+text']],
	)
	// ===================================================
	// sort memo ({weekOrderBy}, {daySortMode}, {dayReverse}) => memoTable에서 보여질 데이터들을 사용자가 보기 쉽게 정렬을 바꿔줌
	const cmdSortMemo = useCallback(
		(weekOrderBy, daySortMode, dayReverse) => {
			let script = new Array()

			dispatch(
				memoAction.setSortMode({
					week: { orderBy: weekOrderBy },
					day: { sort: daySortMode, reverse: JSON.parse(dayReverse.toLowerCase()) },
				}),
			)
			script.push({ say: 'sorttttttttt', tempo: normalTempo })
			script.push(false)
			dispatch(messageAction.setGuideScript(script))
		},
		[commandCounter['sort+memo']],
	)
	// ===================================================
	// show title => say-현재 textBoard에 들어있는 덱스트 데이터 title
	const cmdShowTitle = useCallback(() => {
		let script = new Array()

		script.push({ say: currentTextTitle, tempo: normalTempo })
		script.push(false)

		dispatch(messageAction.setGuideScript(script))
	}, [commandCounter['show+title']])
	// ===================================================
	// show use text => 현재 memoTable에서 사용하고 있는 덱스트 데이터 Title들을 보여줌.
	const cmdShowUseText = useCallback(() => {
		let script = new Array()
		let useTextTitleList = getUseTextTitleList()

		if (useTextTitleList.length == 0) {
			script.push({ say: '"empty."', tempo: normalTempo })
		} else {
			useTextTitleList.forEach(useTextTitle => {
				script.push({ say: useTextTitle, tempo: normalTempo })
			})
		}

		script.push(false)
		dispatch(messageAction.setGuideScript(script))
	}, [commandCounter['show+use+text']])
	// ===================================================
	// mainContent에 있는 component 바꾸기/ mode 바꾸기
	const cmdSetMode = useCallback(
		changeMode => {
			let script = new Array()

			dispatch(modeAction.setCurrentMode(changeMode))

			script.push({ say: 'change!', tempo: normalTempo })
			script.push(false)
			dispatch(messageAction.setGuideScript(script))
		},
		[commandCounter['set+mode']],
	)
	// ===================================================
	// return 현재 시간
	// ex) PM 02:08:33
	const cmdNow = useCallback(() => {
		let script = new Array()

		let getToday = new Date()

		let hours = getToday.getHours()
		let ampm = hours < 12 ? '  AM' : '  PM'

		hours = hours <= 12 ? hours : hours - 12
		hours = wordFill(hours.toString(), 2, '0')

		let minutes = wordFill(getToday.getMinutes().toString(), 2, '0')
		let seconds = wordFill(getToday.getSeconds().toString(), 2, '0')

		let now = ampm + '  ' + hours + ':' + minutes + ':' + seconds

		script.push({ say: now, tempo: normalTempo })
		script.push(false)
		dispatch(messageAction.setGuideScript(script))
	}, [commandCounter['now']])
	// ===================================================
	// return 현재 날짜
	// ex) 2021-08-30 THU
	const cmdToday = useCallback(() => {
		let script = new Array()

		let today = new Date()
		let year = today.getFullYear()
		let month = wordFill((today.getMonth() + 1).toString(), 2, '0')
		let date = wordFill(today.getDate().toString(), 2, '0')
		let day = weekFormat[today.getDay()]

		today = year + '-' + month + '-' + date + ' ' + day

		script.push({ say: today, tempo: normalTempo })
		script.push(false)
		dispatch(messageAction.setGuideScript(script))
	}, [commandCounter['today']])
	// ===================================================
	// input : get week (year, month, date)
	// return 특정 날짜의 요일
	// ex) 2021-08-30 was... / THU
	const cmdGetDay = useCallback(
		(year, month, date) => {
			let script = new Array()

			const that_day = new Date()
			that_day.setFullYear(year)
			that_day.setMonth(month - 1)
			that_day.setDate(date)

			year = wordFill(that_day.getFullYear().toString(), 4, '0')
			month = wordFill((that_day.getMonth() + 1).toString(), 2, '0')
			date = wordFill(that_day.getDate().toString(), 2, '0')

			const today = new Date()

			today.setFullYear(new Date().getFullYear())
			today.setMonth(new Date().getMonth() - 1)
			today.setDate(new Date().getDate())

			if (that_day.getFullYear() < 0) {
				script.push({
					say: `B.C. &nbsp;${wordFill(Math.abs(that_day.getFullYear()).toString(), 4, '0')}-${month}-${date} was...`,
					tempo: normalTempo,
				})
			} else if (today - that_day === 0) {
				script.push({ say: `${year}-${month}-${date} today is...`, tempo: normalTempo })
			} else if (today - that_day < 0) {
				script.push({ say: `${year}-${month}-${date} is...`, tempo: normalTempo })
			} else if (today - that_day > 0) {
				script.push({ say: `${year}-${month}-${date} was...`, tempo: normalTempo })
			}

			script.push({ say: weekFormat[that_day.getDay()], tempo: normalTempo })
			script.push(false)
			dispatch(messageAction.setGuideScript(script))
		},
		[commandCounter['get+day']],
	)
	// ===================================================
	// say ({sayScript...})
	const cmdSay = useCallback(
		(...sayScript) => {
			sayScript.forEach(say => {
				dispatch(messageAction.addMsgHistory({ who: 'me', msgContent: say }))
			})
		},
		[commandCounter['say']],
	)

	// ===================================================
	// pF parameter filter 매개변수 형식이 맞는지 확인
	const noneParameter = useCallback(() => {
		const parameter = runCommandData['parameter']
		if (parameter.length != 0) {
			const script = new Array()
			script.push({ say: 'this command none parameter.', tempo: normalTempo })
			script.push(false)
			dispatch(messageAction.setGuideScript(script))
			return false
		} else {
			return true
		}
	}, [runCommandData['parameter']])

	const parametersExisted = useCallback(() => {
		const parameter = runCommandData['parameter']
		if (parameter.length <= 0) {
			const script = new Array()
			script.push({ say: "where's parameter?", tempo: normalTempo })
			script.push(false)
			dispatch(messageAction.setGuideScript(script))
			return false
		} else {
			return true
		}
	}, [runCommandData['parameter']])

	// const parametersRange = useCallback(
	// 	(min, max) => {
	// 		const parameter = runCommandData['parameter']
	// 		if (parameter.length < min || parameter.length > max) {
	// 			let script = new Array()

	// 			if (parameter.length < min) {
	// 				script.push({ say: `minimum num of parameters is ${min}`, tempo: normalTempo, last: true })
	// 			} else if (parameter.length > max) {
	// 				script.push({ say: `maximum num of parameters is ${max}`, tempo: normalTempo, last: true })
	// 			}

	// 			dispatch(messageAction.setGuideScript(script))
	// 			return false
	// 		} else {
	// 			return true
	// 		}
	// 	},
	// 	[runCommandData['parameter']],
	// )

	const correctNumOfParameters = useCallback(
		(...rightNum) => {
			const parameter = runCommandData['parameter']
			if (!rightNum.includes(parameter.length)) {
				let script = new Array()
				script.push({ say: `correct num of parameters ${rightNum.join(' or ')}`, tempo: normalTempo })
				script.push(false)
				dispatch(messageAction.setGuideScript(script))

				return false
			} else {
				return true
			}
		},
		[runCommandData['parameter']],
	)

	const currentNotAllowed = useCallback(
		(...notAllowedIndexList) => {
			const parameter = runCommandData['parameter']
			let isCurrent = false

			for (let index = 0; index < notAllowedIndexList.length; index++) {
				if (parameter[notAllowedIndexList[index]] == 'current') {
					isCurrent = true
					break
				}
			}

			if (isCurrent) {
				let script = new Array()
				script.push({ say: 'current', tempo: normalTempo })
				script.push({ say: 'not', tempo: normalTempo })
				script.push({ say: 'allowed.', tempo: normalTempo })
				script.push(false)
				dispatch(messageAction.setGuideScript(script))
				return false
			} else {
				return true
			}
		},
		[runCommandData['parameter']],
	)

	const currentTextIsCurrent = useCallback(() => {
		if (currentTextTitle != 'current') {
			let script = new Array()
			script.push({ say: 'current text is not "current"', tempo: normalTempo })
			script.push(false)
			dispatch(messageAction.setGuideScript(script))
		} else {
			return true
		}
	}, [runCommandData['parameter']])

	const isDate = useCallback(() => {
		const parameter = runCommandData['parameter']

		let year = _.parseInt(parameter[0], 10)
		let month = _.parseInt(parameter[1], 10)
		let date = _.parseInt(parameter[2], 10)

		let isTrue = true

		isTrue =
			Number.isInteger(year) &&
			Number.isInteger(month) &&
			Number.isInteger(date) &&
			_.inRange(month, 1, 13) &&
			date > 0 &&
			(([1, 3, 5, 7, 8, 10, 12].includes(month) && date <= 31) ||
				([4, 6, 9, 11].includes(month) && date <= 30) ||
				((month == 2 && date <= (year % 4 == 0 && year % 100 != 0)) || year % 400 == 0 ? 29 : 28))

		if (!isTrue) {
			let script = new Array()
			script.push({ say: 'is date false', tempo: normalTempo })
			script.push(false)
			dispatch(messageAction.setGuideScript(script))
			dispatch(messageAction.setGuideScript(script))
		}

		return isTrue
	}, [runCommandData['parameter']])

	const isMode = useCallback(
		(...changeModeList) => {
			let notExistedModeList = new Array()

			for (let index = 0; index < changeModeList.length; index++) {
				if (!changeModeList[index] in mode) notExistedModeList.push(notExistedModeList)
			}

			if (notExistedModeList.length != 0) {
				let script = new Array()

				script.push({ say: 'Hmm...', tempo: normalTempo })
				for (let index = 0; index < notExistedModeList.length; index++) {
					script.push({ say: notExistedModeList[index], tempo: normalTempo })
				}
				script.push({ say: 'not exist.', tempo: normalTempo })

				script.push(false)
				dispatch(messageAction.setGuideScript(script))
				return false
			} else {
				return true
			}
		},
		[runCommandData['parameter']],
	)

	const isSortMode = useCallback(() => {
		const parameter = runCommandData['parameter']

		let weekOrderBy = parameter[0]
		let daySortMode = parameter[1]
		let dayReverse = JSON.parse(parameter[2].toLowerCase())

		let isTrue = false
		let script = new Array()

		if (!weekOrderBy in definedSortMode['week']['orderBy']) script.push({ say: `" ${weekOrderBy} " not definded`, tempo: normalTempo })
		else if (!daySortMode in definedSortMode['day']['sort']) script.push({ say: `" ${daySortMode} " not definded`, tempo: normalTempo })
		else if (!dayReverse in definedSortMode['day']['reverse']) script.push({ say: `" ${dayReverse} " not definded`, tempo: normalTempo })
		else isTrue = true

		if (!isTrue) {
			script.push(false)
			dispatch(messageAction.setGuideScript(script))
		}

		return isTrue
	}, [runCommandData['parameter']])

	const isExistTextList = useCallback(
		(isExist, ...titleList) => {
			let textTitleList1 = getTextTitleList()
			let isExistedTitleList = new Array()

			for (let index = 0; index < titleList.length; index++) {
				if (!textTitleList1.includes(titleList[index]) === isExist) isExistedTitleList.push(titleList[index])
			}

			if (isExistedTitleList.length != 0) {
				let script = new Array()

				script.push({ say: 'Hmm...', tempo: normalTempo })
				for (let index = 0; index < isExistedTitleList.length; index++) {
					script.push({ say: isExistedTitleList[index], tempo: normalTempo })
				}

				script.push({ say: isExist ? 'not exist. --;;' : 'already exist. TT;;', tempo: normalTempo })
				script.push(false)
				dispatch(messageAction.setGuideScript(script))
				return false
			} else {
				return true
			}
		},
		[runCommandData['parameter']],
	)

	// ===================================================
	// useEffect -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

	useGuideEvent()

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
			const prmt = runCommandData['parameter']
			switch (runCommandData['commandType']) {
				case 'say':
					if (parametersExisted()) cmdSay(...prmt)
					break
				case 'now':
					if (noneParameter()) cmdNow()
					break
				case 'today':
					if (noneParameter()) cmdToday()
					break

				case 'ping':
					if (noneParameter()) cmdPing()
					break

				// get
				case 'get+day':
					if (correctNumOfParameters(3) && isDate()) cmdGetDay(_.parseInt(prmt[0], 10), _.parseInt(prmt[1], 10), _.parseInt(prmt[2], 10))
					break
				case 'get+textlist':
					if (noneParameter()) cmdGetTextList()
					break

				// load
				case 'load+text':
					if (noneParameter()) {
						cmdLoadText(new Array('current'))
					} else if (correctNumOfParameters(1) && isExistTextList(true, prmt[0])) {
						cmdLoadText(prmt[0])
					}

					break

				// set
				case 'set+mode':
					if (correctNumOfParameters(1) && isMode(prmt[0])) cmdSetMode(prmt[0])
					break

				// save
				case 'save':
					if (noneParameter()) cmdSave()
					break
				case 'save+as':
					if (correctNumOfParameters(1) && currentNotAllowed(0) && currentTextIsCurrent()) cmdSaveAs(prmt[0])
					break

				// delete
				case 'delete':
					if (correctNumOfParameters(1) && isExistTextList(true, prmt[0])) cmdDelete(prmt[0])
					break
				// use
				case 'use+text':
					if (parametersExisted() && isExistTextList(true, ...prmt)) cmdUseText(...prmt)
					break

				// add
				case 'add+use+text':
					if (parametersExisted() && isExistTextList(true, ...prmt)) cmdAddUseText(...prmt)
					break

				// remove
				case 'remove+use+text':
					if (parametersExisted() && isExistTextList(true, ...prmt)) cmdRemoveUseText(...prmt)
					break

				// sort
				case 'sort+memo':
					if (correctNumOfParameters(3) && isSortMode()) cmdSortMemo(...prmt)
					break

				// show
				case 'show+title':
					if (noneParameter()) cmdShowTitle()
					break
				case 'show+use+text':
					if (noneParameter()) cmdShowUseText()
					break

				// rename
				case 'rename+text+title':
					if (correctNumOfParameters(2) && currentNotAllowed(0) && (prmt[0] === prmt[1] || (isExistTextList(true, prmt[0]) && isExistTextList(false, prmt[1]))))
						cmdRenameTextTitle(...prmt)
					break
			}
		}
	}, [commandCounter])
}

export default useCommandEvent
