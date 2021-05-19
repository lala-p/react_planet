import React from 'react';
import axios from 'axios';

import '../css/App.css';
import Head from "../component/Head";
import Box1 from "../component/Box1";
import Box2 from "../component/Box2";


class App extends React.Component {


    state = {
      nextId: 1,
      test: [

      ],

    };

  

    componentDidMount(){

      axios.get('http://localhost:3001/start')
      .then(response => {
        console.log(this.state.test);
        console.log(response.data);
        console.log(response.data[0]);

        for(var i = 0; i < response.data.length; i++){

          const data = {

            id: this.state.nextId,
            text_no: response.data[i].text_no, 
            title: response.data[i].title,
            subTitle: response.data[i].subTitle,
          
          }

          this.setState({
            nextId: this.state.nextId+1,
            test: this.state.test.concat(data)

         })

        }
        
        console.log(this.state.test);
        console.log("dfd");    
      });
  
    }
  



render(){

  const boxes2 = this.state.test.map((box) =>
 
    <div key={box.id}>

      <Box2 
        text_no={box.text_no}
        title={box.title}          
        subTitle={box.subTitle}
      />
      <hr />

    </div>
  ); 

  return (
    <div className='App'>
      <Head style="	position: fixed;"/>
        
        <br />
        <br />
        <br />
        <br />
        <br />
      
        <div className="in">
  
          <div className="mainImg">
            <img className="mainimg" alt="?@?@?@?@?@?@?@? sorry"></img>
          </div>

          <div className="aa">
            <Box1 />
            <Box1 />
            <Box1 />
          </div>    


        </div>

        <br />
        <br />
        <hr />
        <br />
        <br />

        <div className="in">

          <div className="bb">

            {boxes2}

          </div>

          <div className="cc">
            광고광고광고광고광고광고광고광고광고광고광고광고광고광고광고
{/*  <h1> {cookies.user} </h1> */}            

          </div>

        </div> 

        <br />
        <br />
        <br />
        <br />

        <div className="in">

              

        </div>

        
        <footer>

          fjdkslaj;sdlkfj;aslkdfj;alksdfj;alksdjf


        </footer>


      </div>
    );

  };

};

export default App;
