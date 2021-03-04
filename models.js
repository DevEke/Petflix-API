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
});

let userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    profiles: [profileSchema]
});

let profileSchema = mongoose.Schema({
    name: {type: String, required: true},
    list: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
})

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;