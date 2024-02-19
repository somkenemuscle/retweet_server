const express = require('express');
const router = express.Router();
const handleAsyncErr = require('../utils/catchAsync');
const isLoggedin = require('../utils/isLoggedin');
const { Tweet } = require('../models/tweet');

// add like to a tweet
router.post("/:tweetId/:userId", isLoggedin, handleAsyncErr(async (req, res, next) => {
    const { tweetId, userId } = req.params
    // Check if the user has already liked the tweet
    const tweet = await Tweet.findById(tweetId).populate('author');
    if (!tweet) {
        console.log('Tweet not found');
        return;
    }
    if (tweet.likedBy.includes(userId)) {
        // User has already liked the tweet, so unlike it
        await Tweet.findByIdAndUpdate(tweetId, {
            $inc: { likes: -1 },
            $pull: { likedBy: userId }
        });
        const updatedTweet = await Tweet.findById(tweetId).populate('author');
        return res.status(200).json({ message: "Tweet unliked successfully", tweet: updatedTweet });
    } else {
        // User hasn't liked the tweet, so like it
        await Tweet.findByIdAndUpdate(tweetId, {
            $inc: { likes: 1 },
            $push: { likedBy: userId }
        });
        const updatedTweet = await Tweet.findById(tweetId).populate('author');
        return res.status(200).json({ message: "Tweet liked successfully", tweet: updatedTweet });
    }
}));

module.exports = router;



