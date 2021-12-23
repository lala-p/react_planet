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

exports.saveText = async function (userId, text, textTitle) {
    
    var saveText = await knex('text')
        .where('user_id', userId)
        .andWhere('text_title', textTitle)
        .update({
            text_content: text,
            updated_at: knex.raw('now()') 
        })

    return saveText;
}

exports.getTextList = async function (userId) {

    var data = await knex('text')
        .where({
            user_id: userId,
        })
        .select('text_title',
            knex.raw('date_format(created_at, \'%Y.%m.%d %T\') as created_at'),
            knex.raw('date_format(updated_at, \'%Y.%m.%d %T\') as updated_at')
        )

    return data;
}
