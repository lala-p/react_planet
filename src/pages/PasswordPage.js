import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Astronaut from '../cosmic_dust/Astronaut';
import { useHotkeys } from 'react-hotkeys-hook';


const Password = () => {

    const [userId, setUserId] = useState('haha1234');
    const [password, setPassword] = useState();
    const [msg, setMsg] = useState('');


    const EnterPassword = (e) => {

        if(e.key == 'Enter'){


            let url = "http://localhost:3001/password";

            const passwordBox = {
    
                password: password,
    
            }
    
            axios.post(url, passwordBox)
            .then((response) => {
    
                console.log(response.data)
                setMsg(response.data)


                if(response.data == "login"){

                    this.props.history.push('/test');
                }
                
    
            })
            .catch((error) => {
                console.log(error)
            })
    


        }



    }


    
    return(

        <div>
            
            <Astronaut />
            
            
            <div>


                <h3>{userId}</h3> 
                <input type="text" name="password" id="password" onChange={(e) => setPassword(e.target.value)} onKeyPress={() => EnterPassword} />
                <p>{msg}</p>

                {/* <button type="button" onClick={(e)=> Astronauts.Baba()}>asdfasdfasf</button> */}


            </div>


        </div>

    )


}

export default Password;
