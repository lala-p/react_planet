import React from 'react';
import axios from 'axios';

class Password extends React.Component{


    state = {

        userId: 'haha1234',
        password: '',
        msg: '',
        

    }


    handleChange = (e) => {

        this.setState({
            [e.target.name] : e.target.value,
        });

    }


    EnterPassword = (e) => {

        if(e.key == 'Enter'){


            let url = "http://localhost:3001/password";

            const passwordBox = {
    
                password: this.state.password,
    
            }
    
            axios.post(url, passwordBox)
            .then((response) => {
    
                console.log(response.data)
                this.setState({    
                    msg: response.data,
                })

                if(response.data == "login"){

                    this.props.history.push('/test');
                }
                
    
            })
            .catch((error) => {
                console.log(error)
            })
    


        }



    }


    render(){



        return(

            <div>

                <div>

                    <h3>{this.state.userId}</h3> 
                    <input type="text" name="password" id="password" onChange={this.handleChange} onKeyPress={this.EnterPassword} />
                    <p>{this.state.msg}</p>

                </div>


            </div>

        )

    }

}


export default Password;

