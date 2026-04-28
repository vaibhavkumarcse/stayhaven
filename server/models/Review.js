const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      maxlength: 1000,
    },
    // Sub-ratings (optional, like Airbnb)
    cleanliness: { type: Number, min: 1, max: 5 },
    accuracy:    { type: Number, min: 1, max: 5 },
    location:    { type: Number, min: 1, max: 5 },
    value:       { type: Number, min: 1, max: 5 },

    // Host reply
    hostReply: { type: String, default: '' },
    hostRepliedAt: { type: Date },
  },
  { timestamps: true }
);

// One review per booking
reviewSchema.index({ booking: 1 }, { unique: true });

// After saving a review, update property avgRating
reviewSchema.post('save', async function () {
  const Property = require('./Property');
  const stats = await mongoose.model('Review').aggregate([
    { $match: { property: this.property } },
    { $group: { _id: '$property', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (stats.length > 0) {
    await Property.findByIdAndUpdate(this.property, {
      avgRating: Math.round(stats[0].avgRating * 10) / 10,
      totalReviews: stats[0].count,
    });
  }
});

module.exports = mongoose.model('Review', reviewSchema);
