const passport = require('passport');
let Movies = require('../../models/Movie.jsx').Movie;

module.exports = (router) => {
    // GETS ALL MOVIES
    router.get('/movies', 
    // passport.authenticate('jwt'), 
    (req, res) => {
        Movies.find()
            .then((movies) => {
                res.status(200).send({message: 'Movies retrieved successfully', status: 'success', movies: movies});
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send({message: 'There was a problem retrieving the movies', status:'fail', error: error});
            })
    })

    router.get('/movie/:movieID',
    // passport.authenticate('jwt'),
    (req, res) => {
        Movies.findById({_id: req.params.movieID})
        .then((movie) => {
            res.status(200).send({message: 'Movie successfully retrieved', status: 'success', movie: movie})
        })
        .catch((err) => {
            res.status(500).send({message: 'There was a problem finding that movie', status: 'fail', error: err})
        })
    })

    // GETS A SINGLE RANDOM MOVIE
    router.get('/movie', 
    // passport.authenticate('jwt'), 
    (req, res) => {
        Movies.countDocuments()
            .then((count) => {
                let random = Math.floor(Math.random() * count);
                Movies.findOne().skip(random)
                    .then((movie) => {
                        res.status(200).send({message: 'Movie retrieved successfully', status: 'success', movie: movie})
                    })
                    .catch(error => {
                        console.error(error);
                        res.status(500).send({message: 'There was a problem retrieving the movie', status:'fail', error: error});
                    })
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send({message: 'There was a problem retrieving the movies', status:'fail', error: error});
            })
    })

}

