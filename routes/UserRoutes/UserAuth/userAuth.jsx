const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');

let Users = require('../../../models/User.jsx').User;
let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;

passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => {
    Users.findOne({email: email}, (err, user) => {
        if (err) { return done(err)}
        if (!user) { return done(null, false)}
        if (!user.verifyPassword(password, user.hash, user.salt)) { return done(null, false)}
        return done(null, user)
    })
}))

passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.USER_SECRET
}, async (payload, done) => {
    return Users.findById(payload._id)
    .then(user => { return done(null, user)})
    .catch(err=> { return done(err) })
}))
