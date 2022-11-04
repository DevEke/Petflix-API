
let Users = require('../../models/User.jsx').User;
let Movies = require('../../models/Movie.jsx').Movie;
const passport = require('passport');


module.exports = (router) => {
    
    router.post('/:userID/:accountID/add-favorites/:movieID', passport.authenticate('jwt'), (req, res) => {
        Movies.findById({_id: req.params.movieID})
            .then((movie) => {
                Users.findOneAndUpdate({ _id: req.params.userID, 'accounts._id': req.params.accountID }, 
                { $push: {
                    'accounts.$.favorites': movie
                }}, {new: true})
                .then((updatedList) => {
                    res.status(201).send({message: 'Movie was added to your favorites.', status: 'success'});
                })
                .catch((error) => {
                    res.status(500).send({message: 'There was a problem adding the movie to your favorites.', status: 'fail', error: error});
                });
            })
            .catch((err) => {
                res.status(500).send({message: 'There was a problem finding the movie', status: 'fail', error: err})
            })
        
    });

    router.delete('/:userID/:accountID/remove-favorite/:movieID', passport.authenticate('jwt'), (req, res) => {
        Movies.findById({ _id: req.params.movieID})
            .then((movie) => {
                Users.findOneAndUpdate({ _id: req.params.userID, 'accounts._id': req.params.accountID}, 
                { $pull: { 
                    'accounts.$.favorites': {_id: movie._id}}
                }, {new: true})
                .then((updatedList) => {
                    res.status(201).send({message: 'Movie was removed from your favorites.', status: 'success'});
                })
                .catch((error) => {
                    res.status(500).send({message: 'There was a problem removing the movie to your favorites.', status: 'fail', error: error});
                });
            })
            .catch((err) => {
                res.status(500).send({message: 'There was a problem finding the movie', status: 'fail', error: err})
            })

    });
    
}