const express = require('express');
const router = express.Router();
const seatingController = require('../controllers/seatingController');
const auth = require('../middleware/authMiddleware');

router.get('/', seatingController.getSeatingPlan);
router.post('/update', auth, seatingController.updateSeatingPlan);

module.exports = router;
