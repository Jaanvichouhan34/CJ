const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const REMINDERS_FILE = path.join(__dirname, '..', 'data', 'reminders.json');

function readReminders() {
    try {
        if (!fs.existsSync(REMINDERS_FILE)) return [];
        const data = fs.readFileSync(REMINDERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('[Reminders API] Error reading reminders:', err);
        return [];
    }
}

function writeReminders(data) {
    try {
        // Ensure data directory exists
        const dir = path.dirname(REMINDERS_FILE);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(REMINDERS_FILE, JSON.stringify(data, null, 4));
        return true;
    } catch (err) {
        console.error('[Reminders API] Error writing reminders:', err);
        return false;
    }
}

router.get('/', (req, res) => {
    res.json(readReminders());
});

router.post('/', (req, res) => {
    const { time, message } = req.body;
    if (!time || !message) return res.status(400).json({ error: 'Time and message required' });
    const reminders = readReminders();
    reminders.push({ time, message, fired: false });
    if (writeReminders(reminders)) {
        res.json({ success: true, reminders });
    } else {
        res.status(500).json({ error: 'Failed to write' });
    }
});

router.post('/:index/fire', (req, res) => {
    const index = parseInt(req.params.index, 10);
    const reminders = readReminders();
    if (index >= 0 && index < reminders.length) {
        reminders[index].fired = true;
        if (writeReminders(reminders)) {
            res.json({ success: true, reminders });
        } else {
            res.status(500).json({ error: 'Failed to write' });
        }
    } else {
        res.status(404).json({ error: 'Not found' });
    }
});

router.delete('/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    const reminders = readReminders();
    if (index >= 0 && index < reminders.length) {
        reminders.splice(index, 1);
        if (writeReminders(reminders)) {
            res.json({ success: true, reminders });
        } else {
            res.status(500).json({ error: 'Failed' });
        }
    } else {
        res.status(404).json({ error: 'Not found' });
    }
});

module.exports = router;
