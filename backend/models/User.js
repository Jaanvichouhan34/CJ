const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, default: 'Friend' },
    age: { type: String, default: '' },
    college: { type: String, default: '' },
    work: { type: String, default: '' },
    preferredMode: { type: String, enum: ['friend', 'pro'], default: 'friend' },
    bio: { type: String, default: '' },
    joinDate: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
