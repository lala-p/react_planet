import React, { useCallback, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';

import ReactModal from 'react-modal'; 


import '../css/components/MemoTable.scss';

const MemoTable2 = () => {

    const dispatch = useDispatch();
    
    const memoUseTextList = useSelector((state) => state.memo.memoUseTextList)
    const week = useSelector((state) => state.astronaut.week)

    const [dayDataModalOpen, setDayDataModalOpen] = useState(false)
    const [dayDataModalData, setDayDataModalData] = useState(false)

    const weekDataBoxContainer = useCallback(
        (weekDataList) => {
            const containerModel = (dataList) => {
                return (
                    <div className={"week-data-box-container "}>
                        { weekDataBoxes(dataList) }
                    </div>
                ) 
            }

            const container = containerModel(weekDataList)

            return container;

        }, []
    )

    const weekDataBoxes = useCallback(
        (weekDataList) => {
            const boxes = weekDataList.map((weekData) => {

                let lineUp = []

                for (let index = 0; index < weekData.length; index++) {
                    lineUp.push(weekData[index])
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
        }, 
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
            <br /><br />
            { weekDataBoxContainer(memoUseTextList) }

            {dayDataModal(dayDataModalData)}
            
            {/* style={{width: "1370px", height: "900px", overflow: "scroll", margin: "auto"}} */}
        </div>
    )
}

export default MemoTable2;