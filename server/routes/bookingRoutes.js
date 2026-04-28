const express = require('express');
const router = express.Router();
const {
  createBooking, getMyBookings, getHostBookings,
  getBookingById, cancelBooking, confirmBooking,
} = require('../controllers/bookingController');
const { protect, authorizeHost } = require('../middleware/authMiddleware');

router.post('/',          protect, createBooking);
router.get('/my',         protect, getMyBookings);
router.get('/host',       protect, authorizeHost, getHostBookings);
router.get('/:id',        protect, getBookingById);
router.patch('/:id/cancel',  protect, cancelBooking);
router.patch('/:id/confirm', protect, authorizeHost, confirmBooking);

module.exports = router;
