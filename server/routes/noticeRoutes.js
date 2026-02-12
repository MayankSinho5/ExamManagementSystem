const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, noticeController.createNotice);
router.get('/', noticeController.getAllNotices); // Publicly viewable
router.delete('/:id', auth, noticeController.deleteNotice);

module.exports = router;
