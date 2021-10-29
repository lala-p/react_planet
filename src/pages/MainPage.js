import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';

import * as modeAction from '../actions/mode';

import MainBoard from '../components/mode/MainBoard';
import MemoTable from '../components/mode/MemoTable';
import MainCommandTable from '../components/MainCommandTable';
import MainGuide from '../components/MainGuide';
import Help from '../components/mode/Help';


const MainPage = () => {

    const dispatch = useDispatch();
    const currentMode = useSelector((state) => state.mode.currentMode);

    const modeHandler = () => {

        switch (currentMode) {
            case 0:
                return <MainBoard></MainBoard>
            case 1: 
                return <MemoTable></MemoTable>

            default:
                return <Help></Help>

        }

    }

    useHotkeys('shift+up', ()=> dispatch(modeAction.rangeControl(-1)))
    useHotkeys('shift+down', ()=> dispatch(modeAction.rangeControl(1)))

    useEffect(() => {

    }, [])

    

    return(
        <div style={{display: "flex", paddingTop: "20px", paddingLeft:"20px"}}>
            <div style={{width: "320px"}}>
                <div>
                    {/* MainGuide */}
                    <MainGuide></MainGuide>
                </div>
                <div>
                    {/* MainCommandTable */}
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
                {modeHandler()}
            </div>
            &nbsp;&nbsp;&nbsp;
            <div><button onClick={()=> dispatch(modeAction.rangeControl(1))} style={{height: "100%"}}>&gt;</button></div>
            
        </div>


    )
}

export default MainPage;

