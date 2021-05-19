const express = require('express');
const app = express();
const port = 3001;
const cors = require('cors');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const login_page = require('./router/login2');
const mysql = require('mysql');
const db = require("./dbconnection");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());

app.use(cookieParser());

app.get('/', (req, res) => {

	console.log("hahahaha");	

});

app.get('/start', (req, res) => {
  
	console.log("lelelel");	

	var query = 'SELECT text_no, title, subTitle FROM text3 Limit 0, 5';


	db.query(query, (error, rows) => {

		if(error){
			console.log(error);
				
		}else{
			console.log(rows);
			res.send(rows);
		}		

	})

});


app.post('/text/:text_no', (req, res) => {

	console.log("?!@#@#@#??#23");	
	console.log(req.params.text_no);
	console.log(req.body.id.id);


	var query1 = 'SELECT  t.title, t.subTitle, t.memo, count(l.like_it) as like_it FROM text3 t \
					LEFT OUTER JOIN like2 l ON t.text_no = l.text_no WHERE t.text_no = ?; ' ;
	var sql1 =  mysql.format(query1,[req.params.text_no]);


	console.log(Object.keys(req.body.id).length);	

	if(Object.keys(req.body.id).length != 0){

		query2 = 'SELECT * FROM like2 WHERE text_no = ? and user_id = ?; ';
		sql2 =  mysql.format(query2,[req.params.text_no, req.body.id.id]);


		console.log('루루루룰');

	}else if(Object.keys(req.body.id).length == 0){

		sql2 = ' ';

	}else{

		console.log('?????');

	}

	db.query(sql1 + sql2, (error, rows) => {

		if(error){
			console.log(error);
				
		}else{

			console.log(Array.isArray(rows[1]) && rows[1].length === 0);

			if( ((!Array.isArray(rows[1])) || rows[1].length === 0 ) ){

				if(Object.keys(req.body.id).length != 0){

					var result = Object.assign({}, rows[0][0], {user_like: 'unlike'});
			
				}else if(Object.keys(req.body.id).length == 0){
			
					var result = Object.assign({}, rows[0], {user_like: 'unlike'});
			
				}
 
				console.log(result);
				res.send(result);


			}else if( Array.isArray(rows[1]) && !(rows[1].length === 0 )){

				if(Object.keys(req.body.id).length != 0){

					var result = Object.assign({}, rows[0][0], {user_like: 'like'});
			
				}else if(Object.keys(req.body.id).length == 0){
			
					var result = Object.assign({}, rows[0], {user_like: 'like'});
			
				}

				console.log(result);
				res.send(result);

			}else{

				console.log('asdasda');

			}

		}		

	})
	
});



app.post('/text/:text_no/like_action', (req, res) => {

	console.log("?!@#@#@#??#23");	
	console.log(req.params.text_no);
	console.log(req.body.id.id);
	console.log(req.body);


	var text_no = req.params.text_no;
	var action = req.body.action;
	var id = req.body.id.id;

	var query1, sql1;

	if(action == 'like'){

		query1 = 'INSERT INTO like2 VALUES (?,?,now()); ';
		sql1 =  mysql.format(query1,[text_no, id]);


	}else if (action == 'unlike') {

		query1 = 'DELETE FROM like2 WHERE user_id = ? and text_no = ?; ';
		sql1 =  mysql.format(query1,[id, text_no]);
	

	}

	var query2 = "SELECT * FROM like2 WHERE text_no = ? ";
	var sql2 = mysql.format(query2, [text_no]);


	db.query(sql1 + sql2, (error, rows) => {

		if(error){
			console.log(error);
				
		}else{
			console.log(rows);
			res.send(rows[1]);
		}		

	})
	// 다중 쿼리, count로 좋아요수 세서 res.send 하기
});




app.post('/:user_id/write', (req, res) => {

	var id = req.params.user_id;
	var title = req.body.title;
	var subTitle = req.body.subTitle;
	var memo = req.body.memo;

	var query1 = 'INSERT INTO text3 (user_id, title, subTitle, memo) values(?,?,?,?);';
	var sql1 =  mysql.format(query1,[id, title, subTitle, memo]);

	var query2 = "SELECT text_no FROM text3 WHERE user_id = ? and title = ? ";
	var sql2 = mysql.format(query2, [id, title]);


	db.query(sql1 + sql2, (error, results) => {

		if(error){
			console.log(error);

		}else{
			console.log(results[0]);
			console.log(results[1][0].text_no);

			res.send(results[1][0]);

		}
	});

});



app.use('/login', login_page);


app.listen(port, () => console.log('!!!!!! 3001 Node'));

{/* https://wonyoung2257.tistory.com/7 */}