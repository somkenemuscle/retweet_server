const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comment');

// Tweet Schema
const tweetSchema = new Schema({
    text: {
        type: String,
        required: function () {
            // 'this' refers to the document being validated
            return !this.image;
        }
    },
    image: {
        url: {
            type: String,
            required: function () {
                // 'this' refers to the document being validated
                return !this.text;
            }
        },
        filename: String,
    },
    createdAt: {
        type: Date,
        default: Date.now // Set the default value to the current date/time when a tweet is created
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    likes: {
        type: Number,
        default: 0
    }, // Number of likes
    likedBy: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ] // Array of user IDs who liked the tweet
});

//delete all tweet and comments
tweetSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        });
    }
});

// Create models for Tweet schema
const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = { Tweet };
