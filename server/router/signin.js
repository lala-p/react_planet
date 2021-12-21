const express = require('express');
const cors = require('cors');
const userModel = require('../model/userModel');

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(cors());


router.post('/user', async (req, res) => {

    let userId = req.body.userId
    let userPassword = req.body.userPassword


    var signinUser = await userModel.getUserByIdAndPassword(userId, userPassword)

    if (signinUser.length == 0) {
        console.log("signin failed.")
        res.send(false)

    } else if (signinUser.length > 1) {
        console.log("???????")
        res.send(false)

    } else {
        res.send(true)
    }

});


module.exports = router;