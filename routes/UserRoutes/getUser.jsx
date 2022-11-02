let Users = require('../../models/User.jsx').User;
const passport = require('passport');

module.exports = (router) => {

    router.get('/user/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
            Users.findOne({ _id: req.params.id })
            .then(auth=> {
                res.status(200).json(auth)
            })
            .catch(error => {
                res.status(500).send('Error: ' + error)
            })
        }
    )
}