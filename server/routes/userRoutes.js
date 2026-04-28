const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Property = require('../models/Property');
const { protect, authorizeAdmin } = require('../middleware/authMiddleware');

// @desc Get public profile of any user (host)
router.get('/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password -googleId -wishlist');
  if (!user) { res.status(404); throw new Error('User not found'); }
  const listings = await Property.find({ host: user._id, isAvailable: true })
    .select('title thumbnail pricePerNight location avgRating totalReviews')
    .limit(12);
  res.json({ success: true, user, listings });
}));

// @desc Get all users (admin)
router.get('/', protect, authorizeAdmin, asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort('-createdAt');
  res.json({ success: true, users });
}));

// @desc Deactivate user (admin)
router.patch('/:id/deactivate', protect, authorizeAdmin, asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  res.json({ success: true, user });
}));

// @desc Update user role (e.g. upgrade to host)
// @route PATCH /api/users/:id/role
// @access Private
router.patch('/:id/role', protect, asyncHandler(async (req, res) => {
  const { role } = req.body;
  
  // Only allow user to update their own role or admin
  if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this user role');
  }

  if (!['guest', 'host'].includes(role)) {
    res.status(400);
    throw new Error('Invalid role');
  }

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
  res.json({ success: true, user });
}));

module.exports = router;
