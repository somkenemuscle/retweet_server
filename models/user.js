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
    },
    createdAt: {
        type: Date,
        default: Date.now // Set the default value to the current date/time when a tweet is created
    },
    niche: {
        type: String,
    },
    gender: {
        type: String,

    },
    date_of_birth: {
        type: String,
    },
    socials: {
        type: String,

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