const mongoose = require('mongoose');

const seatingSchema = new mongoose.Schema({
    // We store the entire plan as a mixed object for flexibility, 
    // since the UI manages a complex grid/mapping.
    plan: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Seating', seatingSchema);
