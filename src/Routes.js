import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import TestPage from './pages/TestPage';
import MainPage from './pages/MainPage';
import LoadingPage from './pages/Loading';

class Routes extends React.Component{

    render(){
        return(

            <Router>
                <Switch>

                    <Route exact path="/" component={LoginPage} />
                    <Route exact path="/main" component={MainPage} />
                    <Route exact path="/test" component={TestPage} />
                    <Route exact path="/loading" component={LoadingPage} />

                </Switch>
            </Router>

        )
    }
}

export default Routes;