const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const generateToken = require('../passport-auth/auth');
const handleAsyncErr = require('../utils/catchAsync');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const { v4: uuidv4 } = require('uuid');
const { cloudinary } = require('../cloudinary');


// /Signup post route
router.post("/signup", upload.single('profile_img'), handleAsyncErr(async (req, res, next) => {
    const { username, email, password, name, about, niche, gender, date_of_birth, socials } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });
        if (existingUser) {
            console.log("username or email already exist")
            return res.status(400).json({ message: 'Username or Email already exists' });
        }

        // Hash the password before storing in the database (hash and salt)
        const hashedPassword = await bcrypt.hash(password, 10);
        let imageFile = null;
        if (req.file) {
            const { path, filename } = req.file;
            // Generate a unique public_id for the image using uuid
            const public_id = uuidv4();
            // Upload the image to Cloudinary with the generated public_id
            const uploadedImage = await cloudinary.uploader.upload(path, { public_id: public_id });
            // Set the imageFile object with the URL and filename provided by Cloudinary
            imageFile = {
                url: uploadedImage.secure_url,
                filename: filename
            }
        }

        // Create a new user
        const newUser = new User({
            username,
            email,
            name,
            password: hashedPassword,
            about,
            niche,
            date_of_birth,
            socials,
            gender,
            profile_img: imageFile ? imageFile : { url: null, filename: null }
        });

        // Save the user to the database
        await newUser.save();
        // Generate token using the imported function
        const token = generateToken(newUser); // Assuming newUser is your registered user object
        res.status(201).json({ message: 'User registered successfully', token });

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));




// POST /login route
router.post("/login", handleAsyncErr(async (req, res, next) => {
    const { username, password } = req.body;
    try {
        // Check if the user exists by their email/username
        const user = await User.findOne({ username });

        if (!user) {
            // User not found
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            // Passwords match, generate JWT token
            const token = generateToken(user);
            return res.status(200).json({ message: 'Login successful', token });
        } else {
            // Passwords don't match
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));

module.exports = router;