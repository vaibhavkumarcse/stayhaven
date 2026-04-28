const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
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
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    checkIn:  { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests:   { type: Number, required: true, min: 1 },
    nights:   { type: Number, required: true },

    // Pricing breakdown
    pricePerNight:  { type: Number, required: true },
    subtotal:       { type: Number, required: true }, // nights * pricePerNight
    cleaningFee:    { type: Number, default: 0 },
    serviceFee:     { type: Number, default: 0 },
    totalPrice:     { type: Number, required: true },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'refunded'],
      default: 'pending',
    },

    // Stripe
    paymentIntentId: { type: String },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
    },

    specialRequests: { type: String, default: '' },
    cancellationReason: { type: String, default: '' },
    cancelledAt: { type: Date },
    cancelledBy: { type: String, enum: ['guest', 'host', 'admin'] },

    hasReview: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Virtual: duration in nights
bookingSchema.virtual('duration').get(function () {
  return Math.round((this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('Booking', bookingSchema);
