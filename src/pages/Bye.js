import React from 'react';
import axios from 'axios';
import { instanceOf } from 'prop-types'; 
import { withCookies, Cookies } from "react-cookie";
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import Parser from 'html-react-parser';
//import { Link } from 'react-router-dom'
import '../css/hello.scss';

class Bye extends React.Component {

	static propTypes = {
		cookies: instanceOf(Cookies).isRequired
	};


	state = {

		title: "",
		subTitle: "",
		memo: "",
		like_count: 0,
		like_it: 'unlike',
		

	};


	loadData = () => {

		const { params } = this.props.match;

		const { cookies } = this.props;
		const id = cookies.get('user');

		console.log(id);

		const textBox = {

			id: {id},

		};

 
		axios.post(`http://localhost:3001/text/${params.text_no}`, textBox)
		.then(response => {
			console.log(response.data)

			this.setState({

				title: response.data.title,
				subTitle:response.data.subTitle,
				memo: response.data.memo,
				like_count: response.data.like_it,
				like_it: response.data.user_like,

			});

		})
	};



	like_it = () => {

		const { cookies } = this.props;
		const id = cookies.get('user');
		
		console.log(id);
		
		const { params } = this.props.match;


		if(id == null){
			alert("로그인 후 이용할 수 있는 서비스입니다.");
			this.props.history.push('/Login');

		}else{


			
			if(this.state.like_it == 'unlike'){

				this.setState({
	
					like_count:  this.state.like_count+1,
					like_it: 'like',
	
				});

				const textBox = {

					id: {id},
					action: 'like',
	
				};
	
	
				axios.post(`http://localhost:3001/text/${params.text_no}/like_action`, textBox)
				.then(response => {
					console.log(response.data)
	
				})
	
	
	
			}else if(this.state.like_it == 'like'){
	
				this.setState({

					like_count:  this.state.like_count-1,
					like_it: 'unlike',
		
				});

				const textBox = {

					id: {id},
					action: 'unlike',
	
				};
	
	
				axios.post(`http://localhost:3001/text/${params.text_no}/like_action`, textBox)
				.then(response => {
					console.log(response.data)
	
				})
	
	
			}



	};





	};	



	componentDidMount(){

		this.loadData();

	}


	render(){		

		const style = {

			width: '1024px',
			margin: 'auto',

		}


		const style2 = {

			width: '700px',
			margin: 'auto',
			display: 'inlineBlock',
			whiteSpace: 'pre-wrap',
			overflowWrap: 'break-word',

		}


		return(

			<>
				<div style={style}>

					<h1> {this.state.title} </h1>
					<h2> {this.state.subTitle} </h2>

					<p>{this.state.like_count}</p>

					{ this.state.like_it == 'like' ? 
						<BsHeartFill onClick = {this.like_it} style={ {color: 'red'} } />  :
						<BsHeart onClick = {this.like_it} style={ {color: 'black'} } />
					}

				</div>
				<hr />


				<div style={style2}>

					<p>{this.state.memo}</p>

				</div>



			</>
		)
		
	}

}

export default withCookies(Bye);