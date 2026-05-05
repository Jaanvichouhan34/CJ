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
    const { name, age, college, work, preferredMode, bio, joinDate } = req.body;
    let user = await User.findOne();

    if (user) {
      user.name = name || user.name;
      user.age = age || user.age;
      user.college = college || user.college;
      user.work = work || user.work;
      user.preferredMode = preferredMode || user.preferredMode;
      user.bio = bio || user.bio;
      user.lastLogin = Date.now();
      await user.save();
    } else {
      user = await User.create({ name, age, college, work, preferredMode, bio, joinDate });
    }

    res.json({ message: 'Memory saved to MongoDB', user });
  } catch (err) {
    console.error('Save Memory Error:', err);
    res.status(500).json({ error: 'Failed to save memory to DB' });
  }
});

// DELETE: Clear all memory (Sign Out)
router.delete('/', async (req, res) => {
  try {
    const User = require('../models/User');
    const Chat = require('../models/Chat');
    await User.deleteMany({});
    await Chat.deleteMany({});
    res.json({ message: 'Memory cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear memory' });
  }
});

module.exports = router;
