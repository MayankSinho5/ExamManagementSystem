const Attendance = require('../models/Attendance');

// Mark or Update Attendance
exports.markAttendance = async (req, res) => {
    try {
        const { studentId, roomNumber, status, date } = req.body;

        const attendance = await Attendance.findOneAndUpdate(
            { student: studentId, roomNumber, date },
            {
                status,
                markedBy: req.user.id
            },
            { new: true, upsert: true }
        ).populate('student', 'name rollNumber');

        res.status(200).json(attendance);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get attendance for a specific room and date
exports.getRoomAttendance = async (req, res) => {
    try {
        const { roomNumber, date } = req.query;
        const records = await Attendance.find({ roomNumber, date }).populate('student', 'name rollNumber');
        res.status(200).json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get current logged-in student's attendance
exports.getMyAttendance = async (req, res) => {
    try {
        const records = await Attendance.find({ student: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
