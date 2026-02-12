const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const auth = require('../middleware/authMiddleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', auth, authController.getMe);
router.get('/students', auth, authController.getAllStudents);
router.delete('/students/:id', auth, authController.deleteStudent);
router.put('/update', auth, authController.updateMe);

module.exports = router;
