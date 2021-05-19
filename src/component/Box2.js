import React from "react";
import { Link } from 'react-router-dom'

import '../css/box2.css';

const Box2 = (props) => {
	return(
		<div className="box2">

			<table className="t2">
				<tbody>
					<tr>
						<td>
							<div className="subTitle2">
								{props.subTitle}
							</div>
						</td>
					</tr>
					<tr>
						<td className="ab" height="98%">							
							<div className="title2">
								<Link to={`/text/${props.text_no}`} className="planet-home">{props.title}</Link>
								
							</div>
							<div className="readme2">
								fjdklas;kjf
							</div>
							<div className="tag2">
								<button>1111</button>
								<button>2222</button>
							</div>

	
						</td>
						<td width="28%" align="right">
							
							<div className="subImg2">
								<img alt="asasas"></img>
							</div>
							

						</td>
					</tr>

					<tr>
						<td height="30%">fvncmla;sldkfj</td>
						<td align="right">
							<button> asdfasdf </button>
							<button> vjdksla </button>

						</td>
					</tr>

				</tbody>
			</table>

		</div>

	);
};

export default Box2;