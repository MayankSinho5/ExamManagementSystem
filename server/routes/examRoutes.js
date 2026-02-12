const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, examController.createExam);
router.get('/', auth, examController.getAllExams);
router.get('/:id', auth, examController.getExamById);
router.delete('/:id', auth, examController.deleteExam);

module.exports = router;
