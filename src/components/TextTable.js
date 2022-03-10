import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';


const TextTable = () => {


    const dispatch = useDispatch()
    const textListData = useSelector((state) => state.boardText.textList)

    const saveAt = useSelector((state) => state.boardText.saveAt)
    
    const [cookies, setCookie, removeCookie] = useCookies()    


    const textList = textListData.map((textData, index) => (
        <tr>
            <td>{textData['text_title']}</td> 
            <td>{textData['created_at']}</td>
            <td>{textData['updated_at']}</td>
        </tr>
    ))  

    return (
        <div>
            <table border="1">
                <tr>
                    <th>title</th>
                    <th>created_at</th>
                    <th>updated_at</th>
                </tr>
                {textList}

            </table>

        </div>
    )
}

export default TextTable;