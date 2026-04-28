const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // never returned in queries by default
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['guest', 'host', 'admin'],
      default: 'guest',
    },
    phone: { type: String, default: '' },
    bio: { type: String, default: '', maxlength: 500 },
    location: { type: String, default: '' },

    // Google OAuth
    googleId: { type: String },
    isGoogleUser: { type: Boolean, default: false },

    // Host info
    isVerifiedHost: { type: Boolean, default: false },
    totalListings: { type: Number, default: 0 },

    // Wishlist
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],

    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
