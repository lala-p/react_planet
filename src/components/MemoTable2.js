import React, { useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import ReactModal from 'react-modal'

import '../style/components/MemoTable.scss'

const MemoTable2 = () => {
	const dispatch = useDispatch()

	const weekFormat = useSelector(state => state.astronaut.weekFormat)

	const sortedMemoDataList = useSelector(state => state.memo.sortedMemoDataList)

	const [dayDataModalOpen, setDayDataModalOpen] = useState(false)
	const [dayDataModalData, setDayDataModalData] = useState(false)

	const weekDataBoxContainer = useCallback(weekDataList => {
		const containerModel = dataList => {
			return <div className={'week-data-box-container'}>{weekDataBoxes(dataList)}</div>
		}

		const container = containerModel(weekDataList)

		return container
	}, [])

	const weekDataBoxes = useCallback(weekDataList => {
		const boxes = weekDataList.map(weekData => {
			return (
				<div className="week-data-box">
					<div className={'box-container'}>{dayMemoBoxes(weekData)}</div>
					<div className={'line'}></div>
				</div>
			)
		})

		return boxes
	})

	const dayDataBox = dayData => {
		const boxModel = data => {
			return (
				<div>
					<h3>{data['date']}</h3>
					<br />
					{weekFormat[data['day']]}
					<br />
					<br />
					<br />
					{planBoxes(data['planList'])}
					<br />
					<br />
					{etcBoxes(data['etc'])}
				</div>
			)
		}

		const box = boxModel(dayData)

		return box
	}

	const dayDataModal = dayData => {
		const modalModel = data => {
			return (
				<div className={'day-data-modal'}>
					{dayDataModalData ? (
						<ReactModal isOpen={dayDataModalOpen} onRequestClose={() => setDayDataModalOpen(false)} contentLabel="dayDataModal" ariaHideApp={false}>
							{dayDataBox(data)}
						</ReactModal>
					) : null}
				</div>
			)
		}

		const modal = modalModel(dayData)

		return modal
	}

	const dayMemoBoxes = dayDataList => {
		const boxes = dayDataList.map(dayData => {
			if (dayData == false) {
				return <div className={'day-memo-box-empty'}></div>
			} else {
				return (
					<div
						className={'day-memo-box'}
						onClick={() => {
							setDayDataModalData(dayData)
							setDayDataModalOpen(true)
						}}
					>
						{dayData['date']} - {weekFormat[dayData['day']]}
						<br />
						TITLE : {dayData['title']}
						<br />
						plan count: {dayData['planList'].length}
						<br />
						etc count: {dayData['etc'].length}
					</div>
				)
			}
		})

		return boxes
	}

	const planBoxes = planList => {
		const boxes = planList.map(planData => {
			return (
				<div className={'plan-box'}>
					{planData['plan']}
					{planStateBox(planData['state'])}
					{planInfoBoxes(planData['info'])}
					{planConclusionBoxes(planData['conclusion'])}
				</div>
			)
		})

		return boxes
	}

	const planStateBox = stateCode => {
		const boxModel = code => {
			let state = ''

			switch (code) {
				case 0:
					state = '??????'
					break
				case 1:
					state = '??????'
					break
				case 2:
					state = '??????'
					break
				case 3:
					state = '??????'
					break
				case 4:
					state = '????????????.'
					break

				default:
					break
			}

			return <div className="plan-state-box">{state}</div>
		}

		const box = boxModel(stateCode)

		return box
	}

	const planInfoBoxes = infoList => {
		const boxes = infoList.map(info => {
			return <div className={'plan-info-box'}>- {info}</div>
		})

		return boxes
	}

	const planConclusionBoxes = conclusionList => {
		const boxes = conclusionList.map(conclusion => {
			return <div className={'plan-conclusion-box'}>{conclusion}</div>
		})

		return boxes
	}

	const etcBoxes = etcList => {
		const boxes = etcList.map(etc => {
			return <pre style={{ wordBreak: 'nowrap' }}>{'+ ' + etc}</pre>
		})

		return boxes
	}

	return (
		<div className="MemoTable">
			<br />
			<br />
			{weekDataBoxContainer(sortedMemoDataList)}

			{dayDataModal(dayDataModalData)}

			{/* style={{width: "1370px", height: "900px", overflow: "scroll", margin: "auto"}} */}
		</div>
	)
}

export default MemoTable2
