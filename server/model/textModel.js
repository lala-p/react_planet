const knex = require('./dbConnection');


exports.getTextByTitle = async function (userId, textTitle) {
    
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
            updated_at: knex.raw('NOW()') 
        })

    return saveText;
}

exports.saveAsText = async function (userId, text, textTitle) {

    var saveAsText = await knex('text')
        .where('user_id', userId)
        .andWhere('text_title', 'current')
        .update({
            text_content: text,
            text_title  : textTitle,
            updated_at  : knex.raw('now()')
        })
    
    return saveAsText;
}

exports.createCurrentText = async function (userId) {
    
    var createCurrent = await knex('text')
        .insert({
            user_id     : userId,
            text_title  : 'current',
            text_content: 'hello...?',
            created_at  : knex.raw('now()'),
            updated_at  : knex.raw('now()')
        })


    return createCurrent;
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
        .orderBy('created_at', 'desc')

    return data;
}

exports.updateTextTitle = async function (userId, textTitle, newTextTitle) {
    
    var updateTextTitle = await knex('text')
        .where('user_id', userId)
        .andWhere('text_title', textTitle)
        .update({
            text_title: newTextTitle
        })

    return updateTextTitle;
}

