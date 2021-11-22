import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import * as memoAction from '../../actions/memo';


const MemoBoard = () => {

    const dispatch = useDispatch();
    const mainText = useSelector((state) => state.mainText.mainText);

    const weekBoxLineUp = useSelector((state) => state.memo.weekBoxLineUp);
    const memoBoxLineUp = useSelector((state) => state.memo.memoBoxLineUp);
    const memoBoxReverse = useSelector((state) => state.memo.memoBoxReverse)

    const week = useSelector((state) => state.astronaut.week)

    const [noneLineBreakText, setNoneLineBreakText] = useState("")
    const [weekText, setWeekText] = useState([])
    

    const weekTextBox = useCallback(
        (text) => {
            const box = text.map((thatWeek) => {

                let memo = []

                memo = thatWeek.split(/\-{35}/g)
                memo.pop()

                switch (memoBoxLineUp) {
                    case 0:
                        break;
                    case 1:
                        let oneweek = [false, false, false, false, false]
        
                        for (let index = 0; index < memo.length; index++) {

                            let date = memo[index].match(/={3}\s\d{4}\/\d{2}\/\d{2}\s\={20}/g)
                            date = date[0].replace(/(=|\s)/g, "")
                            let day = new Date(date).getDay()
                            oneweek[day-1] = memo[index]

                        }
                            
                        memo = oneweek
                        
                        break;
                    default:
                        break;
                        
                }

                if (memoBoxReverse) {
                    memo.reverse()
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
        }, [noneLineBreakText, memoBoxLineUp, memoBoxReverse]
    ) 

    const memoBox = (dayOfMemo) => {
        const box = dayOfMemo.map((memo) => {

            let text = memo

            let date = ""
            let plan = []
            let etc = []

            if (text) {
                
                date = text.match(/={3}\s\d{4}\/\d{2}\/\d{2}\s\={20}/g)
                text = text.replace(date)
                date = date[0].replace(/(=|\s)/g, "")


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
                        <div style={{width: "240px", height: "125px", margin: "auto", paddingTop: "10px", overflow: "hidden"}}>
                            <table style={{width: "100%"}}>
                                <tbody>
                                    <tr>
                                        <td><b>{date}</b></td>
                                        <td style={{textAlign: "right"}}>{week[new Date(date).getDay()]}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <br />
                            <ol>
                                {planBox(plan)}
                            </ol>
                            <br />
                            {etcBox(etc)}                   
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

    const planBox = (dayOfPlan) => {
        const box = dayOfPlan.map((plan) => {
            return (
                <li>
                    <pre>{plan}</pre>
                </li>
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

   
    useEffect(() => {
        
        let text = mainText
        text = text.replace(/\n/g,"")
        setNoneLineBreakText(text)
    
    }, [mainText])


    useEffect(() => {

        const weekTextLine = /(?<=-{35})-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-(?=\={3}\s\d{4}\/\d{2}\/\d{2}\s\={20})/g
        let weekTextArr = []

        if (noneLineBreakText.length != 0) {
            weekTextArr = noneLineBreakText.split(weekTextLine)
        }

        setWeekText(weekTextArr)

    }, [noneLineBreakText])


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
    
        return style
    }

    
    return(
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
            { weekText.length == 0 ? 
                <div>???</div>
                :
                <div style={weekBoxLineUpStyle()}>
                    {weekTextBox(weekText)}
                </div>
            }
            </div>
        </div>
    )

}

export default MemoBoard;