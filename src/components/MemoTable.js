import React, { memo, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ReactModal from 'react-modal';

import * as memoAction from '../actions/memo';


const MemoBoard = () => {

    const dispatch = useDispatch();
    const weekDataList = useSelector((state) => state.mainText.weekDataList)

    const weekBoxLineUp = useSelector((state) => state.memo.weekBoxLineUp);
    const memoBoxLineUp = useSelector((state) => state.memo.memoBoxLineUp);
    const memoBoxReverse = useSelector((state) => state.memo.memoBoxReverse)

    const week = useSelector((state) => state.astronaut.week)
    
    const [open, setOpen] = useState(false)
    const [memoData2, setMemoData2] = useState(false)

    const weekTextBox = useCallback(
        (data) => {
            const box = data.map((memo) => {

                let lineUp = []

                for (let index = 0; index < memo.length; index++) {
                    lineUp.push(memo[index])
                }

                switch (memoBoxLineUp) {
                    case 0:
                        break;
                    case 1:
                        let oneWeek = [false, false, false, false, false]
                        
                        for (let index = 0; index < lineUp.length; index++) {
                            oneWeek[lineUp[index]['day']-1] = lineUp[index]                        
                        }
                        lineUp = oneWeek
                        
                        break; 
                    
        
                    default: 
                        break;     
                }

                if (memoBoxReverse) {
                    lineUp.reverse()
                }

                return (
                    <div>
                        <div style={{display: "flex", width: "1350px", backgroundColor: "green"}}>
                            {memoBox(lineUp)}
                        </div>
                        <hr />
                        <br />
                    </div>
                )
            })

            console.log(box.length)

            return box;
        }, [weekDataList, memoBoxLineUp, memoBoxReverse]
    ) 

    const memo = (memo) => {
        return (
            <div style={{width: "260px", height: "150px", margin: "5px"}}>
                <div>
                    <div>
                        {memo['date']} - {week[memo['day']]}
                    </div>
                    <br />
                    <ol>
                        {planBox(memo['plan'])}
                    </ol>
                    <br />
                    {etcBox(memo['etc'])}
                </div>
            </div>            
        )

    }

    const memoBox = (dayOfMemo) => {
        const box = dayOfMemo.map((memo) => {
            return (
                <div style={{width: "260px", height: "150px", margin: "5px"}}>
                { memo ?
                    <div style={{width: "100%", height: "100%", backgroundColor: "skyblue"}} 
                        onClick={()=>{
                            setMemoData2(memo)
                            setOpen(true)
                        }}
                    >
                        <div style={{width: "240px", height: "125px", margin: "auto", paddingTop: "10px", overflow: "hidden"}}>
                            <table style={{width: "100%"}}>
                                <tbody>
                                    <tr>
                                        <td><b>{memo['date']}</b></td>
                                        <td style={{textAlign: "right"}}>{week[memo['day']]}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <br />
                            <ol style={{paddingLeft: "20px"}}>
                                {planBox(memo['plan'])}
                            </ol>
                            <br />
                            {etcBox(memo['etc'])}
                        </div>
                    </div>   

                :
                    <div style={{width: "100%", height: "100%"}}>
                        empty
                    </div>    
                                
                }
                
                </div>            
            )
        })

        return box;
    }


    const etcBox = (dayOfEtc) => {
        const box = dayOfEtc.map((etc) => {
            return (
                <pre style={{wordBreak: "nowrap"}}>
                    {"+ " + etc}
                </pre>
            )
        })

        return box;
    }


    const planBox = (dayOfPlan) => {
        const box = dayOfPlan.map((plan) => {
            let planText = plan
            let o = planText.match(/\s{1}O{1}/g)   
            if (o == null) {
                // o = []
            } else {
                o = o[0]
                planText = planText.replace(o, "")
            }
            

            let x = planText.match(/\s{1}X{1}/g)
            
            if (x != null) {
                x = x[0]
                planText = planText.replace(x, "")
            }

            let conclusion = planText.split(/=>/g)
            conclusion.shift()
            
            for (let index = 0; index < conclusion.length; index++) {
                planText = planText.replace(/=>/g, "")
                planText = planText.replace(conclusion[index], "")
            }


            let a = planText.split(/\t{3}-{1}/g)
        
            if (a != null) {
                a.shift()
                for (let index = 0; index < a.length; index++) {
                    planText = planText.replace(/\t{3,}-{1}/g, "")
                    planText = planText.replace(a[index], "")
                }
            }

            return (
                <li style={{width: "800px"}}> 
                    {planText}{oBox(o)}{xBox(x)}
                    {a == null ? null : aBox(a)}
                    {conclusionBox(conclusion)}
                </li>
            )
        })
        
        return box;
    }

    const oBox = (o) => {
        return (
            <span>
            { o != null ? 
                <span style={{color: "blue"}}>
                    <b>O</b>
                </span>
                :
                null
            }
            </span>
        )
    }

    const xBox = (x) => {
        return (
            <span>
            { x != null ? 
                <span style={{color: "red"}}>
                    <b>X</b>
                </span>
                :
                null
            }
            </span>
        )
    }
    
    const aBox = (aList) => {
        const box = aList.map((a) => {

            return (
                <div>
                { aList != null ?
                    <p style={{color: "orange"}}>- {a}</p>
                :
                    null
                }
                </div>
            )
        })

        return box;
    } 

    const conclusionBox = (conclusion) => {
        const box = conclusion.map((c) => {
            return (
                <div style={{backgroundColor: "salmon"}}>
                    =&gt; {c}
                </div>
            )
        })

        return box;
    }


    const weekBoxLineUpStyle = () => {

        let style = {}

        switch (weekBoxLineUp) {
            case 0:
                style = {
                    display: "flex",
                    flexDirection: "column-reverse",
                }     

                break;
            case 1:
                style = {
                    display: "flex",
                    flexDirection: "column",
                }     
                
                break;

            default:
                break;
        }    
    
        return style;
    }
    
    return(
        <div className="MemoTable">
            <div>
                주 : &nbsp;&nbsp;
                <button onClick={()=>{dispatch(memoAction.setWeekBoxLineUp(0))}}>최근 날짜부터</button>
                <button onClick={()=>{dispatch(memoAction.setWeekBoxLineUp(1))}}>오래된 것부터</button>
                &nbsp;
                일 :&nbsp;&nbsp;
                <button onClick={()=>{dispatch(memoAction.setMemoBoxLineUp(0))}}>순서대로</button>
                <button onClick={()=>{dispatch(memoAction.setMemoBoxLineUp(1))}}>캘린더</button> &nbsp; / &nbsp; 
                <button onClick={()=>{dispatch(memoAction.setMemoBoxReverse(false))}}>원래대로</button>
                <button onClick={()=>{dispatch(memoAction.setMemoBoxReverse(true))}}>reverse</button>

                <br />

                <div style={{width: "1370px", height: "900px", overflow: "scroll", margin: "auto"}}>
                { weekDataList ? 
                    <div style={weekBoxLineUpStyle()}>
                        {weekTextBox(weekDataList)}
                    </div>
                    :
                    <div>???</div>
                }
                </div>
            </div>
        { memoData2 ?  
            <ReactModal
                isOpen={open}
                onRequestClose={()=>setOpen(false)}
                contentLabel="asdfasdf"
                ariaHideApp={false}
            >
                {memo(memoData2)}
            </ReactModal>

        :
            null
        }

        </div>
    )

}

export default MemoBoard;