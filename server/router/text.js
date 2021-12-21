const express = require('express');
const cors = require('cors');
const textModel = require('../model/textModel');

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(cors());



router.post('/get/current', async (req, res) => {

    let userId = req.body.userId

    var currentText = await textModel.getCurrentTextByUserId(userId)

    res.send(currentText);
});

router.post('/get/byTitle', async (req, res) => {


});

router.post('/save/current', async (req, res) => {

    let userId = req.body.userId
    let text = req.body.text

    var save = await textModel.saveCurrentText(userId, text)

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