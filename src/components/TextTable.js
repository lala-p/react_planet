import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { useCookies } from 'react-cookie';

const TextTable = () => {


    const textListData = useSelector((state) => state.mainText.textList)

    useEffect(() => {
        console.log(textListData)
    })

    

    const textLst = textListData.map((textData, index) => (
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
                {textLst}

            </table>

        </div>
    )
}

export default TextTable;