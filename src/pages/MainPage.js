import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import * as modeAction from '../actions/mode';

import MainBoard from '../components/MainBoard';
import MemoBox from '../components/MemoBox';
import MainCommandTable from '../components/MainCommandTable';
import MainGuide from '../components/MainGuide';

const MainPage = () => {

    const dispatch = useDispatch();
    const currentMode = useSelector((state) => state.mode.currentMode);
    

    useEffect(() => {

        
    }, [])


    const modeHandler = () => {

        switch (currentMode) {
            case 0:
                return <MainBoard></MainBoard>

            case 1: 
                return <MemoBox></MemoBox>
            default:
                break;
        }

    }


    return(
        <div style={{display: "flex", width: "100%"}}>
            <div style={{width: "350px"}}>
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

            <div><button onClick={()=> dispatch(modeAction.rangeControl(-1))}>&lt;</button></div>
            <div style={{display: "flex"}}>
                {modeHandler()}
            </div>
            <div><button onClick={()=> dispatch(modeAction.rangeControl(1))}>&gt;</button></div>
            
        </div>


    )
}

export default MainPage;

