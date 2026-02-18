const express = require('express');
const router = express.Router();
const seatingController = require('../controllers/seatingController');
const auth = require('../middleware/authMiddleware');

router.get('/', seatingController.getSeatingPlans);
router.post('/update', auth, seatingController.updateSeatingPlan);
router.delete('/:roomNumber', auth, seatingController.deleteSeatingPlan);

module.exports = router;
