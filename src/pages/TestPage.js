import React, { useEffect, useState, useRef, useCallback } from 'react'

const TestPage = () => {
	const [name, setName] = useState('gg')
	const [msgList, setMsgList] = useState(new Array())

	const msgBox = msgList.map((msg, index) => {
		const text = `${name}, ${msg}`

		return <div key={index}>{text}</div>
	})

	return (
		<div>
			<input
				value={name}
				onChange={e => {
					setName(e.target.value)
				}}
			/>
			<button
				onClick={e => {
					setMsgList(msgList.concat('Hi!@!'))
				}}
			>
				add
			</button>
			{msgBox}
		</div>
	)
}

export default TestPage
