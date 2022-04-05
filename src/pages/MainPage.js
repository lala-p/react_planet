import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook'

import * as modeAction from '../actions/mode'

import useCommandEvent from '../hooks/useCommandEvent'

import TextBoard from '../components/TextBoard'
// import MemoTable2 from '../components/MemoTable2'
import MemoTable3 from '../components/MemoTable3'
import CommandTable from '../components/CommandTable'
import Gudie from '../components/Guide'
import TextTable from '../components/TextTable'
import Help from '../components/Help'

const CurrentModeContainer = props => {
	let mode = props.mode

	return (
		<div className="current-mode-container">
			<div className="current-mode" style={mode != 0 ? { display: 'none' } : null}>
				<TextBoard />
			</div>
			<div className="current-mode" style={mode != 1 ? { display: 'none' } : null}>
				<MemoTable3 />
			</div>
			<div className="current-mode" style={mode != 2 ? { display: 'none' } : null}>
				<TextTable />
			</div>
			<div className="current-mode" style={mode != 3 ? { display: 'none' } : null}>
				<Help />
			</div>
		</div>
	)
}

const MainPage = () => {
	const history = useHistory()
	const dispatch = useDispatch()

	const currentMode = useSelector(state => state.mode.currentMode)

	useHotkeys('shift+up', () => dispatch(modeAction.moveCurrentMode(-1)))
	useHotkeys('shift+down', () => dispatch(modeAction.moveCurrentMode(1)))

	useCommandEvent()

	return (
		<div className="MainPage">
			<div style={{ display: 'flex', paddingTop: '20px', paddingLeft: '20px' }}>
				<div style={{ width: '320px' }}>
					<div>
						<Gudie></Gudie>
					</div>
					<div>
						<CommandTable></CommandTable>
					</div>
					현재 currentMode = {currentMode}
					<br />
				</div>
				&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
				<div>
					<button onClick={() => dispatch(modeAction.moveCurrentMode(-1))} style={{ height: '100%' }}>
						&lt;
					</button>
				</div>
				&nbsp;&nbsp;&nbsp;
				<div style={{ display: 'flex', width: '1400px' }}>
					<CurrentModeContainer mode={currentMode} />
				</div>
				&nbsp;&nbsp;&nbsp;
				<div>
					<button onClick={() => dispatch(modeAction.moveCurrentMode(1))} style={{ height: '100%' }}>
						&gt;
					</button>
				</div>
			</div>
		</div>
	)
}

export default MainPage
