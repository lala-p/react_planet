import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';

import * as mainTextAction from '../actions/mainText';

import * as textApi from '../api/textApi';


const Loading = () => {

    const history = useHistory()
    const dispatch = useDispatch()
    const [cookies, setCookie, removeCookie] = useCookies()    

    
    useEffect(() => {
        setTimeout(() => {
            // dispatch(mainTextAction.setFontSize(50)) 
            dispatch(mainTextAction.setTextTitle('current'))
        
            const dataContainer = {
                userId: cookies['user_id']
            }

            textApi.getTextList(
                dataContainer,
                (response) => {
                    console.log(response.data)
                    
                    dispatch(mainTextAction.setTextList(response.data))
                    dispatch(mainTextAction.setTextTitle('current'))
                },
                (error) => {
                    console.log(error)
                },
                () => {

                }
            )

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