const express = require('express');
const router = express.Router();
const attemptController = require('../controllers/attemptController');
const auth = require('../middleware/authMiddleware');

router.post('/submit', auth, attemptController.submitAttempt);
router.get('/my-attempts', auth, attemptController.getStudentAttempts);

module.exports = router;
