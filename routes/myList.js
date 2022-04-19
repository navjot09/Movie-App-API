/*Movies.js includes all the api related to Movies updation and deletion in database.*/


const express = require('express');
const { default: mongoose } = require('mongoose');
const fetchuser = require('../middleware/fetchuser');
const Movie = require('../models/Movie');
const router = express.Router();

router.post('/AddToPublicFavList',fetchuser, async(req, res) => {
    try{
        const movie = await Movie.create({
            Title: req.body.Title,
            Year: req.body.Year,
            Poster : req.body.Poster,
            imdbID: req.body.imdbID,
            User : req.user.id,
            IsPublic : true    
        }
        );
    res.send(movie);
    }catch(error){
        res.send(error);
        
    }
});

router.post('/AddToPvtFavList',fetchuser, async(req, res) => {
    try{
        const movie = await Movie.create({
            Title: req.body.Title,
            Year: req.body.Year,
            Poster : req.body.Poster,
            imdbID: req.body.imdbID,
            User : req.user.id,
            IsPublic : false      
        }
        );
    res.send(movie);
    }catch(error){
        res.send(error)
        
    }
});

// Fetching From Public List doesn't require user authentication.

router.get('/FetchFromPublicFavList/:id', async(req, res) => {
    try{
        const movies = await Movie.find({User : req.params.id, IsPublic :true})
        res.send(movies)
    }catch(error){
        console.error(error.message);
        
    }
});

router.post('/FetchFromPvtFavList',fetchuser, async(req, res) => {
    try{
        const movies = await Movie.find({User : req.user.id, IsPublic :false})
        res.send(movies)
    }catch(error){
        console.error(error.message);
        
    }
});

router.post('/DeleteFromPvtFavList',fetchuser, async(req, res) => {
    try{
        await Movie.deleteOne({_id : mongoose.Types.ObjectId(req.body._id)})
        const movies = await Movie.find({User : req.user.id, IsPublic : false})
        res.send(movies);
        
    }catch(error){
        console.error(error.message);
    }
});

router.post('/DeleteFromPublicFavList',fetchuser, async(req, res) => {
    try{
        await Movie.deleteOne({_id : mongoose.Types.ObjectId(req.body._id)})
        const movies = await Movie.find({User : req.user.id, IsPublic : true})
        res.send(movies);
        
    }catch(error){
        console.error(error.message);
    }
});

module.exports = router;