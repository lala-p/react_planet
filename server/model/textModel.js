const knex = require('./dbConnection');


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

exports.getTextByTitle = async function (userId, textTitle) {
    
    var data = await knex('text')
        .select('text_content', 'created_at', 'updated_at')
        .where({
            user_id: userId,
            text_title: textTitle
        })

    return data;
}

exports.getTextTitleList = async function (userId) {

    var data = await knex('text')
        .select('text_title',
            knex.raw('date_format(created_at, \'%Y.%m.%d %T\') as created_at'),
            knex.raw('date_format(updated_at, \'%Y.%m.%d %T\') as updated_at')
        )
        .where({
            user_id: userId,
        })
        .orderBy('created_at', 'desc')

    return data;
}

exports.getTextList = async function (userId, textTitleList) {

    var data = await knex('text')
        .select('text_title', 
            'text_content',
            knex.raw('date_format(created_at, \'%Y.%m.%d %T\') as created_at'),
            knex.raw('date_format(updated_at, \'%Y.%m.%d %T\') as updated_at')
        )
        .where('user_id', '=', userId)
        .where(function () {
            this.where('text_title', '=', textTitleList[0])
            for (let index = 1; index < textTitleList.length; index++) {
                this.orWhere('text_title', '=', textTitleList[index])
            }
        })
        .orderBy('created_at', 'desc')

    return data;
}

exports.saveText = async function (userId, text, textTitle) {
    
    var saveText = await knex('text')
        .update({
            text_content: text,
            updated_at: knex.raw('NOW()') 
        })
        .where('user_id', userId)
        .andWhere('text_title', textTitle)

    return saveText;
}

exports.saveAsText = async function (userId, text, textTitle) {

    var saveAsText = await knex('text')
        .update({
            text_content: text,
            text_title  : textTitle,
            updated_at  : knex.raw('now()')
        })
        .where('user_id', userId)
        .andWhere('text_title', 'current')
    
    return saveAsText;
}

exports.updateTextTitle = async function (userId, textTitle, newTextTitle) {
    
    var updateTextTitle = await knex('text')
        .update({
            text_title: newTextTitle
        })
        .where('user_id', userId)
        .andWhere('text_title', textTitle)

    return updateTextTitle;
}

