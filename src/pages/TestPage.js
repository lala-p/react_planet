import React, { useState } from 'react';
import axios from 'axios';


const TestPage = () => {


    const [haha, setHaha] = useState("")
    const [blabla, setBlabla] = useState(['me:asd1f', 'me:as2df', 'ch:asdf3', 'ch:4', 'ch:55555', 'ch:6666666'])



    const blablaList = blabla.map((blabla, index) => (<div>
        {blabla.substr(0, 3) === 'me:' ? <div key={index} style={{ float: "right" }}>{blabla.substr(3)}</div> :
            <div key={index} style={{ float: "left" }}>{blabla.substr(3)}</div>}
        <br /> </div>))


    const addblabla = (e) => {

        if (e.key == 'Enter') {

            setBlabla(blabla.concat('me:' + e.target.value))
            console.log(e.target.value)
            console.log(blabla)
            setHaha("")

        }
    }

    return (
        <div>

            <input type="text" onKeyPress={addblabla} value={haha} onChange={(e) => setHaha(e.target.value)} />



            <div style={{ width: "270px", backgroundColor: "coral" }}>

                {blablaList}

            </div>

        </div>

    )

}

export default TestPage;