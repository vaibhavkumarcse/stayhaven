const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Property = require('../models/Property');

// @desc   Create review
// @route  POST /api/reviews
// @access Private
const createReview = asyncHandler(async (req, res) => {
  const { bookingId, rating, comment, cleanliness, accuracy, location, value } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (booking.guest.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the guest can leave a review');
  }
  if (booking.status !== 'completed') {
    res.status(400);
    throw new Error('Can only review completed bookings');
  }
  if (booking.hasReview) {
    res.status(400);
    throw new Error('You have already reviewed this booking');
  }

  const review = await Review.create({
    property: booking.property,
    guest: req.user._id,
    booking: bookingId,
    rating,
    comment,
    cleanliness,
    accuracy,
    location,
    value,
  });

  // Mark booking as reviewed & push review ref to property
  await Booking.findByIdAndUpdate(bookingId, { hasReview: true });
  await Property.findByIdAndUpdate(booking.property, { $push: { reviews: review._id } });

  const populated = await review.populate('guest', 'name avatar');
  res.status(201).json({ success: true, review: populated });
});

// @desc   Get reviews for a property
// @route  GET /api/reviews/property/:propertyId
// @access Public
const getPropertyReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const total = await Review.countDocuments({ property: req.params.propertyId });
  const reviews = await Review.find({ property: req.params.propertyId })
    .populate('guest', 'name avatar')
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit));

  res.json({ success: true, total, reviews });
});

// @desc   Add host reply to review
// @route  PATCH /api/reviews/:id/reply
// @access Private (host)
const replyToReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id).populate('property');
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  if (review.property.host.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the host can reply to reviews');
  }

  review.hostReply = req.body.reply;
  review.hostRepliedAt = new Date();
  await review.save();

  res.json({ success: true, review });
});

// @desc   Delete review (admin only)
// @route  DELETE /api/reviews/:id
// @access Private (admin)
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  await Property.findByIdAndUpdate(review.property, { $pull: { reviews: review._id } });
  await review.deleteOne();
  res.json({ success: true, message: 'Review deleted' });
});

module.exports = { createReview, getPropertyReviews, replyToReview, deleteReview };
