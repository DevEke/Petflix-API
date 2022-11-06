const passport = require('passport');
let Users = require('../../models/User.jsx').User;

module.exports = (router) => {
    router.delete('/delete-account/:id',
    //  passport.authenticate('jwt'), 
     (req, res) => {
        Users.findByIdAndRemove({ _id: req.params.id })
        .then(user => {
            res.status(201).send({message: "User deleted successfully", status: 'success'})
        })
        .catch(err => { 
            res.status(500).send({message: "There was a problem deleting the user.", status: 'fail'})
        })
    })
}