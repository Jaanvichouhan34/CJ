const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET: Get user memory from MongoDB
router.get('/', async (req, res) => {
  try {
    let user = await User.findOne();
    if (!user) return res.json({});
    res.json(user);
  } catch (err) {
    console.error('Fetch Memory Error:', err);
    res.status(500).json({ error: 'Failed to fetch memory from DB' });
  }
});

// POST: Save user memory to MongoDB
router.post('/', async (req, res) => {
  try {
    const { name, preferredMode, bio } = req.body;
    let user = await User.findOne();

    if (user) {
      user.name = name || user.name;
      user.preferredMode = preferredMode || user.preferredMode;
      user.bio = bio || user.bio;
      user.lastLogin = Date.now();
      await user.save();
    } else {
      user = await User.create({ name, preferredMode, bio });
    }

    res.json({ message: 'Memory saved to MongoDB', user });
  } catch (err) {
    console.error('Save Memory Error:', err);
    res.status(500).json({ error: 'Failed to save memory to DB' });
  }
});

module.exports = router;
