const Notice = require('../models/Notice');

// Create Notice
exports.createNotice = async (req, res) => {
    try {
        const { title, content } = req.body;
        const notice = await Notice.create({ title, content });
        res.status(201).json(notice);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get All Notices
exports.getAllNotices = async (req, res) => {
    try {
        const notices = await Notice.find().sort({ createdAt: -1 });
        res.status(200).json(notices);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete Notice
exports.deleteNotice = async (req, res) => {
    try {
        await Notice.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Notice deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
