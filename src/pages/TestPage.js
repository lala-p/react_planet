import React, { useEffect, useState } from 'react'
import { sendAxiosGet, sendAxiosPost } from '../api/sendAxios'
import { SERVER_CONNECT } from '../api/etcApiUrl'

const TestPage = () => {
	const [haha, setHaha] = useState(0)

	const gaga = () => {
		sendAxiosGet(
			SERVER_CONNECT,
			response => {
				setHaha(haha + 1)
			},
			error => {
				console.log(error)
			},
			() => {
				setHaha(haha + 3)
			},
		)
	}

	useEffect(() => {
		console.log(haha)
	}, [haha])

	return (
		<div>
			<input type="text" value={haha} onChange={e => setHaha(e.target.value)} />
			<button onClick={e => gaga()}>asdf</button>
		</div>
	)
}

export default TestPage
