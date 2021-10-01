const express = require('express');
const cors = require('cors');

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(cors());


router.get('/getMealMenu', (req, res) => {



});


router.get('/getMeal', (req, res) => {


});


router.post('/addMealMenu', (req, res) => {

    
});


module.exports = router;

