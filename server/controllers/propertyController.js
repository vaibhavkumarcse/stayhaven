const asyncHandler = require('express-async-handler');
const Property = require('../models/Property');
const User = require('../models/User');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/uploadToCloudinary');

// @desc   Get all properties with filters
// @route  GET /api/properties
// @access Public
const getAllProperties = asyncHandler(async (req, res) => {
  const {
    city, country, type, minPrice, maxPrice,
    guests, bedrooms, amenities, page = 1, limit = 12,
    sort = '-createdAt', featured,
  } = req.query;

  const query = { isAvailable: true };

  if (city)    query['location.city']    = { $regex: city, $options: 'i' };
  if (country) query['location.country'] = { $regex: country, $options: 'i' };
  if (type)    query.type = type;
  if (guests)  query.maxGuests = { $gte: Number(guests) };
  if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
  if (featured) query.isFeatured = true;

  if (minPrice || maxPrice) {
    query.pricePerNight = {};
    if (minPrice) query.pricePerNight.$gte = Number(minPrice);
    if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
  }

  if (amenities) {
    const amenityList = amenities.split(',').map(a => a.trim());
    query.amenities = { $all: amenityList };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Property.countDocuments(query);

  const properties = await Property.find(query)
    .populate('host', 'name avatar isVerifiedHost')
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  res.json({
    success: true,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    properties,
  });
});

// @desc   Search properties (text + geo)
// @route  GET /api/properties/search
// @access Public
const searchProperties = asyncHandler(async (req, res) => {
  const { q, lat, lng, radius = 50, page = 1, limit = 12 } = req.query;

  let query = { isAvailable: true };

  // Text search
  if (q) {
    query.$text = { $search: q };
  }

  // Geo search (radius in km)
  if (lat && lng) {
    query['location.coordinates'] = {
      $near: {
        $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
        $maxDistance: Number(radius) * 1000,
      },
    };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Property.countDocuments(query);

  const properties = await Property.find(query)
    .populate('host', 'name avatar isVerifiedHost')
    .skip(skip)
    .limit(Number(limit));

  res.json({ success: true, total, properties });
});

// @desc   Get single property
// @route  GET /api/properties/:id
// @access Public
const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id)
    .populate('host', 'name avatar bio isVerifiedHost createdAt')
    .populate({
      path: 'reviews',
      populate: { path: 'guest', select: 'name avatar' },
      options: { sort: { createdAt: -1 }, limit: 10 },
    });

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  res.json({ success: true, property });
});

// @desc   Create property
// @route  POST /api/properties
// @access Private (host only)
const createProperty = asyncHandler(async (req, res) => {
  const {
    title, description, type, pricePerNight, maxGuests,
    bedrooms, bathrooms, beds, address, city, state,
    country, zipCode, lat, lng, amenities, houseRules,
    smokingAllowed, petsAllowed, eventsAllowed, minStay, maxStay,
  } = req.body;

  // Upload images to Cloudinary
  let images = [];
  if (req.files && req.files.length > 0) {
    const uploads = await Promise.all(
      req.files.map(file => uploadToCloudinary(file.buffer, 'stayhaven/properties'))
    );
    images = uploads.map(r => ({ url: r.secure_url, publicId: r.public_id }));
  }

  const property = await Property.create({
    title, description, type,
    pricePerNight: Number(pricePerNight),
    maxGuests: Number(maxGuests),
    bedrooms: Number(bedrooms) || 1,
    bathrooms: Number(bathrooms) || 1,
    beds: Number(beds) || 1,
    location: {
      address, city, state, country, zipCode,
      coordinates: {
        type: 'Point',
        coordinates: [parseFloat(lng) || 0, parseFloat(lat) || 0],
      },
    },
    images,
    thumbnail: images[0]?.url || '',
    host: req.user._id,
    amenities: amenities ? JSON.parse(amenities) : [],
    houseRules,
    smokingAllowed: smokingAllowed === 'true',
    petsAllowed: petsAllowed === 'true',
    eventsAllowed: eventsAllowed === 'true',
    minStay: Number(minStay) || 1,
    maxStay: Number(maxStay) || 90,
  });

  // Increment host's listing count
  await User.findByIdAndUpdate(req.user._id, { $inc: { totalListings: 1 } });

  res.status(201).json({ success: true, property });
});

// @desc   Update property
// @route  PUT /api/properties/:id
// @access Private (owner only)
const updateProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }
  if (property.host.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this property');
  }

  // Handle new image uploads
  if (req.files && req.files.length > 0) {
    const uploads = await Promise.all(
      req.files.map(file => uploadToCloudinary(file.buffer, 'stayhaven/properties'))
    );
    const newImages = uploads.map(r => ({ url: r.secure_url, publicId: r.public_id }));
    req.body.images = [...(property.images || []), ...newImages];
    req.body.thumbnail = req.body.images[0]?.url;
  }

  if (req.body.amenities && typeof req.body.amenities === 'string') {
    req.body.amenities = JSON.parse(req.body.amenities);
  }

  const updated = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, property: updated });
});

// @desc   Delete property
// @route  DELETE /api/properties/:id
// @access Private (owner only)
const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }
  if (property.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this property');
  }

  // Delete images from Cloudinary
  await Promise.all(
    property.images
      .filter(img => img.publicId)
      .map(img => deleteFromCloudinary(img.publicId))
  );

  await property.deleteOne();
  await User.findByIdAndUpdate(req.user._id, { $inc: { totalListings: -1 } });

  res.json({ success: true, message: 'Property deleted successfully' });
});

// @desc   Get host's own listings
// @route  GET /api/properties/my-listings
// @access Private (host)
const getMyListings = asyncHandler(async (req, res) => {
  const properties = await Property.find({ host: req.user._id }).sort('-createdAt');
  res.json({ success: true, properties });
});

// @desc   Toggle availability
// @route  PATCH /api/properties/:id/availability
// @access Private (host)
const toggleAvailability = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }
  if (property.host.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }
  property.isAvailable = !property.isAvailable;
  await property.save();
  res.json({ success: true, isAvailable: property.isAvailable });
});

// @desc   Toggle wishlist
// @route  POST /api/properties/:id/wishlist
// @access Private
const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const propertyId = req.params.id;
  const idx = user.wishlist.indexOf(propertyId);
  if (idx === -1) {
    user.wishlist.push(propertyId);
  } else {
    user.wishlist.splice(idx, 1);
  }
  await user.save();
  res.json({ success: true, wishlist: user.wishlist });
});

module.exports = {
  getAllProperties, searchProperties, getPropertyById,
  createProperty, updateProperty, deleteProperty,
  getMyListings, toggleAvailability, toggleWishlist,
};
