
let Users = require('../../models/User.jsx').User;
const { body, validationResult } = require('express-validator');

module.exports = (router) => {
    router.post('/:userID/new-account',
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
        Users.findOneAndUpdate({ _id: req.params.userID}, {
            $push: {
                accounts: newAccount
            }
        }, {new: true})
        .then((user) => {
            return res.status(201).send({message: 'New account was created favorites.', status: 'success'});
        })
        .catch((err) => {
            return res.status(500).send({message: 'There was a problem adding the account.', status: 'fail', error: err})
        })
    })

    router.delete('/:userID/remove-account/:accountID',
    (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        Users.findOneAndUpdate({_id: req.params.userID}, {
            $pull: {
                accounts: {_id: req.params.accountID }
            }
        }, {new: true})
        .then((user) => {
            return res.status(201).send({message: 'Account successfully removed.', status: 'success'});
        })
        .catch((err) => {
            return res.status(500).send({message: 'There was a problem removing the account.', status: 'fail', error: err})
        })
    })
}