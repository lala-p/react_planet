import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import * as mainTextAction from '../actions/mainText';


const Loading = () => {

    const history = useHistory()
    const dispatch = useDispatch()


    useEffect(() => {
        setTimeout(() => {
            // dispatch(mainTextAction.setFontSize(50))
            history.push("/main")
        }, 1000)    
    }, [])


    return (
        <div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <div style={{ margin: 'auto' }}>
                <h1>Loading...</h1>
            </div>
        </div>

    )
}

export default Loading;