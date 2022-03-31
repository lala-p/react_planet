import React, { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { sendAxiosGet, sendAxiosPost } from '../api/sendAxios'

import { SERVER_CONNECT } from '../api/etcApiUrl'

const TestPage = () => {
	const [lulu, setLulu] = useState(0)

	const haha = e => {
		let script = new Array()

		sendAxiosGet(
			SERVER_CONNECT,
			response => {
				console.log('res')
			},
			error => {},
			() => {
				console.log('then')
			},
		)
	}

	return (
		<div>
			<button onClick={haha}>asdfasdfasdfasdfasdf</button>
		</div>
	)
}

export default TestPage
