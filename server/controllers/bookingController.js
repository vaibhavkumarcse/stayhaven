const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const { checkAvailability, calculateNights, calculatePrice } = require('../utils/availabilityChecker');
const { sendEmail, bookingConfirmationEmail } = require('../utils/sendEmail');

// @desc   Create booking
// @route  POST /api/bookings
// @access Private
const createBooking = asyncHandler(async (req, res) => {
  const { propertyId, checkIn, checkOut, guests, specialRequests } = req.body;

  const property = await Property.findById(propertyId).populate('host');
  if (!property) {
    console.error('Booking failed: Property not found', { propertyId });
    res.status(404);
    throw new Error('Property not found');
  }
  if (!property.isAvailable) {
    console.error('Booking failed: Property not available', { propertyId });
    res.status(400);
    throw new Error('Property is not available for booking');
  }
  if (property.host._id.toString() === req.user._id.toString()) {
    console.error('Booking failed: User booking own property', { userId: req.user._id, hostId: property.host._id });
    res.status(400);
    throw new Error('You cannot book your own property');
  }

  // Check date availability
  const isAvailable = await checkAvailability(propertyId, checkIn, checkOut);
  if (!isAvailable) {
    console.error('Booking failed: Date conflict', { propertyId, checkIn, checkOut });
    res.status(400);
    throw new Error('Property is not available for the selected dates');
  }

  const nights = calculateNights(checkIn, checkOut);
  if (nights < property.minStay) {
    console.error('Booking failed: Min stay not met', { nights, minStay: property.minStay });
    res.status(400);
    throw new Error(`Minimum stay is ${property.minStay} night(s)`);
  }
  if (nights > property.maxStay) {
    res.status(400);
    throw new Error(`Maximum stay is ${property.maxStay} night(s)`);
  }

  const { subtotal, cleaningFee, serviceFee, totalPrice } = calculatePrice(
    property.pricePerNight,
    nights
  );

  const booking = await Booking.create({
    property: propertyId,
    guest: req.user._id,
    host: property.host._id,
    checkIn,
    checkOut,
    guests,
    nights,
    pricePerNight: property.pricePerNight,
    subtotal,
    cleaningFee,
    serviceFee,
    totalPrice,
    specialRequests,
    status: 'pending',
  });

  // Increment property booking count
  await Property.findByIdAndUpdate(propertyId, { $inc: { totalBookings: 1 } });

  const populatedBooking = await booking.populate([
    { path: 'property', select: 'title thumbnail location' },
    { path: 'guest', select: 'name email' },
  ]);

  // Send confirmation email (non-blocking)
  try {
    await sendEmail(bookingConfirmationEmail(booking, property, req.user));
  } catch (e) {
    console.error('Email send failed:', e.message);
  }

  res.status(201).json({ success: true, booking: populatedBooking });
});

// @desc   Get my bookings (as guest)
// @route  GET /api/bookings/my
// @access Private
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ guest: req.user._id })
    .populate('property', 'title thumbnail location pricePerNight')
    .populate('host', 'name avatar')
    .sort('-createdAt');
  res.json({ success: true, bookings });
});

// @desc   Get bookings for host's properties
// @route  GET /api/bookings/host
// @access Private (host)
const getHostBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ host: req.user._id })
    .populate('property', 'title thumbnail location')
    .populate('guest', 'name avatar email')
    .sort('-createdAt');
  res.json({ success: true, bookings });
});

// @desc   Get single booking
// @route  GET /api/bookings/:id
// @access Private
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('property', 'title thumbnail location pricePerNight host')
    .populate('guest', 'name email avatar phone')
    .populate('host', 'name email avatar phone');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  const isOwner =
    booking.guest._id.toString() === req.user._id.toString() ||
    booking.host._id.toString() === req.user._id.toString() ||
    req.user.role === 'admin';

  if (!isOwner) {
    res.status(403);
    throw new Error('Not authorized to view this booking');
  }

  res.json({ success: true, booking });
});

// @desc   Cancel booking
// @route  PATCH /api/bookings/:id/cancel
// @access Private
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (!['pending', 'confirmed'].includes(booking.status)) {
    res.status(400);
    throw new Error('Booking cannot be cancelled');
  }

  const isGuest = booking.guest.toString() === req.user._id.toString();
  const isHost = booking.host.toString() === req.user._id.toString();

  if (!isGuest && !isHost && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to cancel this booking');
  }

  booking.status = 'cancelled';
  booking.cancelledAt = new Date();
  booking.cancelledBy = isGuest ? 'guest' : 'host';
  booking.cancellationReason = req.body.reason || '';
  await booking.save();

  res.json({ success: true, booking });
});

// @desc   Confirm booking (host action)
// @route  PATCH /api/bookings/:id/confirm
// @access Private (host)
const confirmBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (booking.host.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  booking.status = 'confirmed';
  await booking.save();

  res.json({ success: true, booking });
});

module.exports = {
  createBooking, getMyBookings, getHostBookings,
  getBookingById, cancelBooking, confirmBooking,
};
