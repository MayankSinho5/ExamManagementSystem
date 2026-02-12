const Seating = require('../models/Seating');

// Get seating plan (Latest)
exports.getSeatingPlan = async (req, res) => {
    try {
        const seating = await Seating.findOne().sort({ updatedAt: -1 });
        res.status(200).json(seating);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update or Create Seating Plan
exports.updateSeatingPlan = async (req, res) => {
    try {
        const { plan } = req.body;
        // We find the first one and update it, or create if none exists
        let seating = await Seating.findOne();

        if (seating) {
            seating.plan = plan;
            seating.updatedBy = req.user.id;
            await seating.save();
        } else {
            seating = await Seating.create({
                plan,
                updatedBy: req.user.id
            });
        }

        res.status(200).json(seating);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
