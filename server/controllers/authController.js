const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc   Register new user
// @route  POST /api/auth/register
// @access Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Email already registered');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role === 'host' ? 'host' : 'guest',
  });

  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
});

// @desc   Login user
// @route  POST /api/auth/login
// @access Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  res.json({
    success: true,
    token: generateToken(user._id),
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
});

// @desc   Get current user profile
// @route  GET /api/auth/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'title thumbnail pricePerNight location');
  res.json({ success: true, user });
});

// @desc   Update profile
// @route  PUT /api/auth/profile
// @access Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, bio, location } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, bio, location },
    { new: true, runValidators: true }
  );
  res.json({ success: true, user });
});

// @desc   Change password
// @route  PUT /api/auth/password
// @access Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.matchPassword(currentPassword))) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }
  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password updated successfully' });
});

// @desc   Become a host
// @route  PUT /api/auth/become-host
// @access Private
const becomeHost = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { role: 'host' },
    { new: true }
  );
  res.json({ success: true, message: 'You are now a host!', user });
});

module.exports = { register, login, getMe, updateProfile, changePassword, becomeHost };
