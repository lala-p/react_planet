const mariadb = require('mysql');
const connection = mariadb.createPool({

    host: "localhost",
    port: "3306",
    user: "planet_test_user", 
    password: "test",
    database: "planet_test_db",
    multipleStatements: true,

});

module.exports = connection