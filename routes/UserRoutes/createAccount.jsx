
let Users = require('../../models/User.jsx').User;
let crypto = require('crypto');

module.exports = (router) => {
    // Create an Account
    router.post('/register-account', (req, res) => {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, 'sha512').toString('hex')
        Users.findOne({email: req.body.email})
        .then((user) => {
            if (user) {
                res.status(400).send('Email already exists')
            } else {
                let initArray = [];
                let firstAccount = {};
                let pupsAccount = {};
                firstAccount.name = req.body.name;
                firstAccount.type = 'adult';
                firstAccount.favorites = [];
                pupsAccount.name = 'Pups';
                pupsAccount.type = 'pups';
                pupsAccount.favorites = [];
                initArray = [firstAccount, pupsAccount]
                Users.create({
                    email: req.body.email,
                    joinedDate: new Date().toISOString(),
                    hash: hash,
                    salt: salt,
                    accounts: initArray
                })
                .then(user => {
                    res.status(201).send({message: 'Account created successfully.', status: 'success', user: user})
                })
                .catch(error => {
                    res.status(500).send({message: 'There was a problem creating your account.', status: 'fail', error: error})
                })
            }
            
        })
        .catch(err => {
            res.status(500).send({message: 'There was a problem finding the users.', status: 'fail', error: err});
        })
    })

    
}