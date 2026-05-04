const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'Friend'
    },
    preferredMode: {
        type: String,
        enum: ['friend', 'pro'],
        default: 'friend'
    },
    bio: {
        type: String,
        default: ''
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
