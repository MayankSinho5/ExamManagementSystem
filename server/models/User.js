const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    rollNumber: {
        type: String,
        required: function () { return this.role === 'student'; },
        unique: true,
        sparse: true // Allows null/missing for admins but unique if present
    },
    email: {
        type: String,
        required: function () { return this.role === 'admin'; },
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'student'],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
