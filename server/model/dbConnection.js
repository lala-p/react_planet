const mariadb = require('mysql');
const connection = mariadb.createPool({

    host: "",
    port: "",
    user: "", 
    password: "",
    database: "",
    multipleStatements: true,

});

module.exports = connection