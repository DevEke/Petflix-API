const jwt = require('jsonwebtoken');
const passport = require('passport');
require('./userAuth.jsx');


let generateJWTToken = (user) => {
    return jwt.sign(user, process.env.USER_SECRET, {
        subject: user.email,
        expiresIn: '7d',
        algorithm: 'HS256'
    });
}

module.exports = (router) => {
    router.post('/sign-in', (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
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
