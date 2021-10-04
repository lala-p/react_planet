const express = require("express");
const cors = require("cors");
const fs = require("fs");
const crypto = require("crypto");

const app = express();
const port = 3001

const main = require('./router/main');
const command = require('./router/command');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {



    const hashPassword = crypto.createHash('sha512').update('PASSWORD').digest('hex');

    console.log(hashPassword);

    res.send("!@!@!@!@!@!@!@!");

});

// ======================================================================

app.use('/main', main);
app.use('/command', command);

// ======================================================================

app.get('/test', (req, res) => {

    res.send("test!@!");

});

// ======================================================================

app.post('/password', (req, res) => {


    let data = "Wrong!@!";

    const real_password = "lulu";
    const user_password = req.body.password; 

    console.log(user_password);


    if(real_password == user_password){

        console.log("Yes!@!");
        data = "login";

    }else{

        console.log("No!@!");

    }

    console.log(user_password);
    res.send(data);


});

// ======================================================================

app.post('/getAstronaut', (req, res) => {

    const readSetting = fs.readFileSync('./cosmic_dust/astronaut.json');

    let haha = JSON.parse(readSetting) 
    console.log(JSON.stringify(haha))

    res.send(JSON.stringify(haha))

})


// ======================================================================


app.listen(port, () => {

    console.log(`Example app listing at http://localhost:${port}`);

});