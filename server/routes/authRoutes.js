const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, changePassword, becomeHost } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.put('/become-host', protect, becomeHost);

module.exports = router;
