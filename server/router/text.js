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

router.post('/get/byTitle', async (req, res) => {


});

router.post('/save', async (req, res) => {

    let userId    = req.body.userId
    let text      = req.body.text
    let textTitle = req.body.textTitle

    var save = await textModel.saveCurrentText(userId, text, textTitle)

    console.log(save)
    
    res.send('Save Completed.')
});

router.post('/save/byTitle', async (req, res) => {


});


router.post('/get/textList', async (req, res) => {

    let userId = req.body.userId
    
    var textListOrderByCreatedAt = await textModel.getTextListOrderByCreatedAt(userId)
    var textListOrderByUpdatedAt = await textModel.getTextListOrderByUpdatedAt(userId)
    
    
    var resData = {
        textListOrderByCreatedAt: textListOrderByCreatedAt,
        textListOrderByUpdatedAt: textListOrderByUpdatedAt,
    }
    
    console.log(resData)
    res.send(resData)
});

module.exports = router;