const mongoose = require('mongoose');
const crypto = require('crypto');

let profileSchema = mongoose.Schema({
    name: {type: String},
    type: {type: String},
    favorites: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}],
    permanent: {type: Boolean, required: true}
})

let userSchema = mongoose.Schema({
    email: {type: String, required: true}, 
    hash: {type: String, required: true},
    salt: {type: String, required: true},
    profiles: [profileSchema],
    joinedDate: {type: Date},
    resetCode: {type: String}
})



userSchema.methods.verifyPassword = (password, hash, salt) => {
    let hashVerify = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === hashVerify   
}

let User = mongoose.model('User', userSchema);

module.exports.User = User;