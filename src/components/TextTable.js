import React, { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useCookies } from 'react-cookie'

const TextTable = () => {
	const dispatch = useDispatch()
	const textTitleListData = useSelector(state => state.text.textTitleList)

	const [cookies, setCookie, removeCookie] = useCookies()

	const textTitleList = textTitleListData.map((textData, index) => (
		<tr>
			<td>{textData['text_title']}</td>
			<td>{textData['created_at']}</td>
			<td>{textData['updated_at']}</td>
		</tr>
	))

	return (
		<div>
			<table border="1">
				<tbody>
					<tr>
						<th>title</th>
						<th>created_at</th>
						<th>updated_at</th>
					</tr>
					{textTitleList}
				</tbody>
			</table>
		</div>
	)
}

export default TextTable
