import React from "react";
import { instanceOf } from 'prop-types'; 
import { withCookies, Cookies } from "react-cookie";
import { Link } from 'react-router-dom'
import '../css/head.scss';

class Head extends React.Component {

	static propTypes = {
		cookies: instanceOf(Cookies).isRequired
	};

	render(){

		const { cookies } = this.props;
		const id = cookies.get('user');

		console.log(id);


		return(
			<div className="Head">
				<div className="Head1">
	
					<Link to="/" className="planet-home">PLANET</Link>
	
					<Link to="/" className='page'>홈</Link>			
					<Link to="/" className='page'>시리즈</Link>		
					<Link to="/" className='page'>컬렉션</Link>		
	
	
				
					<div className='search'>			
							<input type='text' placeholder='검색' className='input1'/>
							<button className='gaga'> $ </button>
					</div>
	

					{		
						id != null ? 
							<div>
								<button className='login'>{id}</button>

								<Link to="/write">
									<button className='login'>글쓰기</button>			
							
								</Link>


							</div>						
						
						:
							<div>
								<Link to="/Login">
									<button className='login'>로그인</button>
								</Link>
								
								<Link to="/hi">
									<button className='login'>회원가입</button>			
							
								</Link>
							</div>

					}
					
				</div>
			</div>
		)
	}
	
}

export default withCookies(Head);