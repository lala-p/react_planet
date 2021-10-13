import React, { useState } from 'react';


const MainBoard = () => {

    const [mainText, setMainText] = useState("");
    const [removeSpace, setremoveSpace] = useState(false);

    return(

        <div>

            <div>
                <textarea name="mainText" cols="150" rows="40" onChange={(e) => setCookie('mainText', e.target.value, {path: '/', sameSite: 'Lax'})} value={cookie.mainText}></textarea>
                <br />
                removeSpace &nbsp; &nbsp; 
                <ToggleSwitch onChange={(checked) => setremoveSpace(checked)} checked={removeSpace} />
                
                <h1>총  {removeSpace ? mainText.replace(/\s/ig, "").length : mainText.replace(/\r?\n|\r/g, "").length}자</h1>
                <h2>asdfasdfadf</h2>
            </div>


        </div>

    )

}

export default MainBoard;