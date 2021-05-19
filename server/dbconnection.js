const mysql = require('mysql');
const connection = mysql.createPool({

	host: 'localhost',
	port: 3306,
	user: 'planet1',
	password: '15341534',
	database: 'planet_db',
	multipleStatements: true,
});
{/* multipleStatements: true 추가 후 다중 쿼리 보내지는지 확인하기*/}

module.exports = connection;


