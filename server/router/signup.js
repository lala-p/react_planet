const express = require('express');
const cors = require('cors');

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(cors());


router.post('/signUpuser', async (req, res) => {


});

module.exports = router;
