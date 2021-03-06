const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const passport = require('passport');
require('./passport');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Models = require('./models.js');
const morgan = require('morgan');

const app = express();
let auth = require('./auth')(app);
const Movies = Models.Movie;
const Users = Models.User;
const Profiles = Models.Profile;

// mongoose.connect("mongodb://localhost:27017/Petflix", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(process.env.CONNECTION_URI, {useNewUrlParser: true, useUnifiedTopology: true});

//Middleware
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(morgan('common'));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error');
})

//-------------------GET Requests----------------------//

// GET HOMEPAGE
app.get('/', (req, res) => {
    let message = "Petflix Home";
    res.status(200).send(message);
})

// GET A LIST OF ALL MOVIES
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(200).json(movies);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
        })
})

// GET A USER BY THEIR USERNAME
app.get('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne({ username: req.params.username})
        .then((user) => {
            res.json(user);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send("Error: " + error);
        })
})

// GET A LIST OF PROFILES BY THE USERNAME
app.get('/users/:username/profiles', (req, res) => {
    Users.find({ username: req.params.username})
        .then((user) => {
            res.status(300).json(user.profiles);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
        })
})

// GET A SINGLE RANDOM MOVIE
app.get('/movie', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.countDocuments()
        .then((count) => {
            let random = Math.floor(Math.random() * count);
            Movies.findOne().skip(random)
                .then((movie) => {
                    res.status(200).json(movie)
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).send("Error: " + error)
                })
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error)
        })
})

// GET A MOVIE BY ITS GENRE
app.get('/movies/:genre', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find({ 'genres': req.params.genre })
        .then((movie) => {
            res.status(200).json(movie)
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
        })
})

// GET A MOVIE BY ITS TITLE
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ title: req.params.title})
        .then((movie) => {
            res.status(200).json(movie);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
        })
})

//----------------POST Requests----------------//

// CREATES A NEW USER
app.post('/users', [
    check('username', 'Username must be at least 5 characters.').isLength({min: 5}),
    check('username', 'Username must only contain letters and numbers.').isAlphanumeric(),
    check('password', 'Password is required.').not().isEmpty(),
    check('email', 'Email does not appear to be valid').isEmail()
    ], (req, res) => {
        let hashedPassword = Users.hashPassword(req.body.password);
        Users.findOne({ username: req.body.username })
            .then((user) => {
                if (user) {
                    return res.status(400).send('The username ' + req.body.username + ' already exists.')
                } else {
                    Users.create({
                        username: req.body.username,
                        password: hashedPassword,
                        email: req.body.email,
                        profiles: [
                                {
                                    name: req.body.name,
                                    list: []
                                }
                            ]
                    }).then((user) => { res.status(201).json(user)})
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send("Error: " + error)
                    })
                }
            }).catch((error) => {
                console.log(error);
                res.status(500).send("Error: " + error);
            });
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()})
        }
});

// ADDS A PROFILE
app.post('/users/:username/profiles/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profiles.findOne({ name: req.body.name})
        .then((profile) => {
            if(profile) {
                return res.status(400).send('A profile with the name ' + req.body.name + ' already exists.');
            } else {
                Profiles.create({
                    name: req.body.name,
                    list: []
                })
                .then((profile) => { res.status(201).json(profile)})
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error: ' + error)
                })
            }
        }).catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        }) 
});

// ADDS A MOVIE TO YOUR LIST
app.post('/users/:username/profiles/:name/list/:movieId', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profiles.findOneAndUpdate({ name: req.params.name }, { $push: { list: req.params.movieId }}, { new: true })
        .then((updatedList) => {
            res.status(201).json(updatedList);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
        });
})

//--------------------PUT Requests-----------------------//

// UPDATES A PROFILE NAME
app.put('users/:username/profiles/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profiles.findByIdAndUpdate({ name: req.params.name}, { $set: {name: req.body.name}}, {new: true})
        .then((updatedProfile) => {
            res.status(201).json(updatedProfile);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

// UPDATES A USERNAME 
app.put('/users/:username/username', passport.authenticate('jwt', { session: false }), [ 
    check('username','Username must be at least 5 characters.').isLength({min: 5}),
    check('username', 'Username must only contain letters and numbers.').isAlphanumeric()
    ], (req, res) => {
        Users.findByIdAndUpdate({ username: req.params.username}, { $set: { username: req.body.username }}, { new: true })
            .then((updatedUsername) => {
                res.status(201).json(updatedUsername);
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send("Error: " + error);
            });
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }
});

// UPDATES A PASSWORD
app.put('/users/:username/password', passport.authenticate('jwt', { session: false }), [ 
    check('Password', 'Password is required.').not().isEmpty()
    ], (req, res) => {
        Users.findByIdAndUpdate({ username: req.params.username}, { $set: { password: req.body.password }}, { new: true })
            .then((updatedPassword) => {
                res.status(201).json(updatedPassword);
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send("Error: " + error);
            });
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }
});

// UPDATES AN EMAIL
app.put('/users/:username/email', passport.authenticate('jwt', { session: false }), [ 
    check('Email', 'Email does not appear to be valid.').isEmail()
    ], (req, res) => {
        Users.findByIdAndUpdate({ username: req.params.username}, { $set: { email: req.body.email }}, { new: true })
            .then((updatedEmail) => {
                res.status(201).json(updatedEmail);
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send("Error: " + error);
            });
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }
});

//--------------------DELETE Requests----------------------//

// DELETES A MOVES FROM A PROFILES LIST
app.delete('/users/:username/profiles/:name/list/:movieId', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profiles.findOneAndRemove({ name: req.params.name }, { $pull: { list: req.params.username }}, { new: true })
        .then((updatedList) => {
            res.status(200).json(updatedList);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
        });
});

// DELETES A PROFILE BY ITS NAME
app.delete('/users/:username/profiles/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profiles.findOneAndRemove({ name: req.params.name })
        .then((profile) => {
            if (!profile) {
                res.status(400).send('Profile with the name ' + req.params.name + ' doesnt exist.');
            } else {
                res.status(200).send('Profile with the name ' + req.params.name + ' was removed.');
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        })
});

// DELETS A USER BY THEIR USERNAME
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndRemove({ username: req.params.username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.username + ' was not found.');
            } else {
                res.status(200).send(req.params.username + ' was deleted.')
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
        })
})


//---------------Listen for Requests--------------//

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});