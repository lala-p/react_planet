const express = require('express');
const cors = require('cors');
const userModel = require('../model/userModel');

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(cors());


router.get('/user', (req, res) => {

    let user = userModel.selectUser()
        
    console.log(user)
    res.send("signin!@!@!@!#!@#!#!@#!@#")
    
});


module.exports = router;
