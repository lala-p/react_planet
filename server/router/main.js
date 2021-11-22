const express = require('express');
const cors = require('cors');
const fs = require('fs');

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(cors());


router.get('/getText', (req, res) => {


    const readTxt = fs.readFileSync('./cosmic_dust/planet.txt');
   
    console.log(readTxt.toString());
    res.send(readTxt.toString());


});


router.post('/saveText', (req, res) => {

    if(req.body.text){
    
        console.log(req.body.text)
    }
    
    fs.writeFileSync("./cosmic_dust/planet.txt", req.body.text, {encoding: 'utf8'});

    res.send("?!@?!?@#?!?@?#!?@# Hello, It's me.");


});



module.exports = router;
