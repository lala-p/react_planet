const apiUrl = {
	server: {
		get: {
			SERVER_CONNECT: '/',
		},
		post: {},
	},
	sign: {
		get: {},
		post: {
			SIGNUP_USER: '/signupApi/signupuser',
			SIGNIN_USER: '/signinApi/signinUser',
		},
	},
	text: {
		get: {},
		post: {
			GET_TEXT_TITLE_LIST: '/textApi/getTextTitleList',
			GET_TEXT_LIST: '/textApi/getTextList',
			SAVE: '/textApi/save',
			SAVE_AS: '/textApi/saveAs',
			DELETE_TEXT_BY_TITLE: '/textApi/deleteTextByTitle',
			RENAME_TEXT_TITLE: '/textApi/renameTextTitle',
		},
	},
}

export default apiUrl
