// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const crypto = require("crypto");
const auth = require("../middleware/auth");
require("dotenv").config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "soumyasecret";

// Middleware to handle async/await errors
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Register route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return token and user info (without password)
    const userObj = user.toObject();
    delete userObj.password;
    
    res.status(201).json({
      token,
      user: userObj,
      message: "User registered successfully"
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return token and user info (without password)
    const userObj = user.toObject();
    delete userObj.password;
    
    res.json({ 
      token, 
      user: userObj,
      message: "Logged in successfully" 
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Failed to log in user" });
  }
});

// Get current user profile
router.get('/me', auth, asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
}));

// Update user profile
router.put('/me', auth, asyncHandler(async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'profilePicture', 'bio', 'preferences'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    updates.forEach(update => {
      user[update] = req.body[update];
    });

    await user.save();
    
    // Return updated user without password
    const userObj = user.toObject();
    delete userObj.password;
    
    res.json(userObj);
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(400).json({ error: 'Failed to update profile' });
  }
}));

// Update password
router.put('/password', auth, asyncHandler(async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }

    const user = await User.findById(req.user.userId).select('+password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Update password error:', err);
    res.status(400).json({ error: 'Failed to update password' });
  }
}));

module.exports = router;
