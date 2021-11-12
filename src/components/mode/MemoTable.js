import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


const MemoBoard = () => {

    const mainText = useSelector((state) => state.mainText.mainText);
    const [noneLineBreakText, setNoneLineBreakText] = useState("")

    const [week, setWeek] = useState([])
    
    const [mode, setMode] = useState(0)



    const weekBox = useCallback(
        (text) => {
            const box = text.map((thatWeek) => {

                let memo = []
                
                switch (mode) {
                    case 0:
                        memo = thatWeek.split(/\-{35}/g)
                        memo.pop()

                        break;
                    case 1:
                        let weekday = [false, false, false, false, false]
        
                        memo = thatWeek.split(/\-{35}/g)
                        memo.pop()

                        for (let index = 0; index < memo.length; index++) {

                            let date = memo[index].match(/={3}\s\d{4}\/\d{2}\/\d{2}\s\={20}/g)
                            date = date[0].replace(/(=|\s)/g, "")
                            let day = new Date(date).getDay()
                            weekday[day-1] = memo[index]

                        }

                        memo = weekday
                        
                    default:
                        break;
                }
                    
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

            console.log(box.length)

            return box;
        }, [noneLineBreakText, mode]
    ) 

    const memoBox = (dayOfMemo) => {
        const box = dayOfMemo.map((memo) => {

            let text = memo

            let date = ""
            let plan = []
            let etc = []

            if (text) {

                date = text.match(/={3}\s\d{4}\/\d{2}\/\d{2}\s\={20}/g)
                date = date[0].replace(/(=|\s)/g, "")
                text = text.replace(/={3}\s\d{4}\/\d{2}\/\d{2}\s\={20}/g)

                etc = text.split(/\+{1}/g)
                etc.shift()
                for (let index = 0; index < etc.length; index++) {
                    text = text.replace('+' + etc[index], "")
                }

                plan = text.split(/\d{1}\.{1}/g)
                plan.shift()

            }

            return (
                <div style={{width: "260px", height: "150px", margin: "5px"}}>
                { text ?
                    <div style={{width: "100%", height: "100%", backgroundColor: "skyblue"}}>
                        <b>{date}</b>
                         <br />
                         <ol>
                             {planBox(plan)}
                         </ol>
                         <br /><br /> 
                         {etcBox(etc)}                   
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
            <button onClick={()=>{setMode(0); console.log(0)}}>순서대로</button>
            <button onClick={()=>{setMode(1); console.log(1)}}>캘린더</button>
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