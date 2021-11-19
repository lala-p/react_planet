import React, {useState, useEffect, useRef} from 'react';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';


const Password = () => {

    const history = useHistory()

    const [userId, setUserId] = useState('')
    const [password, setPassword] = useState('')
    const [msg, setMsg] = useState('')

    const userIdRef = useRef(null)
    const passwordRef = useRef(null)


    const EnterUserId = (e) => {
        if (e.keyCode == 13) { // enter
            passwordRef.current.focus()
        }
    }

    const EnterPassword = (e) => {

        if (e.keyCode == 13) { // enter

            // axios

            // let url = "http://localhost:3001/login";
            // const loginBox = {
            //     userId: userId,
            //     password: password,
            // }
            // axios.post(url, loginBox)
            // .then((response) => {    
            //     console.log(response.data)
            //     setMsg(response.data)
            //     if(response.data == "login"){
            //         history.push("/main")
            //     }
            // })
            // .catch((error) => {
            //     console.log(error)
            // })


            if (userId == "lala-p" && password == "asdf!@#$") {
                history.push("/main")
            } else {
                setUserId('')
                setPassword('')
                userIdRef.current.focus()
                setMsg("wrong!@!")
            }

            console.log(password)
            
        }

    }


    useEffect(() => {
        
        userIdRef.current.focus()

    }, [])

    return(

        <div>
            <div>

                <h3>Login</h3>
                <input ref={userIdRef} type="text" id="userId" value={userId} onChange={(e) => setUserId(e.target.value)} onKeyDown={EnterUserId} placeholder="ID" />
                <br />                
                <input ref={passwordRef} type="text" id="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={EnterPassword} placeholder="Password" />
                <p>{msg}</p>
            </div>

        </div>

    )

}

export default Password;
