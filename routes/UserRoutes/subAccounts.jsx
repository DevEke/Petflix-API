
let Users = require('../../models/User.jsx').User;
const { body, validationResult } = require('express-validator');

module.exports = (router) => {
    // ADDS A NEW PROFILE TO THE ACCOUNT
    router.post('/users/:userID/profiles',
    body('name').not().isEmpty().withMessage('Name cannot be empty.'),
    (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({message: 'Please check your credentials.', status: 'fail', errors: errors})
        }
        const newAccount = {};
        newAccount.name = req.body.name;
        newAccount.type = req.body.type;
        newAccount.favorites = [];
        newAccount.permanent = false;
        Users.findOneAndUpdate({ _id: req.params.userID}, {
            $push: {
                accounts: newAccount
            }
        }, {new: true})
        .then((user) => {
            return res.status(201).send({message: 'New profile was added to your account.', status: 'success'});
        })
        .catch((err) => {
            return res.status(500).send({message: 'There was a problem adding the profile.', status: 'fail', error: err})
        })
    })

    router.delete('/users/:userID/profiles/:profileID',
    (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        Users.findOneAndUpdate({_id: req.params.userID}, {
            $pull: {
                accounts: {_id: req.params.profileID }
            }
        }, {new: true})
        .then((user) => {
            return res.status(201).send({message: 'Profile successfully removed.', status: 'success'});
        })
        .catch((err) => {
            return res.status(500).send({message: 'There was a problem removing the profile.', status: 'fail', error: err})
        })
    })
}