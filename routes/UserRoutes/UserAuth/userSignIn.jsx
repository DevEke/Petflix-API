const jwt = require('jsonwebtoken');
const passport = require('passport');
require('./userAuth.jsx');
const { body, validationResult } = require('express-validator');


let generateJWTToken = (user) => {
    return jwt.sign(user, process.env.USER_SECRET, {
        subject: user.email,
        expiresIn: '7d',
        algorithm: 'HS256'
    });
}

module.exports = (router) => {
    router.post('/sign-in',
    body('email').isEmail().withMessage('Please enter a valid email address.'),
    body('password').isLength({min: 5}).withMessage('Password must be at least 5 characterss long.'),
     (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
             return res.status(400).send({message: 'Please check your credentials.', status: 'fail', errors: errors})
        }
        passport.authenticate('local', (error, user, info) => {
            if (error || !user) {
                return res.status(400).send({
                    message: 'Your credentials are incorrect.',
                    status: 'fail'
                })
            }
            req.login(user, err => {
                if (err) return res.send(err)
                let token = generateJWTToken(user.toJSON());
                return res.send({message: 'You were successfully logged in.', status: 'success', user: user, token: token})
            })
        })(req, res)
    })
    
  }
