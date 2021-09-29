import React, { useState } from 'react';
import ToggleSwitch from 'react-switch';


const MainBoard = (props) => {


    const [mainText, setMainText] = useState("");
    const [removeSpace, setremoveSpace] = useState(false);


    return(

        <div>


            <div>

                <textarea name="mainText" cols="150" rows="40" onChange={(e) => setMainText(e.target.value)} value={mainText}>
                    {props.children}
                </textarea>

                removeSpace &nbsp; &nbsp; 
                <ToggleSwitch onChange={(checked) => setremoveSpace(checked)} checked={removeSpace} />
                
                <h1>총  {removeSpace ? mainText.replace(/\s/ig, "").length : mainText.replace(/\r?\n|\r/g, "").length}자</h1>

            </div>

            


        </div>

    )

}

export default MainBoard;