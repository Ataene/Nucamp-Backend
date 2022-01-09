const express = require('express');
const User = require('../models/user');

const passport = require('passport');

const router = express.Router();

const cors = require('./cors');

const authenticate = require('../authenticate');

/* GET users listing. */
//Updated in Task3.

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
    if (req.user) {
        const token = authenticate.getToken({_id: req.user._id});
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, token: token, status: 'You are successfully logged in!'});
    }
});
//UPDATED TO INCLUDE FACEBOOK AUTHENTICATION START HERE
// router.get('/', cors.corsWithOptions,  authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
//     // res.send('respond with a resource');
//     User.find()
//     .then((users) => {
//         res.setHeader("Content-Type", "application/json");
//         res.json(users);
//     })
//     .catch(err => next(err));
// });


//UPDATE ENDS FOR FACEBOOK AUTHENTICATION



//Task 3 end


//Updated in Task 3 Asignment 3.

// router.route('/')
// .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
//     User.find()
//     .then(users => {
//         if(users) {
//             res.statusCode = 200;
//             res.setHeader("Content-Type", "application/json");
//             res.json(users);
//         } else {
//             err = new Error("user not found");
//             err.status = 404;
//             return next(err);
//         }
//     })
//     .catch(err => next(err));
// })

// // Updated to us passport for users authentication - Real Comments/
// router.post('/signup', (req, res, next) => {
//     User.findOne({username: req.body.username})
//     .then(user => {
//         if (user) {
//             const err = new Error(`User ${req.body.username} already exists!`);
//             err.status = 403;
//             return next(err);
//         } else {
//             User.create({
//                 username: req.body.username,
//                 password: req.body.password})
//             .then(user => {
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json({status: 'Registration Successful!', user: user});
//             })
//             .catch(err => next(err));
//         }
//     })
//     .catch(err => next(err));
// });


router.post('/signup', cors.corsWithOptions,  (req, res) => {
    User.register(
        new User({username: req.body.username}),
        req.body.password,
        (err, user) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({err: err});
            } else {
                if (req.body.firstname) {
                    user.firstname = req.body.firstname;
                }
                if (req.body.lastname) {
                    user.lastname = req.body.lastname;
                }
                user.save(err => {
                    if (err) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({err: err});
                        return;
                    }
                    passport.authenticate('local')(req, res, () => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success: true, status: 'Registration Successful!'});
                    });
                });
            }
        }
    );
});

// router.post('/signup', (req, res) => {
//     User.register(
//         new User({username: req.body.username}),
//         req.body.password,
//         err => {
//             if (err) {
//                 res.statusCode = 500;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json({err: err});
//             } else {
//                 passport.authenticate('local')(req, res, () => {
//                     res.statusCode = 200;
//                     res.setHeader('Content-Type', 'application/json');
//                     res.json({success: true, status: 'Registration Successful!'});
//                 });
//             }
//         }
//     );
// })

// Updated to us passport for users authentication - Real Comments/
// router.post('/login', (req, res, next) => {
//     if(!req.session.user) {
//         const authHeader = req.headers.authorization;

//         if (!authHeader) {
//             const err = new Error('You are not authenticated!');
//             res.setHeader('WWW-Authenticate', 'Basic');
//             err.status = 401;
//             return next(err);
//         }
      
//         const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
//         const username = auth[0];
//         const password = auth[1];
      
//         User.findOne({username: username})
//         .then(user => {
//             if (!user) {
//                 const err = new Error(`User ${username} does not exist!`);
//                 err.status = 401;
//                 return next(err);
//             } else if (user.password !== password) {
//                 const err = new Error('Your password is incorrect!');
//                 err.status = 401;
//                 return next(err);
//             } else if (user.username === username && user.password === password) {
//                 req.session.user = 'authenticated';
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'text/plain');
//                 res.end('You are authenticated!')
//             }
//         })
//         .catch(err => next(err));
//     } else {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'text/plain');
//         res.end('You are already authenticated!');
//     }
// });

// router.post('/login', passport.authenticate('local'), (req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'application/json');
//     res.json({success: true, status: 'You are successfully logged in!'});
// });

router.post('/login', cors.corsWithOptions,  passport.authenticate('local'), (req, res) => {
    const token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
});


router.get('/logout', cors.corsWithOptions,  (req, res, next) => {
    if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
    } else {
        const err = new Error('You are not logged in!');
        err.status = 401;
        return next(err);
    }
});

module.exports = router;








// var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// module.exports = router;
