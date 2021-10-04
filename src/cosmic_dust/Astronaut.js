import React, { useEffect } from 'react';
import axios from "axios";
import { useCookies } from "react-cookie";

const Astronaut = () => {

    const [cookies, setCookie, removeCookie] = useCookies()

    
    useEffect(() => {

        let url = "http://localhost:3001/getAstronaut";

        axios.post(url)
        .then((response) => {

            const astronaut = {

                astronaut_id       : response.data.astronaut_id,
                astronaut_nickname : response.data.astronaut_nickname,
                astronaut_password : response.data.astronaut_password,
                meal_menu          : response.data.meal_menu,

            } 

            Object.keys(astronaut).forEach(function(key){
                setCookie(key, astronaut[key], {path: '/', sameSite: 'Lax'}) 
            })
    
            // haha = "asdfasdfasdfasasdfasfasfasfasfasfafasdfasdfasdfasfdasdf12341234123412f"

        })
        .catch((error) => {
            console.log(error)
        })

        
    }, [])

   
    return <></>;

}


export default Astronaut;


// axiox로 값 가져와서 cookie에 넣기 