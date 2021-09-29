const express = require("express");
const cors = require("cors");
const fs = require("fs");
const crypto = require("crypto");

const app = express();
const port = 3001

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {



    const hashPassword = crypto.createHash('sha512').update('PASSWORD').digest('hex');

    console.log(hashPassword);

    res.send("!@!@!@!@!@!@!@!");

});

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



app.get('/getText', (req, res) => {


    const readTxt = fs.readFileSync('./cosmic_dust/astronaut.txt');
   
    console.log(readTxt.toString());
    res.send(readTxt.toString());

    
});


app.post('/saveText', (req, res) => {

    if(req.body.text){

        console.log(req.body.text)
    }
    
    fs.writeFileSync("./cosmic_dust/astronaut.txt", req.body.text, {encoding: 'utf8'});

    res.send("?!@?!?@#?!?@?#!?@# Hello, It's me.");


});



app.listen(port, () => {

    console.log(`Example app listing at http://localhost:${port}`);

});