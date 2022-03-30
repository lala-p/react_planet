import React, { useEffect, useState, useCallback } from 'react'

const TestPage = () => {
	const [haha, setHaha] = useState(0)
	const [lulu, setLulu] = useState(0)

	const changeHaha = useCallback(() => {
		setHaha(haha + 1)
	}, [lulu])

	const changeLulu = () => {
		setLulu(lulu + 1)
	}

	return (
		<div>
			<h1>haha : {haha}</h1>
			<h1>lulu : {lulu}</h1>
			<button onClick={e => changeHaha()}>haha</button>
			<button onClick={e => changeLulu()}>lulu</button>
		</div>
	)
}

export default TestPage
