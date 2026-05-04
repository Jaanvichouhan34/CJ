const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');

// GET /api/reminders -> Get all reminders from DB
router.get('/', async (req, res) => {
    try {
        const reminders = await Reminder.find({ fired: false });
        res.json(reminders);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reminders' });
    }
});

// POST /api/reminders -> Create a new reminder in DB
router.post('/', async (req, res) => {
    try {
        const { time, date, message } = req.body;
        const newReminder = await Reminder.create({ time, date, message });
        res.json({ success: true, reminder: newReminder });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create reminder' });
    }
});

// POST /api/reminders/:index/fire -> Mark reminder as fired
// Note: Changed index to ID for DB reliability
router.post('/:id/fire', async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id);
        if (reminder) {
            reminder.fired = true;
            await reminder.save();
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fire reminder' });
    }
});

// DELETE /api/reminders/:id -> Delete a reminder from DB
router.delete('/:id', async (req, res) => {
    try {
        await Reminder.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete reminder' });
    }
});

module.exports = router;
