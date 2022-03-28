import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import SigninPage from './pages/SigninPage'
import SignupPage from './pages/SignupPage'
import MainPage from './pages/MainPage'

import TestPage from './pages/TestPage'

class Routes extends React.Component {
	render() {
		return (
			<Router>
				<Switch>
					<Route exact path="/" component={SigninPage} />
					<Route exact path="/signup" component={SignupPage} />
					<Route exact path="/main" component={MainPage} />

					<Route exact path="/test" component={TestPage} />
				</Switch>
			</Router>
		)
	}
}

export default Routes
