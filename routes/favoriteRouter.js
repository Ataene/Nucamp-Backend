const express = require('express'); //imported express module 
const authenticate = require('../authenticate'); //imported authenticate
const cors = require('./cors'); //imported cors
const Favorite = require("../models/favorite"); //imported favorite
const favoriteRouter = express.Router(); //


favoriteRouter.route('/') //Setting up favoriteRouter and ("/")
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))  //option middleware
.get(cors.cors, authenticate.verifyUser, (req, res, next) => { //argument req, res, next for all
    Favorite.find({user: req.user._id})
    .populate('user')
    .populate('campsites')
    .then(favorite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    })
    .catch(err => next(err));
})


.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
        .then((favorite) => {
            if (favorite) {
                req.body.forEach(item => {
                    if (!favorite.campsites.includes(item._id)) {
                        favorite.campsites.push(item);
                    }
                });
                favorite.save()
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(favorite);
                    })
                    .catch((err) => next(err));
            } else {
                Favorite.create({ user: req.user._id })
                    .then((favorite) => {
                        req.body.forEach(item => {
                            favorite.campsites.push(item);
                        })
                        favorite.save().then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(favorite);
                    })
                    .catch((err) => next(err));
                });
            }
        });
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id})
    .then(favorite => {
        if(favorite) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        } else {
            res.setHeader('Content-Type', 'text/plain');
            res.end("You do not have any favorite to delete");
        }
    })
    .catch(err => next(err));
});

favoriteRouter.route('/:campsiteId') //setting up favoriteRouter
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`Get operation not supported on /campsite/${req.params.campsiteId}`);
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite => {

        if(favorite) {
            if(!favorite.campsites.includes(req.params.campsiteId)) {
                favorite.campsites.push(req.params.campsiteId);
            } else {
                res.end("That campsite is already in the list of favorites!");
            }
        } else {
            Favorite.create({user: req.user._id, 
                campsites: [req.params.campsiteId]
            });
        }
    })
    .catch(err => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /favorites/${req.params.campsiteId}/comments/${req.params.commentId}`);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite => {

        if(favorite) {
            if(favorite.campsites.indexOf(req.params.campsiteId) !==-1) {
                favorite.campsites.splice(req.params.campsiteId)
            }
            favorite.campsites.save()
            .then(favorite => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        })
        } else {

            res.setHeader('Content-Type', 'text/plain');
            res.end("There is favorite to delete");
        }
    })     
    .catch(err => next(err));
});


module.exports = favoriteRouter; //export Router.