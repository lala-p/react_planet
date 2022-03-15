const express = require('express');
const cors = require('cors');
const textModel = require('../model/textModel');

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(cors());


router.post('/getTextByTitle', async (req, res) => {

    let userId    = req.body.userId
    let textTitle = req.body.textTitle

    var text = await textModel.getTextByTitle(userId, textTitle)
    console.log(textTitle)
    res.send(text);
});

router.post('/getTextTitleList', async (req, res) => {

    let userId = req.body.userId
        
    var textTitleList = await textModel.getTextTitleList(userId)
    
    console.log(textTitleList)
    res.send(textTitleList)
});

router.post('/getTextList', async (req, res) => {

    let userId        = req.body.userId
    let textTitleList = req.body.textTitleList
        
    var textList = await textModel.getTextList(userId, textTitleList)
    
    console.log(textList)
    res.send(textList)
    
});

router.post('/save', async (req, res) => {

    let userId    = req.body.userId
    let text      = req.body.text
    let textTitle = req.body.textTitle

    var save = await textModel.saveText(userId, text, textTitle)
    console.log(save)
    
    res.send('Save Completed.')
});

router.post('/saveAs', async (req, res) => {

    let userId    = req.body.userId
    let text      = req.body.text
    let textTitle = req.body.textTitle

    var saveAs = await textModel.saveAsText(userId, text, textTitle)
    console.log(saveAs)

    var createCurrent = await textModel.createCurrentText(userId)
    console.log(createCurrent)

    res.send('save as text')
});

router.post('/renameTextTitle', async (req, res) => {

    let userId       = req.body.userId
    let textTitle    = req.body.textTitle
    let newTextTitle = req.body.newTextTitle

    var renameTextTitle = await textModel.updateTextTitle(userId, textTitle, newTextTitle)

    console.log(renameTextTitle)
    res.send('rename')
});

module.exports = router;