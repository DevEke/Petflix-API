const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    director: {type: String, required: true},
    genres: [String],
    rating: {type: String, required: true},
    backdropURL: {type: String, required: true},
    posterURL: {type: String, required: true},
    trailerURL: {type: String, required: true},
    logoURL: {type: String, required: true},
})

let Movie = mongoose.model('Movie', movieSchema);

module.exports.Movie = Movie;