let Users = require('../../models/User.jsx').User;
const passport = require('passport');

module.exports = (router) => {

    router.get('/user/:id', passport.authenticate('jwt'), (req, res) => {
            Users.findOne({ _id: req.params.id })
            .then(auth=> {
                res.status(200).send({message: 'User successfully retrieved.', status: 'success', auth: auth})
            })
            .catch(error => {
                res.status(500).send({message: 'There was a problem retrieving a user.', status: 'fail', error: error})
            })
        }
    )
}