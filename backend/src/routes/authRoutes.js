const express = require('express');
const { syncUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/sync', syncUser);
router.get('/me', protect, getMe);

module.exports = router;
