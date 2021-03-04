const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Models = require('./models.js');
const morgan = require('morgan');

const app = express();
const Movies = Models.Movie;
const Users = Models.User;

// mongoose.connect("mongodb://localhost:27017/Petflix", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(process.env.CONNECTION_URI, {useNewUrlParser: true, useUnifiedTopology: true});

//Middleware
dotenv.config();
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(morgan('common'));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error');
})

//GET Requests

app.get('/', (req, res) => {
    let message = "Petflix Home";
    res.status(200).send(message);
})

app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(200).json(movies);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
        })
})

app.get('/movie', (req, res) => {
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
        .catch(error => {
            console.error(error);
            res.status(500).send("Error: " + error)
        })
})

app.get('/movies/:genre', (req, res) => {
    Movies.find({ 'genres': req.params.genre })
        .then((movie) => {
            res.status(200).json(movie)
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
        })
})

app.get('/movies/:title', (req, res) => {
    Movies.findOne({ title: req.params.title})
        .then((movie) => {
            res.status(200).json(movie);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
        })
})

//POST Requests

app.post('/users', [
    check('username', 'Username must be at least 5 characters.').isLength({min: 5}),
    check('username', 'Username must only contain letters and numbers.').isAlphanumeric(),
    check('password', 'Password is required.').not().isEmpty(),
    check('email', 'Email does not appear to be valid').isEmail()
    ], (req, res) => {
        Users.findOne({ username: req.body.username })
            .then((user) => {
                if (user) {
                    return res.status(400).send('The username ' + req.body.username + ' already exists.')
                } else {
                    Users.create({
                        username: req.body.username,
                        password: req.body.password,
                        email: req.body.email
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

app.post('/users/username/:profile/list/:movieId', (req, res) => {
    Users.findOneAndUpdate({ profile: req.params.profile }, { $push: { list: req.params.movieId }}, { new: true })
        .then((updatedList) => {
            res.status(201).json(updatedList);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
        });
})

//PUT Requests

app.put('/users/:username/update-username', [ 
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

app.put('/users/:username/update-password', [ 
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

app.put('/users/:username/update-email', [ 
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

//DELETE Requests

app.delete('/users/username/:profile/list/movieId', (req, res) => {
    Users.findOneAndRemove({ profile: req.params.profile }, { $pull: { list: req.params.username }}, { new: true })
        .then((updatedList) => {
            res.status(200).json(updatedList);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
        });
});

app.delete('/users/:username', (req, res) => {
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


//Listen for Requests

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});