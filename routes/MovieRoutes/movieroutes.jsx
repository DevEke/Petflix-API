
let Movies = require('../../models/Movie.jsx').Movie;

module.exports = (router) => {
    // GETS ALL MOVIES
    router.get('/movies', (req, res) => {
        Movies.find()
            .then((movies) => {
                res.status(200).send({message: 'Movies retrieved successfully', status: 'success', movies: movies});
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send({message: 'There was a problem retrieving the movies', status:'fail', error: error});
            })
    })

    // GETS A SINGLE RANDOM MOVIE
    router.get('/movie', (req, res) => {
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

