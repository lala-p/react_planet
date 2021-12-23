import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';

import * as modeAction from '../actions/mode';

import MainBoard from '../components/MainBoard';
// import MemoTable from '../components/MemoTable';
import MemoTable2 from '../components/MemoTable2';
import MainCommandTable from '../components/MainCommandTable';
import MainGuide from '../components/MainGuide';
import TextTable from '../components/TextTable';
import Help from '../components/Help';
import CommandEvent from '../components/CommandEvent';


const MainPage = () => {

    const history = useHistory()
    const dispatch = useDispatch()

    const textTitle = useSelector((state) => state.mainText.textTitle)
    const currentMode = useSelector((state) => state.mode.currentMode)

    const modeHandler = () => {

        switch (currentMode) {
            case 0:
                return null
            case 1: 
                return <MemoTable2></MemoTable2>
            case 2:
                return <TextTable></TextTable>
            default:
                return <Help></Help>

        }
    }

    useHotkeys('shift+up', ()=> dispatch(modeAction.rangeControl(-1)))
    useHotkeys('shift+down', ()=> dispatch(modeAction.rangeControl(1)))

    useEffect(() => {
        if (!textTitle) {
            history.push("/loading")
        }
    }, [])


    return(
        <div className="MainPage">
            <div style={{display: "flex", paddingTop: "20px", paddingLeft:"20px"}}>
                <div style={{width: "320px"}}>
                    <div>
                        <MainGuide></MainGuide>
                    </div>
                    <div>
                        <CommandEvent />
                        <MainCommandTable></MainCommandTable>
                    </div>

                    현재 currentMode = {currentMode}
                    <br />
                </div>
                &nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;

                <div><button onClick={()=> dispatch(modeAction.rangeControl(-1))} style={{height: "100%"}}>&lt;</button></div>
                &nbsp;&nbsp;&nbsp;
                <div style={{display: "flex", width: "1400px"}}>   
                    <div style={currentMode != 0 ? {display: "none"} : null}>
                        <MainBoard></MainBoard>
                    </div>
                    {modeHandler()}
                </div>
                &nbsp;&nbsp;&nbsp;
                <div><button onClick={()=> dispatch(modeAction.rangeControl(1))} style={{height: "100%"}}>&gt;</button></div>
                
            </div>
        </div>
    )
}

export default MainPage;
