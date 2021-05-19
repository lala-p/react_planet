import React from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios';
import { instanceOf } from 'prop-types'; 
import { withCookies, Cookies } from "react-cookie";
import '../css/login.scss';

class Login extends React.Component{

	static propTypes = {
		cookies: instanceOf(Cookies).isRequired
	};

	state = {
		user_id: "",
		user_pw: "",
		text: null,
	};

	handChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	};

	onclick = () => {

		const loginBox = {
			userId: this.state.user_id,
			userPW: this.state.user_pw,
		};


		axios.post("http://localhost:3001/login", loginBox)
		.then(response => {
			console.log(response.data)

			if(response.data.text === 'login'){

				const { cookies } = this.props;
				cookies.set("user", this.state.user_id, {path: '/'});

				this.props.history.push('/');
				
			}else{
				this.setState({
					user_id: "",
					user_pw: "",
					text: response.data.text})
			}
			
		})






{/*

		fetch("http://localhost:3001/login",{
			method: 'post',
			headers: {
				Accept: 'application/json',
				'content-type': 'application/json',
				
			},
			credentials: 'include',
			body: JSON.stringify(loginBox),
		})
			.then((res) => res.json())
			.then((json) => {
				console.log(json);
				this.setState({
					text: json.text,
				});
			});

	




*/}


		
	};


	render(){
		return(
			<>
				<div className="login">
					<br />
	
					<div className="login-header">
						<Link to="/" className="planet-home">PLANET</Link>
					</div>

					{this.state.text != null ? 
						<div className="someDiv"> <br /> <div className="errorMessage"> {this.state.text} </div> <br /> </div>:
						<br />
					}

					<div className="login-main">
						<form>
							<br />
	
							<div className="login-input">
								<p>ID</p>
								<input type="text" name="user_id" id="user_id" onChange={this.handChange} placeholder="input your id"/>
	
							<br />
							<br />
	
								<p>Password</p>
								<input type="text" name="user_pw" id="user_pw" onChange={this.handChange} placeholder="input your password"/>
	
							<br />
							<br />

							<button type="reset" name="login" id="login_btn" onClick={this.onclick} >Login</button>
							<h1>{this.state.text}</h1>
							</div>
						
						</form>
	
					</div>
				</div>			
			</>
		)
	
	}
};

export default withCookies(Login);