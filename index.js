const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
dotenv.config();
const app = express();

// mongoose.connect("mongodb://localhost:27017/Petflix", {useNewUrlParser: true, useUnifiedTopology: true});
// Connection 
mongoose.connect(process.env.CONNECTION_URI, {useNewUrlParser: true, useUnifiedTopology: true});//


//Middleware
app.use(morgan(':method :url - :referrer'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(session({
    secret: process.env.USER_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {secure: true}
}))
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
    done(null, user);
});
  
passport.deserializeUser((user, done) => {
    done(null, user);
});



require('./routes/UserRoutes/UserAuth/userSignIn.jsx')(app);
require('./routes/UserRoutes/createAccount.jsx')(app);
require('./routes/UserRoutes/forgotPassword.jsx')(app);
require('./routes/UserRoutes/resetPassword.jsx')(app);
require('./routes/MovieRoutes/movieroutes.jsx')(app);
require('./routes/UserRoutes/UserAuth/userAuth.jsx');





//-------------------GET Requests----------------------//

// GET HOMEPAGE
app.get('/', (req, res) => {
    let message = "Petflix Home";
    res.status(200).send(message);
})
/// Routes


//---------------Listen for Requests--------------//

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});