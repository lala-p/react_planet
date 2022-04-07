import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import SigninPage from './pages/SigninPage'
import SignupPage from './pages/SignupPage'
import MainPage from './pages/MainPage'

import TestPage from './pages/TestPage'

class Router extends React.Component {
	render() {
		return (
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<SigninPage />} />
					<Route path="/signup" element={<SignupPage />} />
					<Route path="/main" element={<MainPage />} />

					<Route path="/test" element={<TestPage />} />
				</Routes>
			</BrowserRouter>
		)
	}
}

export default Router
