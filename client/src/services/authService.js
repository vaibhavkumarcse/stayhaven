import api from './api';

// Auth
export const registerUser = (data) => api.post('/auth/register', data).then(r => r.data);
export const loginUser = (data) => api.post('/auth/login', data).then(r => r.data);
export const getMe = () => api.get('/auth/me').then(r => r.data);
export const updateProfile = (data) => api.put('/auth/profile', data).then(r => r.data);
export const changePassword = (data) => api.put('/auth/password', data).then(r => r.data);
export const becomeHost = () => api.put('/auth/become-host').then(r => r.data);

// Bookings
export const createBooking = (data) => api.post('/bookings', data).then(r => r.data);
export const getMyBookings = () => api.get('/bookings/my').then(r => r.data);
export const getHostBookings = () => api.get('/bookings/host').then(r => r.data);
export const getBookingById = (id) => api.get(`/bookings/${id}`).then(r => r.data);
export const cancelBooking = (id, reason) =>
  api.patch(`/bookings/${id}/cancel`, { reason }).then(r => r.data);
export const confirmBooking = (id) =>
  api.patch(`/bookings/${id}/confirm`).then(r => r.data);

// Reviews
export const createReview = (data) => api.post('/reviews', data).then(r => r.data);
export const getPropertyReviews = (propertyId, params) =>
  api.get(`/reviews/property/${propertyId}`, { params }).then(r => r.data);
export const replyToReview = (id, reply) =>
  api.patch(`/reviews/${id}/reply`, { reply }).then(r => r.data);

// Payments
export const createPaymentIntent = (bookingId) =>
  api.post('/payments/create-intent', { bookingId }).then(r => r.data);
export const confirmPayment = (data) =>
  api.post('/payments/confirm', data).then(r => r.data);

// User profile
export const getUserProfile = (id) => api.get(`/users/${id}`).then(r => r.data);
