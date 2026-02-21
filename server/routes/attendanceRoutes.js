const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const auth = require('../middleware/authMiddleware');

router.post('/mark', auth, attendanceController.markAttendance);
router.get('/room', auth, attendanceController.getRoomAttendance);
router.get('/my-attendance', auth, attendanceController.getMyAttendance);

module.exports = router;
