import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import axios from 'axios';
import { instanceOf } from 'prop-types'; 
import { withCookies, Cookies } from "react-cookie";
import { Link } from 'react-router-dom'
import '../css/hello.scss';

class Hello extends React.Component {

	static propTypes = {
		cookies: instanceOf(Cookies).isRequired
	};

	state = {
		title: "",
		subTitle: "",
		memo: null,
	};

	handChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	};


	onSave = () =>{

		const { cookies } = this.props;

		const id = cookies.get('user');

		console.log(cookies.get('user'));
		console.log(this.state.title);
		console.log(this.state.subTitle);
		console.log(this.state.memo);


		const textBox = {

			id: {id},
			title: this.state.title,
			subTitle: this.state.subTitle,
			memo: this.state.memo,

		};
		

		axios.post(`http://localhost:3001/${id}/write`, textBox)
		.then(response => {
			console.log(response.data)	
			this.props.history.push(`/text/${response.data.text_no}`)

		})


	};




	render(){

		const { cookies } = this.props;
		const isLogin = cookies.get('user');

		if( isLogin == null){
			alert("로그인 후 사용해 주세요.");
			this.props.history.push('/');

		}

		
		return(

			<>

				<div className="Hello">
					<div className="Hello-head">
		
						<Link to="/" className="planet-home">PLANET</Link>
						<button id="save-btn" onClick={this.onSave} >저장</button>
		
					</div>
		
					<div className="Hello-body">
		
						<input type="text" id="title" name="title" onChange={this.handChange} maxLength="25" placeholder="제목을 입력세요" />
						<input type="text" id="subTitle" name="subTitle" onChange={this.handChange} maxLength="55" placeholder="부제목을 입력세요" />
						<hr /> 
						<TextareaAutosize id="memo" name="memo" onChange={this.handChange} placeholder="fjdkla;skdjf"/>
						<div className="aa"></div>
					</div>
				</div>
				
			</>
		)
		
	}

}

export default withCookies(Hello);