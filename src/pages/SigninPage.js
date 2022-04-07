import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'

import { sendAxiosGet, sendAxiosPost } from '../api/sendAxios'

import apiUrl from '../api/apiUrl'

const SigninPage = () => {
	const navigate = useNavigate()

	const [cookies, setCookie, removeCookie] = useCookies(['user_id'])

	const [userId, setUserId] = useState('')
	const [password, setPassword] = useState('')
	const [msg, setMsg] = useState('')

	const userIdRef = useRef(null)
	const passwordRef = useRef(null)

	const EnterUserId = e => {
		if (e.keyCode == 13) {
			// enter
			passwordRef.current.focus()
		}
	}

	const EnterPassword = e => {
		if (e.keyCode == 13) {
			// enter

			const dataContainer = {
				userId: userId,
				userPassword: password,
			}

			sendAxiosPost(
				apiUrl.sign.post.SIGNIN_USER,
				dataContainer,
				response => {
					console.log(response.data)

					if (response.data) {
						setCookie('user_id', userId, { path: '/' })
						navigate('/main')
					} else {
						setUserId('')
						setPassword('')
						userIdRef.current.focus()
						setMsg('wrong!@!')
					}
				},
				error => {
					setMsg('signin failed...')
					console.log(error)
				},
				false,
			)

			// signInUser(
			//     signinData,
			//     (response) => {
			//         console.log(response.data)

			//         if (response.data) {
			//             setCookie('user_id', userId, {path: '/'})
			//             navigate("/main")

			//         } else {
			//             setUserId('')
			//             setPassword('')
			//             userIdRef.current.focus()
			//             setMsg("wrong!@!")

			//         }

			//     },
			//     (error) => {
			//         setMsg("signin failed...")
			//         console.log(error)
			//     },
			//     () => {

			//     }
			// )
		}
	}

	useEffect(() => {
		if (cookies.user_id) {
			navigate('/main')
		} else {
			userIdRef.current.focus()
		}
	}, [])

	return (
		<div className="LoginPage">
			<div>
				<h3>Login</h3>
				<input ref={userIdRef} type="text" id="userId" value={userId} onChange={e => setUserId(e.target.value)} onKeyDown={EnterUserId} placeholder="ID" />
				<br />
				<input ref={passwordRef} type="text" id="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={EnterPassword} placeholder="Password" />
				<p>{msg}</p>
			</div>
		</div>
	)
}

export default SigninPage
