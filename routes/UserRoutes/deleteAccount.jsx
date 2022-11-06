const passport = require('passport');
let Users = require('../../models/User.jsx').User;

module.exports = (router) => {
    router.delete('/delete-account/:id',
    //  passport.authenticate('jwt'), 
     (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        Users.findByIdAndRemove({ _id: req.params.id })
        .then(user => {
            return res.status(201).send({message: "User deleted successfully", status: 'success'})
        })
        .catch(err => { 
            return res.status(500).send({message: "There was a problem deleting the user.", status: 'fail'})
        })
    })
}