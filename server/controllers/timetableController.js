const Timetable = require('../models/Timetable');

// Get all timetable items
exports.getTimetable = async (req, res) => {
    try {
        const items = await Timetable.find().sort({ date: 1, startTime: 1 });
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add timetable item
exports.addTimetableItem = async (req, res) => {
    try {
        const { subject, date, startTime, endTime, venue } = req.body;
        const newItem = await Timetable.create({
            subject,
            date,
            startTime,
            endTime,
            venue
        });
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete timetable item
exports.deleteTimetableItem = async (req, res) => {
    try {
        await Timetable.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
