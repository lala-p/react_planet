const knex = require('./dbConnection');



exports.getTextByTextTitle = async function (userId, textTitle) {
    
    var data = await knex('text')
        .where({
            user_id: userId,
            text_title: textTitle
        })
        .select('text_content', 'created_at', 'updated_at')

        return data;
}

exports.getCurrentTextByUserId = async function (userId) {
    
    var data = await knex('text')
        .where({ 
            user_id: userId,
            text_title: 'current' 
        })
        .select('text_content', 'created_at', 'updated_at')

    return data;
}

// exports.getCurrentTextByUserNo = async function (userNo) {

//     var data = await knex('text')
//         .where({
//             user_no: userNo,
//         })
//         .select('text_title', 'text_content')

//     return data;
// }


exports.getTextListByUserId = async function (userId) {
    
    var data = await knex('text')
        .where({ 
            user_id: userId,
        })
        .select('text_title', 'text_content')

    return data;

}

// exports.getTextListByUserNo = async function (userNo) {

//     var data = await knex('text')
//         .where({
//             user_no: userNo,
//         })
//         .select('text_title', 'text_content')

//     return data;

// }


exports.saveText = async function (userId, text, textTitle) {
    
    var saveText = await knex('text')
        .where('user_id', userId)
        .andWhere('text_title', textTitle)
        .update({
            text_content: text,
        })

    return saveText;
}

exports.getTextListOrderByCreatedAt = async function (userId) {

    var data = await knex('text')
        .where({
            user_id: userId,
        })
        .select('text_title',
            knex.raw('date_format(created_at, \'%Y.%m.%d %T\') as created_at'),
            knex.raw('date_format(updated_at, \'%Y.%m.%d %T\') as updated_at')
        ).orderBy('created_at', 'desc')

    return data;
}

exports.getTextListOrderByUpdatedAt = async function (userId) {

    var data = await knex('text')
        .where({
            user_id: userId,
        })
        .select('text_title',
            knex.raw('date_format(created_at, \'%Y.%m.%d %T\') as created_at'),
            knex.raw('date_format(updated_at, \'%Y.%m.%d %T\') as updated_at')
        ).orderBy('updated_at', 'desc')

    return data;
}

