import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import App from './pages/App';
import Hello from './pages/Hello';
import Login from './pages/Login';
import Bye from './pages/Bye'; 
import NotFound from './pages/Empty';

class Routes extends React.Component{
	render(){
		return(
			<Router>
				<Switch>

					<Route exact path="/" component={App}/>
					<Route exact path="/write" component={Hello}/>
					<Route exact path="/Login" component={Login}/>
					<Route exact path="/text/:text_no" component={Bye}/>

					<Route component={NotFound}/>

				</Switch>
			</Router>

		)
	}
}

export default Routes;