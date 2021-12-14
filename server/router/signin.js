const express = require('express');
const cors = require('cors');
const userModel = require('../model/userModel');

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(cors());


router.post('/user', (req, res) => {

    let user_id = req.body.userId;
    let user_password = req.body.userPassword;

    userModel.getUserById(user_id, user_password, function (err, rows) {        
        if (err) {
            console.log(err)
        } else {
            if (rows.length == 0) {
                console.log("signin failed.")
                res.send(false)
            
            } else if (rows.length > 1) {
                console.log(rows)
                res.send(false)

            } else {
                console.log(rows)
                res.send(true)
            }

        }
    })

});



 
module.exports = router;