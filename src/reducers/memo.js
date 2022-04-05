import produce from 'immer'

import { findVer01 } from '../find/ver_01'

import * as memoAction from '../actions/memo'

const initialStates = {
	useTextList: [],
	memoDataList: [],
	sortedMemoDataList: [],
	definedSortMode: {
		week: { orderBy: ['asc', 'desc'] },
		day: { sort: ['normal', 'calendar'], reverse: [true, false] },
	},
	sortMode: {
		week: { orderBy: 'desc' },
		day: { sort: 'calendar', reverse: false },
	},
	useDays: { 0: false, 1: true, 2: true, 3: true, 4: true, 5: true, 6: false },
	dayMemoModalOpen: false,
	dayMemoModalData: {},
}

const reducers = (state = initialStates, actions) => {
	switch (actions.type) {
		case memoAction.SET_USE_TEXT_LIST: {
			return produce(state, draft => {
				draft.useTextList = actions.payload

				const dataList = getMemoDataList(actions.payload)
				draft.memoDataList = dataList
				draft.sortedMemoDataList = getSortedMemoDataList(dataList, draft.sortMode.week.orderBy, draft.sortMode.day.sort, draft.sortMode.day.reverse)
			})
		}
		case memoAction.UPDATE_USE_TEXT_TITLE: {
			return produce(state, draft => {
				const textTitle = actions.payload1
				const newTextTitle = actions.payload2

				function findIndexByTitle(textData) {
					if (textData['text_title'] == textTitle) return true
				}

				const titleIdex = draft.useTextList.findIndex(findIndexByTitle)

				if (titleIdex != -1) {
					draft.useTextList[titleIdex]['text_title'] = newTextTitle
				}

				const dataList = getMemoDataList(draft.useTextList)
				draft.memoDataList = dataList
				draft.sortedMemoDataList = getSortedMemoDataList(dataList, draft.sortMode.week.orderBy, draft.sortMode.day.sort, draft.sortMode.day.reverse)
			})
		}
		case memoAction.SET_SORT_MODE: {
			return produce(state, draft => {
				draft.sortMode = actions.payload
				draft.sortedMemoDataList = getSortedMemoDataList(draft.memoDataList, actions.payload.week.orderBy, actions.payload.day.sort, actions.payload.day.reverse)
			})
		}
		case memoAction.SET_DAY_MEMO_MODAL_OPEN: {
			return produce(state, draft => {
				draft.dayMemoModalOpen = actions.payload
			})
		}
		case memoAction.SET_DAY_MEMO_MODAL_DATA: {
			return produce(state, draft => {
				draft.dayMemoModalData = actions.payload
			})
		}

		default: {
			return {
				...state,
			}
		}
	}
}

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

const getSortedMemoDataList = (memoDataList, weekOrderBy, daySortMode, dayReverse) => {
	let sortedMemoDataList = []
	sortedMemoDataList = memoDataList.slice()
	sortedMemoDataList = sortedMemoDataList.sort((a, b) => new Date(a.date) - new Date(b.date))

	let weekList = []
	let weekNum = 0

	if (memoDataList.length != 0) {
		switch (daySortMode) {
			case 'normal':
				let maxWeekDays = 0

				for (let index = 0; index < 7; index++) {
					if (initialStates.useDays[index]) {
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

					if (initialStates.useDays[currentData['day']]) {
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
				let oneWeek = _.cloneDeep(initialStates.useDays)
				for (let index = 0; index < 7; index++) {
					if (initialStates.useDays[index]) {
						oneWeek[index] = false
					} else {
						delete oneWeek[index]
					}
				}

				weekList.push(_.cloneDeep(oneWeek))

				let address = 0
				while (address < sortedMemoDataList.length) {
					if (initialStates.useDays[sortedMemoDataList[address]['day']]) {
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

					if (initialStates.useDays[currentData['day']]) {
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
		return sortedMemoDataList
	} else {
		return []
	}
}

export default reducers
