import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
// import Astronaut from '../cosmic_dust/Astronaut';
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


    const [text, setText] = useState("")
    const [testList, setTestList] = useState([])
    
    const exTest = (list) =>{

        const caca = list.map((ex) => (
            <li><pre>{ex}</pre></li>
        ))

        return caca;
    }



    const testDiv = testList.map((test) => (
        <div key={test.date}>
            <h3>{test.date}</h3>

            <ul>
                {exTest(test.plan)}            
            </ul>
            <br />

            <ul>
                {exTest(test.etc)}
            </ul>
        </div>
    ))

    const [haha, setHaha] = useState([])

    useEffect(() => {
        


        let uu = text.replace(/\n/g, "")
        
        let day = /={3}\s\d{4}\/\d{2}\/\d{2}\s\={29}/g;

        let xaxa = uu.match(/={3}\s\d{4}\/\d{2}\/\d{2}\s\={30}/g)
        let dada = uu.split(/-{45}/g)
        
        let rr = []

        for (let index = 0; index < dada.length; index++) {
            if (day.test(dada[index])) {

                let gg = dada[index]
                
                let date = gg.match(day)
                date = date[0].replace(/(=|\s)/g,"")
                gg = gg.replace(day, "")

                let etc = gg.split(/\+{1}/g)
                etc.shift()
                for (let index2 = 0; index2 < etc.length; index2++) {
                    gg = gg.replace('+'+etc[index2], "")
                }

                let plan = gg.split(/\d{1}\.{1}/g)
                plan.shift()


                rr.push({
                    date: date,
                    plan: plan,
                    etc: etc,   
                })

            }
        }

        if (Array.isArray(rr)) {

            setHaha(rr)
            console.log(haha)
        }

        // let haha = text.split(/\={3}/g)

    }, [text])


    useEffect(() => {

        let lulu = []

        // for (let index = 0; index < haha.length; index++) {
        //     lulu = lulu.concat({

        //         day: '2021-10-' + index,
        //         plan: ['asdf', '1', '2'],
        //         etc: ['3', '2']

        //     })

        // }
        setTestList(haha)


    }, [haha])


    const textRef = useRef(null)

    return(

        <div>
            
            {/* <Astronaut /> */}
            <div>
                <h3>{userId}</h3> 
                <input type="text" name="password" id="password" onChange={(e) => setPassword(e.target.value)} onKeyPress={() => EnterPassword} />
                <p>{msg}</p>

                {/* <button type="button" onClick={(e)=> Astronauts.Baba()}>asdfasdfasf</button> */}
                <textarea ref={textRef} cols="120" rows="15" value={text} onChange={(e) => setText(e.target.value)} onFocus={()=>{textRef.current.setSelectionRange(1, 2)}}></textarea>

                {/* <ul>
                    {exTest(haha)}
                </ul> */}
                {testDiv}
                {/* onFocus={()=>{textRef.current.setSelectionRange(1, 1)} */}
                {/* onFocus={()=>{textRef.current.scrollTo(0, 12); textRef.current.setSelectionRange(1, 10)} */}
                <button onClick={(e)=> {textRef.current.focus()}}>asdf</button>
            </div>
        </div>

    )


}

export default Password;
