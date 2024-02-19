const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// User Schema
const commentSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now // Set the default value to the current date/time when a tweet is created
    },
    likes: {
        type: Number,
        default: 0
    }, // Number of likes
    likedBy: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ] // Array of user IDs who liked the comment
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;