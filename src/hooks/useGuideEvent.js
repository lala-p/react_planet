import React, { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import * as messageAction from '../actions/message'
import * as commandAction from '../actions/command'

const sleep = ms => {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, ms)
	})
}

const useGuideEvent = () => {
	const dispatch = useDispatch()

	const sendCommandList = useSelector(state => state.command.sendCommandList)
	const runCommandData = useSelector(state => state.command.runCommandData)

	const guideScript = useSelector(state => state.message.guideScript)

	const guideSay = async script => {
		for (let index = 0; index < script.length; index++) {
			if (typeof script[index] === 'boolean' && !script[index]) {
				dispatch(commandAction.setNext(true))

				if (sendCommandList.length <= 1) {
					dispatch(messageAction.setReadOnly(false))
				}
			} else if (runCommandData['say']) {
				await sleep(script[index]['tempo'])
				dispatch(messageAction.addMsgHistory({ who: 'guide', msgContent: script[index]['say'] }))
			}
		}
	}

	useEffect(() => {
		if (guideScript && guideScript.length != 0) {
			dispatch(messageAction.setReadOnly(true))
			guideSay(guideScript)
		}
	}, [guideScript])
}

export default useGuideEvent
