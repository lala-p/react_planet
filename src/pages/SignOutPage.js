import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';


const SignOutPage = () => {

    const history = useHistory()
    const [cookies, setCookie, removeCookie] = useCookies()


    useEffect(() => {
        
        removeCookie("user_id")
        history.push("/")

    }, [])

    
    return (
        <div>
            
        </div>
    );
}

export default SignOutPage;
