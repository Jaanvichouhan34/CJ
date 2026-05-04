const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
    time: {
        type: String,
        required: true
    },
    date: {
        type: String, // YYYY-MM-DD
        required: false
    },
    message: {
        type: String,
        required: true
    },
    fired: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Reminder', ReminderSchema);
