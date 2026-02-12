const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);
