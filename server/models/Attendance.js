const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    roomNumber: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['present', 'absent'],
        default: 'present'
    },
    date: {
        type: String, // String format YYYY-MM-DD for easier uniqueness check per day
        required: true
    },
    markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

// Ensure unique attendance per student per room per day
attendanceSchema.index({ student: 1, roomNumber: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
