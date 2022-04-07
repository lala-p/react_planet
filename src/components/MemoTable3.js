import React, { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ReactModal from 'react-modal'

import * as memoAction from '../actions/memo'

import '../style/components/MemoTable.scss'

const WeekBoxList = props => {
	return (
		<div className="week-box-container">
			{props.dataList.map((weekDataList, index) => (
				<div className="week-box">
					<div className="day-box-container">
						{weekDataList.map((dayData, index) => (
							<DayBox data={dayData} />
						))}
					</div>
					<div className="line"></div>
				</div>
			))}
		</div>
	)
}

const DayBox = props => {
	const dispatch = useDispatch()
	const weekFormat = useSelector(state => state.astronaut.weekFormat)

	if (props.data == false) {
		return <div className={'day-box-empty'}></div>
	} else {
		return (
			<div
				className={'day-box'}
				onClick={() => {
					dispatch(memoAction.setDayMemoModalData(props.data))
					dispatch(memoAction.setDayMemoModalOpen(true))
					console.log('asdfasdfasdf')
				}}
			>
				{props.data['date']} - {weekFormat[props.data['day']]}
				<br />
				TITLE : {props.data['title']}
				<br />
				plan count: {props.data['planList'].length}
				<br />
				etc count: {props.data['etc'].length}
			</div>
		)
	}
}

const PlanBoxList = props => {
	return <div className="plan-box"></div>
}

const PlanStateBox = props => {
	return <div className="plan-box"></div>
}

const planInfoBoxList = props => {
	return <div className="plan-info"></div>
}

const PlanConclusionBoxList = props => {
	return <div className="plan-conclusion"></div>
}

const EtcBoxList = props => {
	return <div className="etc-box"></div>
}

const DayMemo = props => {
	const weekFormat = useSelector(state => state.astronaut.weekFormat)

	return (
		<div className="day-memo">
			<h3>{props.data['date']}</h3>
			<br />
			{weekFormat[props.data['day']]}
		</div>
	)
}

const MemoTable3 = () => {
	const dispatch = useDispatch()

	const memoDataList = useSelector(state => state.memo.memoDataList)
	const sortedMemoDataList = useSelector(state => state.memo.sortedMemoDataList)

	const dayMemoModalOpen = useSelector(state => state.memo.dayMemoModalOpen)
	const dayMemoModalData = useSelector(state => state.memo.dayMemoModalData)

	// const [sortedMemoDataList, setSortedMemoDataList] = useState([])

	return (
		<div className="MemoTable">
			<div className="week-box-container">
				<WeekBoxList dataList={sortedMemoDataList} />
			</div>
			<div className="day-memo-modal">
				<ReactModal isOpen={dayMemoModalOpen} onRequestClose={() => dispatch(memoAction.setDayMemoModalOpen(false))} contentLabel="DayMemoModal" ariaHideApp={false}>
					<DayMemo data={dayMemoModalData} />
				</ReactModal>
			</div>
		</div>
	)
}

export default MemoTable3
