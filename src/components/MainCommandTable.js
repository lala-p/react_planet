import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useCookies } from 'react-cookie';

import CommandEvent from '../event/CommandEvent';
import { CommandInit, Command } from '../event/CommandEvent';

const MainCommandTable = () => {

    const [userInput, setUserInput] = useState("")
    
    const [cmdHistory, setCmdHistory] = useState([])
    const [cmdAddr, setCmdAddr] = useState(-100)
    
    const [msgHistory, setMsgHistory] = useState([])
    const [guideSayArr, setGuideSayArr] = useState([])
    
    const [cookie, setCookie, removeCookie] = useCookies()    

    const tableRef = useRef(null)


    
    const keyDownHandler = (e) => {
        switch (e.keyCode) {
            case 13: // enter
                if (userInput == "clear") {
                    setMsgHistory([])
                } else {
                    console.log(userInput)
                    setMsgHistory(msgHistory.concat('me:' + userInput))
                    
                    const sendCmd = userInput.match(/[a-zA-z\.+\?+]+|\(.+\)/g);
                    const cmd = Command(sendCmd)

                    if (cmd !== undefined) {
                        setGuideSayArr(cmd)
                    }
                }
                
                if (userInput.length != 0 && userInput != cmdHistory[cmdHistory.length-1]) {
                    setCmdHistory(cmdHistory.concat(userInput))
                    setCmdAddr(cmdHistory.length+1)

                }else{
                    setCmdAddr(cmdHistory.length)
                }

                break;
            case 38: // arrow up
                if (cmdAddr > 0) {
                    setCmdAddr(cmdAddr-1)
                }

                break;
            case 40: // arrow down
                if (cmdAddr < cmdHistory.length-1) {
                    setCmdAddr(cmdAddr+1)
                }

                break;
            default:

                break;
        }

    
        
    }

    useEffect(() => {

        console.log("addr : " + cmdAddr)


        setUserInput(cmdHistory[cmdAddr])
        console.log(cmdHistory)


    }, [cmdAddr])

    
    const guideSaid = () => {
        setTimeout(()=>{

            setMsgHistory(msgHistory.concat('gu:'+guideSayArr[0]))
            guideSayArr.shift()
        
            console.log(guideSayArr)
            // console.log("lnth: " + guideSayArr.length)
    
        }, 250)    
    }


    useEffect(() => {

        // node server가 켜져있지 않았을 때 명령어창에 erorr 띄우기 

        CommandInit()
       

    }, [])

    useEffect(() => {

        if(guideSayArr && guideSayArr.length != 0){            
            guideSaid()
        }
        
        setUserInput("")

        const scroll = tableRef.current.scrollHeight - tableRef.current.clientHeight;
        tableRef.current.scrollTo(0, scroll)

        // console.log(msgHistory)
    }, [msgHistory, guideSayArr])


    const msgList = msgHistory.map((msg, index) => (<div> {msg.substr(0, 3) === 'me:' ? 
                                                        <div key={index} style={{minHeight: '25px', overflow: "hidden", wordBreak: "break-all", backgroundColor: "pink"}}>&lt;{cookie['astronaut_id']}&gt; {msg.substr(3)}</div> : 
                                                        <div dangerouslySetInnerHTML={{__html: msg.substr(3)}} key={index} style={{minHeight: '25px',overflow: "hidden", wordBreak: "break-all", backgroundColor: "pink"}}></div> } 
                                                    </div>))

    return(

        <div>
            <CommandEvent />

            <div ref={tableRef} style={{display: "flex", width: "270px", height: "350px", backgroundColor: "coral", overflow: "auto", flexDirection: "column-reverse"}}>
                <div>
                    {msgList}
                </div>
            </div>
            <input type="text" style={{width: "265px"}} onKeyDown={(e) => keyDownHandler(e)} value={userInput} onChange={(e)=> setUserInput(e.target.value)} />

        </div>

    )

}

export default MainCommandTable;