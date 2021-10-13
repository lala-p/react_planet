import React, { useState } from 'react';
import { useCookies } from 'react-cookie';

import ToggleSwitch from 'react-switch';


const MainBoard = () => {

    const [removeSpace, setremoveSpace] = useState(false);
    const [cookie, setCookie, removeCookie] = useCookies();  


    return(

        <div>

            <div>
                <textarea name="mainText" cols="150" rows="40" onChange={(e) => setCookie('mainText', e.target.value, {path: '/', sameSite: 'Lax'})} value={cookie.mainText}></textarea>
                <br />
                removeSpace &nbsp; &nbsp; 
                <ToggleSwitch onChange={(checked) => setremoveSpace(checked)} checked={removeSpace} />
                
                <h1>총  {removeSpace ? cookie.mainText.replace(/\s/ig, "").length : cookie.mainText.replace(/\r?\n|\r/g, "").length}자</h1>
                <h2>asdfasdfadf</h2>
            </div>


        </div>

    )

}

export default MainBoard;