const db = require('./dbConnection');


exports.getAllUser = function (callback) {

    var query = "select * from user";

    db.query(query, [], (err, rows) => {
        callback(err, rows)
    })

}

exports.getUserById = function (user_id, user_password, callback) {
    
    var query = "select user_id, user_password from user where user_id = ? and user_password = ?";
    var parmas = [user_id, user_password]

    db.query(query, parmas, (err, rows) => {
        callback(err, rows)
    })

}
