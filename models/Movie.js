/* MovieSchema is Schema for the movies stored in the database for favourite lists */

const mongoose = require('mongoose');
const {Schema} = mongoose;

const MovieSchema = new Schema({
    User : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users'
    },
    Title : {
        type : String
    },
    Poster : {
        type : String
    },
    ImdbID : {
        type : String
    },
    Year : {
        type : String
    },
    IsPublic : {
        type : Boolean
    }
});

const Movie = mongoose.model('movie', MovieSchema); 
Movie.createIndexes();
module.exports = Movie