const Attempt = require('../models/Attempt');

// Store Attempt
exports.submitAttempt = async (req, res) => {
    try {
        const { examId, score, answers } = req.body;
        const attempt = await Attempt.create({
            studentId: req.user.id,
            examId,
            score,
            answers
        });
        res.status(201).json(attempt);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get Student Attempts
exports.getStudentAttempts = async (req, res) => {
    try {
        // If studentId provided in query (for admin), use that, otherwise use current user
        const studentId = req.query.studentId || req.user.id;
        const attempts = await Attempt.find({ studentId }).populate('examId', 'title');
        res.status(200).json(attempts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
