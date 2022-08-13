// require('dotenv').config();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

function connectDB() {

    // Database Connection
    mongoose.connect(process.env.MONGO_CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true } )


    // mongoose.connect(process.env.MONGO_CONNECTION_URL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology:
    // true, useFindAndModify: true});
    const connection = mongoose.connection;


    // mongoose.connection.on("error", function(error) {
    //     console.log(error)
    //   })
      
    //   mongoose.connection.on("open", function() {
    //     console.log("Connected to MongoDB database.")
    //  



    mongoose.connection
    .once('open', function () {
      console.log('Database connected');
    })
    .on('error', function (err) {
      console.log(err);
    });



    // connection.once('open', () => {
    //     console.log('Database connected..');
    // }).catch(err => {

    //     console.log('Connection failed..');
    // })


    // mongoose.connection.once('open', function () {
    //     console.log('Database connected..');
    //   })
    //   .on('error', function (err) {
    //     console.log(err);
    //   });
}




module.exports = connectDB;