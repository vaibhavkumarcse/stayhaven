const express = require('express');
const router = express.Router();
const { createReview, getPropertyReviews, replyToReview, deleteReview } = require('../controllers/reviewController');
const { protect, authorizeAdmin } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/property/:propertyId', getPropertyReviews);
router.patch('/:id/reply', protect, replyToReview);
router.delete('/:id', protect, authorizeAdmin, deleteReview);

module.exports = router;
