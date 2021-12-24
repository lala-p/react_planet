const express = require('express');
const cors = require('cors');
const textModel = require('../model/textModel');

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(cors());


router.post('/get/byTextTitle', async (req, res) => {

    let userId    = req.body.userId
    let textTitle = req.body.textTitle
    
    var text = await textModel.getTextByTextTitle(userId, textTitle)

    res.send(text);
});

router.post('/save', async (req, res) => {

    let userId    = req.body.userId
    let text      = req.body.text
    let textTitle = req.body.textTitle

    var save = await textModel.saveText(userId, text, textTitle)

    console.log(save)
    
    res.send('Save Completed.')
});

router.post('/save/as', async (req, res) => {

    let userId    = req.body.userId
    let text      = req.body.text
    let textTitle = req.body.textTitle

    var saveAs = await textModel.saveAsText(userId, text, textTitle)
    console.log(saveAs)

    var createCurrent = await textModel.createCurrentText(userId)
    console.log(createCurrent)

    res.send('save as text')
});


router.post('/get/textList', async (req, res) => {

    let userId = req.body.userId
        
    var textList = await textModel.getTextList(userId)
    
    console.log(textList)
    res.send(textList)
});


module.exports = router;