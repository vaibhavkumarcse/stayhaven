const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    type: {
      type: String,
      enum: ['apartment', 'house', 'villa', 'hotel', 'hostel', 'cabin', 'cottage', 'studio'],
      required: [true, 'Property type is required'],
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Price per night is required'],
      min: [1, 'Price must be at least 1'],
    },
    maxGuests:  { type: Number, required: true, min: 1 },
    bedrooms:   { type: Number, default: 1, min: 0 },
    bathrooms:  { type: Number, default: 1, min: 0 },
    beds:       { type: Number, default: 1, min: 0 },

    location: {
      address: { type: String, required: true },
      city:    { type: String, required: true },
      state:   { type: String, default: '' },
      country: { type: String, required: true },
      zipCode: { type: String, default: '' },
      // GeoJSON point for $near queries
      coordinates: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
      },
    },

    images: [
      {
        url:     { type: String, required: true },
        publicId: { type: String }, // cloudinary public_id for deletion
        caption: { type: String, default: '' },
      },
    ],
    thumbnail: { type: String, default: '' },

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    amenities: [{ type: String }],

    // Availability
    isAvailable:  { type: Boolean, default: true },
    blockedDates: [{ type: Date }],
    minStay:      { type: Number, default: 1 },
    maxStay:      { type: Number, default: 90 },

    // Rules
    houseRules: { type: String, default: '' },
    smokingAllowed: { type: Boolean, default: false },
    petsAllowed:    { type: Boolean, default: false },
    eventsAllowed:  { type: Boolean, default: false },

    // Stats — denormalised for fast reads
    avgRating:     { type: Number, default: 0, min: 0, max: 5 },
    totalReviews:  { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 },
    isFeatured:    { type: Boolean, default: false },

    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  },
  { timestamps: true }
);

// Geo index for map-based search
propertySchema.index({ 'location.coordinates': '2dsphere' });

// Text index for keyword search
propertySchema.index({
  title: 'text',
  description: 'text',
  'location.city': 'text',
  'location.country': 'text',
});

module.exports = mongoose.model('Property', propertySchema);
