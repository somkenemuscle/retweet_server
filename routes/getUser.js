const express = require('express');
const router = express.Router();
const handleAsyncErr = require('../utils/catchAsync');
const isLoggedin = require('../utils/isLoggedin');
const User = require('../models/user')
// GET the current user's information
router.get("/", isLoggedin, handleAsyncErr(async (req, res, next) => {
    // Access the logged-in user's information available in req.user
    const currentUser = req.user;
    // Send the user information back as a JSON response
    res.json(currentUser);
}));

// GET user's information based on id
router.get("/:userid", handleAsyncErr(async (req, res, next) => {
    const { userid } = req.params;
    const user = await User.findById(userid)
    if (!user) return res.status(404).json({ message: 'user was not found' });
    // Send the user information back as a JSON response
    res.json(user);
}));

module.exports = router;