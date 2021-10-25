import React, { useState } from 'react';


const MemoBoard = () => {

    const [test, setTest] = useState('');



    return(

        <div>

            {test}
            <button onClick={()=> setTest('asdfasdfadfsfdasdf')}>click</button> 
            {/* useState 값은 mode가 변경되면 초기화됨. */}
            <br />
            <br />
            <div style={{display: "flex"}}>
                    
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                
            </div>
            <hr />
            <br />
            <div style={{display: "flex"}}>
                
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                
            </div>
            <hr />
            <br />
            <div style={{display: "flex"}}>
                
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                
            </div>
            <hr />

            <br />
            <div style={{display: "flex"}}>
                
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                
            </div>
            <hr />

            <br />
            <div style={{display: "flex"}}>
                
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                <div style={{width: "285px", height: "150px", backgroundColor: "gray"}}>vcxzcvzcv</div> &nbsp;&nbsp;&nbsp;
                
            </div>
            <hr />
        </div>
    )

}

export default MemoBoard;