const Seating = require('../models/Seating');

// Get all seating plans
exports.getSeatingPlans = async (req, res) => {
    try {
        const seating = await Seating.find().sort({ updatedAt: -1 });
        res.status(200).json(seating);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update or Create Seating Plan for a specific room
exports.updateSeatingPlan = async (req, res) => {
    try {
        const { plan } = req.body;
        const roomNumber = String(plan.roomNumber || 'Unknown').trim();

        // Update if exists, or create new (Upsert)
        const seating = await Seating.findOneAndUpdate(
            { roomNumber },
            {
                plan: { ...plan, roomNumber }, // Ensure plan object also has trimmed roomNumber
                updatedBy: req.user.id
            },
            { new: true, upsert: true }
        );

        res.status(200).json(seating);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a specific room plan
exports.deleteSeatingPlan = async (req, res) => {
    try {
        const roomNumber = String(req.params.roomNumber).trim();
        await Seating.findOneAndDelete({ roomNumber });
        res.status(200).json({ message: `Room ${roomNumber} deleted successfully` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
