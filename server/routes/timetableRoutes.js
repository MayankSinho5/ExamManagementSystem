const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');
const auth = require('../middleware/authMiddleware');

router.get('/', timetableController.getTimetable);
router.post('/', auth, timetableController.addTimetableItem);
router.delete('/:id', auth, timetableController.deleteTimetableItem);

module.exports = router;
