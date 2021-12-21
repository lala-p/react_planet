const knex = require('./dbConnection');


exports.getAllUser = async function () {
    
    var data = await knex.select().table('user')

    return data;
}

exports.getUserById = async function (userId) {
    
    var data = await knex('user')
        .where({
            user_id: userId,
        })
        .select('user_no', 'user_id', 'user_password')

    return data;
}

exports.getUserByIdAndPassword = async function (userId, userPassword) {

    var data = await knex('user')
        .where({
            user_id: userId,
            user_password: userPassword,
        })
        .select('user_no', 'user_id', 'user_password')

    return data;
}





