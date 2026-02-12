const Exam = require('../models/Exam');

// Create Exam
exports.createExam = async (req, res) => {
    try {
        const { title, duration, questions } = req.body;
        const exam = await Exam.create({
            title,
            duration,
            questions,
            createdBy: req.user.id // From authMiddleware
        });
        res.status(201).json(exam);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get All Exams
exports.getAllExams = async (req, res) => {
    try {
        const exams = await Exam.find().sort({ createdAt: -1 });
        res.status(200).json(exams);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get Single Exam
exports.getExamById = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        if (!exam) return res.status(404).json({ message: 'Exam not found' });
        res.status(200).json(exam);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete Exam
exports.deleteExam = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        if (!exam) return res.status(404).json({ message: 'Exam not found' });

        // Check if user is the creator or admin (Simplified for now)
        await Exam.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Exam deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
