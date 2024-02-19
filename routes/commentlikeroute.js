const express = require('express');
const router = express.Router();
const handleAsyncErr = require('../utils/catchAsync');
const isLoggedin = require('../utils/isLoggedin');
const Comment = require('../models/comment');


// add like to a tweet
router.post("/:commentId/:userId", isLoggedin, handleAsyncErr(async (req, res, next) => {
    const { commentId, userId } = req.params;
    // Check if the user has already liked the tweet
    const comment = await Comment.findById(commentId);
    if (!comment) {
        console.log('comment not found');
        return;
    }

    if (comment.likedBy.includes(userId)) {
        // User has already liked the tweet, so unlike it
        await Comment.findByIdAndUpdate(commentId, {
            $inc: { likes: -1 },
            $pull: { likedBy: userId }
        });
        const updatedComment = await Comment.findById(commentId).populate('author');
        return res.status(200).json({ message: "Comment unliked successfully", comment: updatedComment });
    } else {
        // User hasn't liked the tweet, so like it
        await Comment.findByIdAndUpdate(commentId, {
            $inc: { likes: 1 },
            $push: { likedBy: userId }
        });
        const updatedComment = await Comment.findById(commentId).populate('author');
        return res.status(200).json({ message: "Comment liked successfully", comment: updatedComment });
    }
}));

module.exports = router;
