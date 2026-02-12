const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    answers: {
        type: Map,
        of: String // Key: Question ID, Value: Option ID
    },
    attemptedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Attempt', attemptSchema);
