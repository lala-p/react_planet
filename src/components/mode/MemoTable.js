import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';


const MemoBoard = () => {

    const [test, setTest] = useState('');

    const dispatch = useDispatch();
    const mainText = useSelector((state) => state.mainText.mainText);

    // const [mainText, setMainText] = useState("")

    const [week, setWeek] = useState([])
    // const [day, setDay]   = useState([])
    const [plan, setPlan] = useState([])
    const [etc, setEtc]   = useState([])
    
    const [memo, setMemo] = useState([]) 
    


    const planBox = (dayOfPlan) => {
        const box = dayOfPlan.map((plan) => (
            <div>
                
            
            </div>
        ))
        return box;
    }


    // const dayBox = day.map((dayBox) => (
    //     <div>
            


    //     </div>
    // ))

    const memoBox = (dayOfMemo) => {
        const box = dayOfMemo.map((memo) => (
            <div style={{width: "260px", height: "150px", backgroundColor: "gray", margin: "5px"}}>
                {memo}
            </div>            
        ))

        return box;
    }

    const gg = [1,2,3,4]

    const weekBox = week.map((thatWeek) => (
        <div>
            <div style={{display: "flex", width: "1350px", backgroundColor: "green"}}>
                {/* <div style={{width: "285px", height: "150px", backgroundColor: "gray", marginLeft: "20px"}}></div>
                <div style={{width: "285px", height: "150px", backgroundColor: "gray", marginLeft: "20px"}}></div>
                <div style={{width: "285px", height: "150px", backgroundColor: "gray", marginLeft: "20px"}}></div>
                <div style={{width: "285px", height: "150px", backgroundColor: "gray", marginLeft: "20px"}}></div>
                <div style={{width: "285px", height: "150px", backgroundColor: "gray", marginLeft: "20px"}}></div> */}
                {memoBox(thatWeek.memo)}
            </div>
            <hr />
            <br />
        </div>
    ))

   
    const [count, setCount] = useState(0)
    useEffect(() => {
        // 일주일마다 나누고
        // memo 만드는 것까지 
        
        let text = mainText
        text = text.replace(/\n/g,"")
        const weekLine = /(?<=-{35})-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-(?=\={3}\s\d{4}\/\d{2}\/\d{2}\s\={20})/g
        let weekArr = []

        if (text.length != 0) {
            weekArr = text.split(weekLine)
            // console.log(weekArr)
        }

        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
        let bb = []
        // let bbCount = 0

        for (let index = 0; index < weekArr.length; index++) {
            let memo = weekArr[index].split(/\-{35}/g)
            memo.pop()
            bb.push({
                memo: memo
            })
            // bbCount += yy.length
        }

        console.log(bb.length)
        
        setCount(text)
        setWeek(bb)

    }, [mainText])


    useEffect(() => {


        let day = []
        let bb = []

        for (let index = 0; index < week.length; index++) {
            day = week[index]['memo']


        }

        console.log("count")
        // setWeek(bb)
    }, [count])


    return(
        <div>
            {/* <div>
                <textarea value={mainText} onChange={(e)=>setMainText(e.target.value)}></textarea>
            </div> */}
                {/* {test}
            <button onClick={()=> setTest('asdfasdfadfsfdasdf')}>click</button> 
            useState 값은 mode가 변경되면 초기화됨. */}
            <br /><br />
            <br />

            <div style={{width: "1370px", height: "900px", overflow: "scroll", margin: "auto"}}>
            { week.length == 0 ? 
                <div>???</div>
                : 
                weekBox
            }


            </div>


            {/* <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
            <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
            <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
            <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp; */}

            {/* <div style={{display: "flex"}}>
                    
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                
            </div>
            <hr />
            <br />
            <div style={{display: "flex"}}>
                
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                
            </div>
            <hr />
            <br />
            <div style={{display: "flex"}}>
                
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                
            </div>
            <hr />

            <br />
            <div style={{display: "flex"}}>
                
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                
            </div>
            <hr />

            <br />
            <div style={{display: "flex"}}>
                
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                
            </div>
            <hr /> */}
        </div>
    )

}

export default MemoBoard;