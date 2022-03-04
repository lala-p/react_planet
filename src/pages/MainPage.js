import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';

import * as modeAction from '../actions/mode';

import TextBoard from '../components/TextBoard';
// import MemoTable from '../components/MemoTable';
import MemoTable2 from '../components/MemoTable2';
import CommandTable from '../components/CommandTable';
import Gudie from '../components/Guide';
import TextList from '../components/TextList';
import Help from '../components/Help';
import CommandEvent from '../components/CommandEvent';


const MainPage = () => {

    const history = useHistory()
    const dispatch = useDispatch()

    // const textTitle = useSelector((state) => state.mainText.textTitle)
    const currentMode = useSelector((state) => state.mode.currentMode)

    const modeHandler = () => {

        switch (currentMode) {
            case 0:
                return null // TextBoard
            case 1: 
                return <MemoTable2></MemoTable2>
            case 2:
                return <TextList></TextList> // TextList
            default:
                return <Help></Help>

        }
    }

    useHotkeys('shift+up', ()=> dispatch(modeAction.rangeControl(-1)))
    useHotkeys('shift+down', ()=> dispatch(modeAction.rangeControl(1)))

    useEffect(() => {
       
    }, [])


    return(
        <div className="MainPage">
            <div style={{display: "flex", paddingTop: "20px", paddingLeft:"20px"}}>
                <div style={{width: "320px"}}>
                    <div>
                        <Gudie></Gudie>
                    </div>
                    <div>
                        <CommandEvent />
                        <CommandTable></CommandTable>
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
                        <TextBoard></TextBoard>
                    </div>
                    {/* <div style={currentMode != 2 ? {display: "none"} : null}>
                        <TextList></TextList>
                    </div> */}
                
                    {modeHandler()}
                </div>
                &nbsp;&nbsp;&nbsp;
                <div><button onClick={()=> dispatch(modeAction.rangeControl(1))} style={{height: "100%"}}>&gt;</button></div>
                
            </div>
        </div>
    )
}

export default MainPage;
