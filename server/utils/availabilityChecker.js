const Booking = require('../models/Booking');

/**
 * Check if a property is available for the requested dates.
 * Returns true if available, false if there's a conflict.
 */
const checkAvailability = async (propertyId, checkIn, checkOut, excludeBookingId = null) => {
  const query = {
    property: propertyId,
    status: { $in: ['pending', 'confirmed'] },
    $or: [
      { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } }, // overlapping range
    ],
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflict = await Booking.findOne(query);
  return !conflict; // true = available
};

/**
 * Calculate number of nights between two dates
 */
const calculateNights = (checkIn, checkOut) => {
  const diff = new Date(checkOut) - new Date(checkIn);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

/**
 * Calculate total booking price
 */
const calculatePrice = (pricePerNight, nights) => {
  const subtotal = pricePerNight * nights;
  const cleaningFee = Math.round(pricePerNight * 0.1); // 10% cleaning fee
  const serviceFee = Math.round(subtotal * 0.12);       // 12% service fee
  const totalPrice = subtotal + cleaningFee + serviceFee;
  return { subtotal, cleaningFee, serviceFee, totalPrice };
};

module.exports = { checkAvailability, calculateNights, calculatePrice };
