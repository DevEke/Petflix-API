const passport = require('passport');
let Users = require('../../models/User.jsx').User;
let crypto = require('crypto');

module.exports = (router) => {

    router.put('/reset-password/:id', 
    // passport.authenticate('jwt'), 
    (req, res) => {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, 'sha512').toString('hex')
        Users.findOneAndUpdate({ _id: req.params.id}, {
            $set: {
                hash: hash,
                salt: salt
            }
        }, { new: true})
        .then(user => {
            res.status(200).send({message: 'Your password was reset successfully.', status: 'success'})
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({message: 'There was a problem resetting your password.', status: 'fail', error: err})
        })
    })
}