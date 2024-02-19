const express = require('express');
const Comment = require('../models/comment');
const router = express.Router();
const handleAsyncErr = require('../utils/catchAsync');
const isLoggedin = require('../utils/isLoggedin');
const { Tweet } = require('../models/tweet');

// GET all comments related to a specific tweet and post them
router.get("/:id", handleAsyncErr(async (req, res, next) => {
    const foundTweet = await Tweet.findById(req.params.id)
        .populate({
            path: 'comments',
            options: { sort: { createdAt: -1 } }, // Sort comments by createdAt in descending order
            populate: {
                path: 'author'
            }
        })
        .populate('author');
    res.json(foundTweet.comments); // Return only the comments array from the found tweet
}));

// POST a new comment
router.post("/:id", isLoggedin, handleAsyncErr(async (req, res, next) => {
    const foundTweet = await Tweet.findById(req.params.id).populate('comments').populate('author');
    const newComment = await Comment.create({
        ...req.body,
        author: req.user._id,
        createdAt: new Date() // Assign the creation date to the createdAt field
    });
    foundTweet.comments.push(newComment)
    await newComment.save(); // Save the changes to the database
    await foundTweet.save();
    res.json({ newComment });
}));

module.exports = router;