const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');

// @desc   Create Stripe payment intent
// @route  POST /api/payments/create-intent
// @access Private
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId).populate('property', 'title');
  if (!booking) {
    console.error('Payment failed: Booking not found', { bookingId });
    res.status(404);
    throw new Error('Booking not found');
  }
  if (booking.guest.toString() !== req.user._id.toString()) {
    console.error('Payment failed: Not authorized', { bookingGuestId: booking.guest, userId: req.user._id });
    res.status(403);
    throw new Error('Not authorized');
  }

  console.log('Creating Stripe Payment Intent', { 
    amount: Math.round(booking.totalPrice * 100), 
    currency: 'inr' 
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(booking.totalPrice * 100), // Stripe uses cents/paise
    currency: 'inr',
    payment_method_types: ['card', 'upi'],
    metadata: {
      bookingId: booking._id.toString(),
      propertyTitle: booking.property.title,
      guestId: req.user._id.toString(),
    },
  });

  // Save paymentIntentId to booking
  await Booking.findByIdAndUpdate(bookingId, { paymentIntentId: paymentIntent.id });

  res.json({ success: true, clientSecret: paymentIntent.client_secret });
});

// @desc   Confirm payment (called after Stripe confirms on frontend)
// @route  POST /api/payments/confirm
// @access Private
const confirmPayment = asyncHandler(async (req, res) => {
  const { bookingId, paymentIntentId } = req.body;

  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (intent.status !== 'succeeded') {
    res.status(400);
    throw new Error('Payment not completed');
  }

  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    { status: 'confirmed', paymentStatus: 'paid' },
    { new: true }
  ).populate('property', 'title thumbnail location');

  res.json({ success: true, booking });
});

// @desc   Stripe webhook handler
// @route  POST /api/payments/webhook
// @access Public (verified by Stripe signature)
const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    res.status(400);
    throw new Error(`Webhook signature verification failed: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object;
    await Booking.findOneAndUpdate(
      { paymentIntentId: intent.id },
      { status: 'confirmed', paymentStatus: 'paid' }
    );
  }

  res.json({ received: true });
});

module.exports = { createPaymentIntent, confirmPayment, stripeWebhook };
