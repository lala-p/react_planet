const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require('cors');
const db = require("../dbconnection");


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.use(cors({origin: true, credentials: true}));



router.post('/', (req, res) => {

	var userId = req.body.userId;
	var userPW = req.body.userPW;

	console.log(userId);
	console.log(userPW);

	var query = 'SELECT user_id, user_password FROM user2 WHERE user_id = ?';
	var params = [userId];


	db.query(query, params, (error, rows) => {

		if(error){
			console.log(error);
	
		}else if(rows.length == 0){

			res.send({text: '존재하지 않는 아이디입니다.'});


		}else if (rows[0].user_id == userId && rows[0].user_password == userPW){

			console.log(rows)
			res.send({text: 'login'});

		}else if (rows[0].user_id == userId && rows[0].user_password != userPW){

			res.send({text: '비밀번호가 일치하지 않습니다.'});
			
		}else{
			console.log(rows)
		
		}		

	})
	
});




module.exports = router;