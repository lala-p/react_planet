const express = require("express");
const cors = require("cors");

// const fs = require("fs");
// const crypto = require("crypto");
// const nodemailer = require('nodemailer');

const app = express();
const port = 3001


const astronaut = require('./router/astronaut');
const command = require('./router/command');
const signin = require('./router/signin');
const signup = require('./router/signup');
const text = require('./router/text');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {

    res.send("hello...?");

});

app.use('/astronaut', astronaut);
app.use('/command', command);
app.use('/signin', signin);
app.use('/signup', signup);
app.use('/text', text);


app.listen(port, () => {

    console.log(`Example app listing at http://localhost:${port}`);

});


