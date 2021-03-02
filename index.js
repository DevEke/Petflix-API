const express = require('express'),
      cors = require('cors'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      dotenv = require('dotenv'),
      Models = require('./models.js'),
      morgan = require('morgan');

const app = express();
const Movies = Models.Movie;

mongoose.connect("mongodb://localhost:27017/Petflix", {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.connect(process.env.CONNECTION_URI, {useNewUrlParser: true, useUnifiedTopology: true});

//Middleware
dotenv.config();
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(morgan('common'));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error');
})

//GET Requests

app.get('/', (req, res) => {
    let message = "Petflix Home";
    res.status(200).send(message);
})

app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(200).json(movies);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error" + error);
        })
})

app.get('/movies/:title', (req, res) => {
    Movies.findOne({ title: req.params.title})
        .then((movie) => {
            res.status(200).json(movie);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error" + error);
        })
})


//Listen for Requests

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});