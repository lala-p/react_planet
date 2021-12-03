import React, { useCallback, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';

import ReactModal from 'react-modal'; 


import '../css/components/MemoTable.scss';

const MemoTable2 = () => {

    const dispatch = useDispatch();
    
    const weekDataList = useSelector((state) => state.mainText.weekDataList)

    // const weekDataBoxLineUp  = useSelector((state) => state.memo.weekBoxLineUp)
    const [weekDataBoxLineUp, setWeekDataBoxLineUp] = useState(0)
    const memoBoxLineUp  = useSelector((state) => state.memo.memoBoxLineUp)
    const memoBoxReverse = useSelector((state) => state.memo.memoBoxReverse)

    // const oneWeek = useSelector((state) => state.astronaut.oneWeek)
    const week = useSelector((state) => state.astronaut.week)

    const [dayDataModalOpen, setDayDataModalOpen] = useState(false)
    const [dayDataModalData, setDayDataModalData] = useState(false)


    const weekDataBoxContainer = useCallback(
        (weekDataList) => {
            const containerModel = (dataList) => {
                let lineUpClassName = ""

                switch (weekDataBoxLineUp) {
                    case 0:
                        lineUpClassName = "desc"
                        break;
                    case 1:
                        lineUpClassName = "asc"
                        break;

                    default:
                        lineUpClassName = "asc"

                        break;
                }    

                return (
                    <div className={"week-data-box-container " + lineUpClassName}>
                        { weekDataBoxes(dataList) }
                    </div>
                ) 
            }

            const container = containerModel(weekDataList)

            return container;

        }, [weekDataList, weekDataBoxLineUp, memoBoxLineUp, memoBoxReverse]
    )

    const weekDataBoxes = useCallback(
        (weekDataList) => {
            const boxes = weekDataList.map((weekData) => {

                let lineUp = []

                for (let index = 0; index < weekData.length; index++) {
                    lineUp.push(weekData[index])
                }

                switch (memoBoxLineUp) {
                    case 0:
                        break;
                    case 1:
                        let oneWeek = {1: false, 2: false, 3: false, 4: false, 5: false} 
                        
                        for (let index = 0; index < lineUp.length; index++) {
                            oneWeek[lineUp[index]['day']] = lineUp[index]                        
                        }
                        lineUp = Object.values(oneWeek)
                        
                        break; 
                    
        
                    default: 
                        break;     
                }

                if (memoBoxReverse) {
                    lineUp.reverse()
                }
                                
                return (
                    <div className="week-data-box">
                        <div className={"box-container"}>
                            { dayMemoBoxes(lineUp) }
                        </div>
                        <div className={"line"}>
                            line
                        </div>
                    </div>
                )
            })    

            return boxes;
        }, [weekDataList, weekDataBoxLineUp, memoBoxLineUp, memoBoxReverse]
    ) 

    const dayDataBox = (dayData) => {
        const boxModel = (data) => {
            
            return (
                <div>
                    <h3>{ data['date'] }</h3>
                    <br />
                    { week[data['day']] }
                    <br /><br /><br />
                    { planBoxes(data['planList']) }
                    <br /><br />
                    {etcBoxes(data['etc'])}
                </div>
            )
        }

        const box = boxModel(dayData)
    
        return box;
    }

    const dayDataModal = (dayData) => {
        const modalModel = (data) => {

            return (
                <div className={"day-data-modal"}>
                { dayDataModalData ? 
                    <ReactModal
                        isOpen={dayDataModalOpen}
                        onRequestClose={()=>setDayDataModalOpen(false)}
                        contentLabel="dayDataModal"
                        ariaHideApp={false}
                    >
                        { dayDataBox(data) }
                    </ReactModal>                
                
                :
                    null
                }
                </div>
            )
        }
        
        const modal = modalModel(dayData)

        return modal;
    }


    const dayMemoBoxes = (dayDataList) => { 
        const boxes = dayDataList.map((dayData) => {

            return (
                <div 
                    className={"day-memo-box"} 
                    onClick={() => { 
                        setDayDataModalData(dayData)
                        setDayDataModalOpen(true)
                    }}
                >
                    { dayData['date'] } - { week[dayData['day']] }
                    <br />
                    plan count: { dayData['planList'].length }
                    <br />
                    <br />
                    etc count: { dayData['etc'].length }
                </div>
            )
        })

        return boxes;
    }


    const planBoxes = (planList) => {
        const boxes = planList.map((planData) => {

            return(
                <div className={"plan-box"}> 
                    { planData['plan'] }
                    { planStateBox(planData['state']) }
                    { planInfoBoxes(planData['info']) }
                    { planConclusionBoxes(planData['conclusion']) }                    
                </div>
            )
        })
        
        return boxes;
    } 

    const planStateBox = (stateCode) => { 
        const boxModel = (code) => {
            let state = ""

            switch (code) {
                case 0:
                    state = "모름"
                    break;
                case 1:
                    state = "완료"
                    break;
                case 2:
                    state = "실패"
                    break;
                case 3:
                    state = "미룸"
                    break;
                case 4:
                    state = "언젠간함."
                    break;

                default:
                    break;
            }
            

            return (
                <div className="plan-state-box">
                    {state}
                </div>
            )
        }

        const box = boxModel(stateCode)

        return box;
    }

    const planInfoBoxes = (infoList) => {
        const boxes = infoList.map((info) => {

            return (
                <div className={"plan-info-box"}>
                    - {info}
                </div>
            )
        })

        return boxes;
    }

    const planConclusionBoxes = (conclusionList) => {
        const boxes = conclusionList.map((conclusion) => {
            
            return (
                <div className={"plan-conclusion-box"}>
                    {conclusion}
                </div>
            )
        })

        return boxes;
    } 

    const etcBoxes = (etcList) => {
        const boxes = etcList.map((etc) => {

            return (
                <pre style={{wordBreak: "nowrap"}}>
                    {"+ " + etc}
                </pre>

            )
        }) 

        return boxes;
    }


    return (
        <div className="MemoTable">

            <div>
                <button onClick={() => {setWeekDataBoxLineUp(0)}}>000</button>
                <button onClick={() => {setWeekDataBoxLineUp(1)}}>111</button>
            </div>            
            <br /><br />
            { weekDataBoxContainer(weekDataList) }

            {dayDataModal(dayDataModalData)}
            
            {/* style={{width: "1370px", height: "900px", overflow: "scroll", margin: "auto"}} */}
        </div>
    )
}

export default MemoTable2;