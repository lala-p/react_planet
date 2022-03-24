import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ReactModal from 'react-modal';

import * as memoAction from '../actions/memo';

const MemoBoard = () => {

    const dispatch = useDispatch();
    const boardText = useSelector((state) => state.boardText.boardText);
    const memoData = useSelector((state) => state.boardText.memoData)

    const weekBoxLineUp = useSelector((state) => state.memo.weekBoxLineUp);
    const memoBoxLineUp = useSelector((state) => state.memo.memoBoxLineUp);
    const memoBoxReverse = useSelector((state) => state.memo.memoBoxReverse)

    const week = useSelector((state) => state.astronaut.week)

    const [noneLineBreakText, setNoneLineBreakText] = useState("")
    const [weekText, setWeekText] = useState([])

    const [open, setOpen] = useState(false)
    const [memoText, setMemoText] = useState("")

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
                        let oneWeek = [false, false, false, false, false]

                        for (let index = 0; index < memo.length; index++) {

                            let date = memo[index].match(/={3}\s\d{4}\/\d{2}\/\d{2}\s\={20}/g)
                            date = date[0].replace(/(=|\s)/g, "")
                            let day = new Date(date).getDay()
                            oneWeek[day - 1] = memo[index]

                        }

                        memo = oneWeek

                        break;
                    default:
                        break;

                }

                if (memoBoxReverse) {
                    memo.reverse()
                }


                return (
                    <div>
                        <div style={{ display: "flex", width: "1350px", backgroundColor: "green" }}>
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


    const getMemo = (text) => {

        let text_copy = text

        let memo = {
            date: '',
            day: '',
            plan: [],
            etc: [],
        }

        memo['date'] = text_copy.match(/={3}\s\d{4}\/\d{2}\/\d{2}\s\={20}/g)
        text_copy = text_copy.replace(memo['date'], "")
        memo['date'] = memo['date'][0].replace(/(=|\s)/g, "")

        memo['day'] = week[new Date(memo['date']).getDay()]

        memo['etc'] = text_copy.split(/\+{1}/g)
        memo['etc'].shift()
        for (let index = 0; index < memo['etc'].length; index++) {
            text_copy = text_copy.replace('\n+' + memo['etc'][index], "")
        }

        memo['plan'] = text_copy.split(/\d{1,2}\.{1}\s{1}/g)
        memo['plan'].shift()



        return memo;

    }


    const memo = (memo) => {

        let text = memo
        let m = null

        if (text) {
            m = getMemo(text)
        }

        return (
            <div style={{ width: "260px", height: "150px", margin: "5px" }}>
                {text ?
                    <div>
                        <div>
                            {m['date']} - {m['day']}
                        </div>
                        <br />
                        <ol>
                            {planBox(m['plan'])}
                        </ol>
                        <br />
                        {etcBox(m['etc'])}
                    </div>
                    :
                    <div style={{ width: "100%", height: "100%" }}>
                        empty
                    </div>
                }

            </div>
        )

    }

    const memoBox = (dayOfMemo) => {
        const box = dayOfMemo.map((memo) => {

            let text = memo
            let m = null

            if (text) {
                m = getMemo(text)
            }

            return (
                <div style={{ width: "260px", height: "150px", margin: "5px" }}>
                    {text ?
                        <div style={{ width: "100%", height: "100%", backgroundColor: "skyblue" }}
                            onClick={() => {
                                setMemoText(memo)
                                setOpen(true)
                            }}
                        >
                            <div style={{ width: "240px", height: "125px", margin: "auto", paddingTop: "10px", overflow: "hidden" }}>
                                <table style={{ width: "100%" }}>
                                    <tbody>
                                        <tr>
                                            <td><b>{m['date']}</b></td>
                                            <td style={{ textAlign: "right" }}>{m['day']}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <br />
                                <ol style={{ paddingLeft: "20px" }}>
                                    {planBox(m['plan'])}
                                </ol>
                                <br />
                                {etcBox(m['etc'])}
                            </div>
                        </div>
                        :
                        <div style={{ width: "100%", height: "100%" }}>
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
                <pre style={{ wordBreak: "nowrap" }}>
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
                <li style={{ width: "800px" }}>
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
                {o != null ?
                    <span style={{ color: "blue" }}>
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
                {x != null ?
                    <span style={{ color: "red" }}>
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
                    {aList != null ?
                        <p style={{ color: "orange" }}>- {a}</p>
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
                <div style={{ backgroundColor: "salmon" }}>
                    =&gt; {c}
                </div>
            )
        })

        return box;
    }

    useEffect(() => {

        let text = boardText
        text = text.replace(/\n/g, "")
        setNoneLineBreakText(text)

    }, [boardText])


    useEffect(() => {

        const weekTextLine = /(?<=-{35})\s*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-\s*(?=\={3}\s\d{4}\/\d{2}\/\d{2}\s\={20})/g
        // const weekTextLine = /-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-/g

        let weekTextArr = []

        if (noneLineBreakText.length != 0) {
            weekTextArr = noneLineBreakText.split(/(?<=-{35})\s*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-\s*(?=\={3}\s\d{4}\/\d{2}\/\d{2}\s\={20})/g)
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

        return style;
    }


    return (
        <div className="MemoTable">
            <div>
                주 : &nbsp;&nbsp;
                <button onClick={() => { dispatch(memoAction.setWeekBoxLineUp(0)) }}>최근 날짜부터</button>
                <button onClick={() => { dispatch(memoAction.setWeekBoxLineUp(1)) }}>오래된 것부터</button>
                &nbsp;
                일 :&nbsp;&nbsp;
                <button onClick={() => { dispatch(memoAction.setMemoBoxLineUp(0)) }}>순서대로</button>
                <button onClick={() => { dispatch(memoAction.setMemoBoxLineUp(1)) }}>캘린더</button> &nbsp; / &nbsp;
                <button onClick={() => { dispatch(memoAction.setMemoBoxReverse(false)) }}>원래대로</button>
                <button onClick={() => { dispatch(memoAction.setMemoBoxReverse(true)) }}>reverse</button>

                <br />

                <div style={{ width: "1370px", height: "900px", overflow: "scroll", margin: "auto" }}>
                    {weekText.length == 0 ?
                        <div>???</div>
                        :
                        <div style={weekBoxLineUpStyle()}>
                            {weekTextBox(weekText)}
                        </div>
                    }
                </div>
            </div>

            <ReactModal
                isOpen={open}
                onRequestClose={() => setOpen(false)}
                contentLabel="asdfasdf"
                ariaHideApp={false}
            >
                {memo(memoText)}
            </ReactModal>

        </div>
    )

}

export default MemoBoard;