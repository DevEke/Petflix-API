const passport = require('passport');
let Movies = require('../../models/Movie.jsx').Movie;

module.exports = (router) => {
    // GETS ALL MOVIES
    router.get('/movies', 
    // passport.authenticate('jwt'), 
    (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        Movies.find()
            .then((movies) => {
                return res.status(200).send({message: 'Movies retrieved successfully', status: 'success', movies: movies});
            })
            .catch((error) => {
                console.error(error);
                return res.status(500).send({message: 'There was a problem retrieving the movies', status:'fail', error: error});
            })
    })

    // GET A SINGLE MOVIE BY ID
    router.get('/movies/:movieID',
    // passport.authenticate('jwt'),
    (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        Movies.findById({_id: req.params.movieID})
        .then((movie) => {
            return res.status(200).send({message: 'Movie successfully retrieved', status: 'success', movie: movie})
        })
        .catch((err) => {
            return res.status(500).send({message: 'There was a problem finding that movie', status: 'fail', error: err})
        })
    })

    // GET ALL MOVIES BY THE GENRE
    router.get('/movies/genres/:genre',
    // passport.authenticate('jwt'),
    (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        Movies.find({genres: {$elemMatch: {$eq: req.params.genre}}})
        .then((movies) => {
            res.status(200).send({message: 'Movies successfully retrieved', status: 'success', movies: movies})
        })
        .catch((err) => {
            return res.status(500).send({message: 'There was a problem finding the movies', status: 'fail', error: err})
        })
    })

    // GETS A SINGLE RANDOM MOVIE
    router.get('/random-movie', 
    // passport.authenticate('jwt'), 
    (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        Movies.countDocuments()
            .then((count) => {
                let random = Math.floor(Math.random() * count);
                Movies.findOne().skip(random)
                    .then((movie) => {
                        return res.status(200).send({message: 'Movie retrieved successfully', status: 'success', movie: movie})
                    })
                    .catch(error => {
                        console.error(error);
                        return res.status(500).send({message: 'There was a problem retrieving the movie', status:'fail', error: error});
                    })
            })
            .catch((error) => {
                console.error(error);
               return res.status(500).send({message: 'There was a problem retrieving the movies', status:'fail', error: error});
            })
    })

}

