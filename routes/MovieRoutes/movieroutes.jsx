
let Movies = require('../../models/Movie.jsx').Movie;

module.exports = (router) => {
    // GETS ALL MOVIES
    router.get('/movies', (req, res) => {
        Movies.find()
            .then((movies) => {
                res.status(200).json(movies);
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send("Error: " + error);
            })
    })

    // GETS A SINGLE RANDOM MOVIE
    router.get('/movie', (req, res) => {
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

}

