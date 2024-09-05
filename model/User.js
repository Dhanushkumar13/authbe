const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    age: Number,
    dob: Date,
    contact: String,
});

module.exports = mongoose.model('User', UserSchema);