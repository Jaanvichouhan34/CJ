const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Target the desktop folder's memory.json
const MEMORY_FILE = path.join(__dirname, '..', '..', 'desktop', 'memory.json');

// Helper to read memory
function readMemory() {
    try {
        if (!fs.existsSync(MEMORY_FILE)) return {};
        const data = fs.readFileSync(MEMORY_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('[Memory API] Error reading memory:', err);
        return {};
    }
}

// GET /api/memory -> read and return memory.json
router.get('/', (req, res) => {
    const memory = readMemory();
    res.json(memory);
});

// POST /api/memory -> update memory.json with request body
router.post('/', (req, res) => {
    try {
        const newData = req.body;
        // Merge with existing or overwrite completely? Overwrite aligns with full setup.
        fs.writeFileSync(MEMORY_FILE, JSON.stringify(newData, null, 4));
        res.json({ success: true, memory: newData });
    } catch (err) {
        console.error('[Memory API] Error writing memory:', err);
        res.status(500).json({ error: 'Failed to write memory data' });
    }
});

module.exports = router;
