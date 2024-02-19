const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now // Set the default value to the current date/time when a tweet is created
    },
    niche: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    date_of_birth: {
        type: String,
        required: true
    },
    socials: {
        type: String,
        required: true
    },
    profile_img: {
        url: {
            type: String,
        },
        filename: String,
    }

});

const User = mongoose.model('User', userSchema);

module.exports = User;