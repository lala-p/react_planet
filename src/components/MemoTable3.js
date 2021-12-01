import React from "react";
import { useSelector, useDispatch } from 'react-redux';

import ReactModal from 'react-modal';


const weekDataBoxes = (weekDataList, weekBoxLineUp, memoBoxLineUp, memoBoxReverse, oneWeek) =>{
    const boxes = weekDataList.map((weekData) => {

        return (
            <div>

            </div>
        )
    })    

    return boxes;
}

const dayDataBox = (dayData) => {
    const boxModel = (data) => {
        
        return (
            <div>

            </div>
        )
    }

    const box = boxModel(dayData)
 
    return box;
}

const dayDataModal = (dayData) => {
    const modalModel = (data) => {

        return (
            <div>
                
            </div>
        )
    }
    
    const modal = modalModel(dayData)

    return modal;
}


const dayMemoBoxes = (dayDataList) => { 
    const boxes = dayDataList.map((dayData) => {

        return (
            <div>

            </div>
        )
    })

    return boxes;
}


const planBoxes = (planList) => {
    const boxes = planList.map((planData) => {

        return(
            <div>

            </div>
        )
    })
    
    return boxes;
} 

const planStateBox = (stateCode) => { 
    const boxModel = (code) => {

        return (
            <div>

            </div>
        )
    }

    const box = boxModel(stateCode)

    return box;
}

const planInfoBoxes = (infoList) => {
    const boxes = infoList.map((info) => {

        return (
            <div>

            </div>
        )
    })

    return boxes;
}

const planConclusionBoxes = (conclusionList) => {
    const boxes = conclusionList.map((conclusion) => {
        
        return (
            <div>

            </div>
        )
    })

    return boxes;
} 

const etcBoxes = (etcList) => {
    const boxes = etcList.map((etc) => {

        return (
            <div>

            </div>
        )
    }) 

    return boxes;
}



const MemoTable2 = () => {

    const dispatch = useDispatch();

    const weekDataList = useSelector((state) => state.mainText.weekDataList)

    const weekBoxLineUp  = useSelector((state) => state.memo.weekBoxLineUp);
    const memoBoxLineUp  = useSelector((state) => state.memo.memoBoxLineUp);
    const memoBoxReverse = useSelector((state) => state.memo.memoBoxReverse)

    const oneWeek = useSelector((state) => state.astronaut.oneWeek)

    return (
        <div>
                   

        </div>
    )
}

export default MemoTable2;