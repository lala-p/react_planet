import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


const MemoBoard = () => {

    const mainText = useSelector((state) => state.mainText.mainText);
    const [noneLineBreakText, setNoneLineBreakText] = useState("")

    const [week, setWeek] = useState([])
    

    const weekBox = (text) =>{
        const box = text.map((thatWeek) => {

            let memo = []
            memo = thatWeek.split(/\-{35}/g)
            memo.pop()

            return (
                <div>
                    <div style={{display: "flex", width: "1350px", backgroundColor: "green"}}>
                        {memoBox(memo)}
                    </div>
                    <hr />
                    <br />
                </div>
            )
        })

        return box;
    }


    const memoBox = (dayOfMemo) => {
        const box = dayOfMemo.map((memo) => {

            let text = memo

            let date = text.match(/={3}\s\d{4}\/\d{2}\/\d{2}\s\={20}/g)
            date = date[0].replace(/(=|\s)/g, "")
            text = text.replace(/={3}\s\d{4}\/\d{2}\/\d{2}\s\={20}/g)

            let etc = text.split(/\+{1}/g)
            etc.shift()
            for (let index = 0; index < etc.length; index++) {
                text = text.replace('+' + etc[index], "")
            }

            let plan = text.split(/\d{1}\.{1}/g)
            plan.shift()

            return (
                <div style={{width: "260px", height: "150px", backgroundColor: "gray", margin: "5px"}}>
                    <b>{date}</b>
                    <br />
                    <ol>
                        {planBox(plan)}

                    </ol>
                    <br /><br /> 
                    {etcBox(etc)}                   
                </div>            
            )
        })

        return box;
    }

    const planBox = (dayOfPlan) => {
        const box = dayOfPlan.map((plan) => {
            return (
                <li>
                    {plan}
                </li>
            ) 
        })
        
        return box;
    }

    const etcBox = (dayOfEtc) => {
        const box = dayOfEtc.map((etc) => {
            return (
                <div>
                    {"+ " + etc}
                </div>
            )
        })

        return box;
    }

   
    useEffect(() => {
        
        let text = mainText
        text = text.replace(/\n/g,"")
        setNoneLineBreakText(text)
    
    }, [mainText])


    useEffect(() => {

        const weekLine = /(?<=-{35})-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-(?=\={3}\s\d{4}\/\d{2}\/\d{2}\s\={20})/g
        let weekArr = []

        if (noneLineBreakText.length != 0) {
            weekArr = noneLineBreakText.split(weekLine)
        }

        setWeek(weekArr)

    }, [noneLineBreakText])


    return(
        <div>
            
            <br />

            <div style={{width: "1370px", height: "900px", overflow: "scroll", margin: "auto"}}>
            { week.length == 0 ? 
                <div>???</div>
                : 
                weekBox(week)
            }

            </div>
        </div>
    )

}

export default MemoBoard;