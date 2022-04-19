//Connection to database.

const { MongoClient } = require('mongodb');
const { default: mongoose } = require('mongoose');

const URI = process.env.URI;
const connectToMongo = () => {
    mongoose.connect(URI, () => {
        console.log("Connected to mongo successfully");
    })
}

module.exports = connectToMongo;