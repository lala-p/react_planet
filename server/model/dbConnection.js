// const mariadb = require('mysql');
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: "localhost",
        port: "3306",
        user: "planet_test_user",
        password: "test",
        database: "planet_test_db",
    }
})


module.exports = knex