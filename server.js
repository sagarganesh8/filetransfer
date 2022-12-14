
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const path = require('path');




const PORT = process.env.PORT || 3000;

const cors = require('cors');

const corsOptions ={
        "origin": "*",
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "preflightContinue": false,
        "optionsSuccessStatus": 204
      }

app.use(cors(corsOptions));


app.use(express.static('public'));
app.use(express.json());

const connectDB = require('./config/db');
connectDB();

//Cors




// Template engine

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// Routes

app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));

app.listen(PORT, () =>{
    console.log(`Listening on port ${PORT}`);
})


