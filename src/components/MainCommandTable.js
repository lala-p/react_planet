import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useCookies } from 'react-cookie';

import * as CommandEvent from '../event/CommandEvent';

const MainCommandTable = () => {

    const [userInput, setUserInput] = useState("")
    const [msgHistory, setMsgHistory] = useState([])
    const [guideSayArr, setGuideSayArr] = useState([])
    const [cookie, setCookie] = useCookies()    

    const tableRef = useRef(null)

    
    const enterUserInput = (e) => {

        if(e.key == 'Enter'){
            if(userInput == "clear"){
                setMsgHistory([])
            }else{
                console.log(userInput)
                setMsgHistory(msgHistory.concat('me:' + userInput))
                console.log(msgHistory)    
                const cmd = userInput.split(" "); 
                console.log(cmd);
                setGuideSayArr(CommandEvent.cmd(cmd))    
            
            }
        }

    }


    const guideSaid = () => {
        setTimeout(()=>{

            setMsgHistory(msgHistory.concat('gu:'+guideSayArr[0]))
            guideSayArr.shift()
        
            console.log(guideSayArr)
            console.log("lnth: " + guideSayArr.length)
    
        }, 250)    
    }


    useEffect(() => {

        // node server가 켜져있지 않았을 때 명령어창에 erorr 띄우기 

    }, [])


    useEffect(() => {

        if(guideSayArr && guideSayArr.length != 0){            
            guideSaid()
        }

        
        setUserInput("")

        const scroll = tableRef.current.scrollHeight - tableRef.current.clientHeight;
        tableRef.current.scrollTo(0, scroll)

    }, [msgHistory, guideSayArr])


    const msgList = msgHistory.map((msg, index) => (<div> {msg.substr(0, 3) === 'me:' ? 
                                                        <div key={index} style={{minHeight: '25px', overflow: "hidden", wordWrap: "break-word", backgroundColor: "pink"}}>&lt;me&gt; {msg.substr(3)}</div> : 
                                                        <div dangerouslySetInnerHTML={{__html: msg.substr(3)}} key={index} style={{minHeight: '25px',overflow: "hidden", wordWrap: "break-word", backgroundColor: "pink"}}></div> } 
                                                    </div>))

    return(

        <div>

            <div ref={tableRef} style={{display: "flex", width: "270px", height: "350px", backgroundColor: "coral", overflow: "auto", flexDirection: "column-reverse"}}>
                <div>
                    {msgList}
                </div>
            </div>
            <input type="text" style={{width: "265px"}} onKeyPress={enterUserInput} value={userInput} onChange={(e)=> setUserInput(e.target.value)} />

        </div>

    )

}

export default MainCommandTable;