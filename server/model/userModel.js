const knex = require('./dbConnection');


exports.getAllUser = async function () {
    
    var data = await knex.select().table('user')

    return data;
}

exports.getUserById = async function (user_id) {
    
    var data = await knex('user')
        .where({
            user_id: user_id,
        })
        .select('user_id', 'user_password')

    return data;
}

exports.getUserByIdAndPassword = async function (user_id, user_password) {

    var data = await knex('user')
        .where({
            user_id: user_id,
            user_password: user_password,
        })
        .select('user_id', 'user_password')

    return data;
}





