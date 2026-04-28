const express = require('express');
const router = express.Router();
const {
  getAllProperties, searchProperties, getPropertyById,
  createProperty, updateProperty, deleteProperty,
  getMyListings, toggleAvailability, toggleWishlist,
} = require('../controllers/propertyController');
const { protect, authorizeHost } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public
router.get('/',        getAllProperties);
router.get('/search',  searchProperties);

// Protected (must come before /:id to avoid route conflict)
router.get('/my-listings', protect, authorizeHost, getMyListings);

// Public single
router.get('/:id', getPropertyById);

// Host only
router.post('/', protect, authorizeHost, upload.array('images', 10), createProperty);
router.put('/:id', protect, authorizeHost, upload.array('images', 10), updateProperty);
router.delete('/:id', protect, authorizeHost, deleteProperty);
router.patch('/:id/availability', protect, authorizeHost, toggleAvailability);

// Any logged-in user
router.post('/:id/wishlist', protect, toggleWishlist);

module.exports = router;
