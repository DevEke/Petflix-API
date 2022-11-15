
let Users = require('../../models/User.jsx').User;
let crypto = require('crypto');
const { body, validationResult } = require('express-validator');

module.exports = (router) => {
    // Create an Account
    router.post('/users',
    body('email').isEmail().withMessage('Please enter a valid email address.'),
    body('password').isLength({min: 5}).withMessage('Password must be at least 5 characterss long.'),
    body('confirm').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Make sure your confirmation matches your password.')
        }
        return true;
    }),
    body('name').not().isEmpty().withMessage('Name cannot be empty.'),
     (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({message: 'Please check your credentials.', status: 'fail', errors: errors})
        }
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, 'sha512').toString('hex')
        Users.findOne({email: req.body.email})
        .then((user) => {
            if (user) {
               return res.status(400).send('Email already exists')
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
                   return res.status(201).send({message: 'Account created successfully.', status: 'success', user: user})
                })
                .catch(error => {
                     return res.status(500).send({message: 'There was a problem creating your account.', status: 'fail', error: error})
                })
            }
            
        })
        .catch(err => {
             return res.status(500).send({message: 'There was a problem finding the users.', status: 'fail', error: err});
        })
    })

    
}