const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

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

let profileSchema = mongoose.Schema({
    name: {type: String, required: true},
    list: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
})

let userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    profiles: [profileSchema]
});

// userSchema.statics.hashPassword = (password) => {
//     return bcrypt.hashSync(password, 10);
// };

// userSchema.methods.validatePassword = function(password) {
//     return bcrypt.compareSync(password, this.Password);
// };

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
let Profile = mongoose.model('Profile', profileSchema);

module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Profile = Profile;