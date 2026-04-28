/**
 * StayHaven Database Seeder
 * Run: node seed.js
 * Clear: node seed.js --clear
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// ─── Models (inline to keep seeder self-contained) ────────────────────────────

const userSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true }, password: { type: String, select: false },
  avatar: String, role: { type: String, default: 'guest' }, phone: String, bio: String,
  location: String, isVerifiedHost: { type: Boolean, default: false },
  totalListings: { type: Number, default: 0 }, wishlist: [mongoose.Schema.Types.ObjectId],
  isActive: { type: Boolean, default: true }, lastLogin: Date,
  googleId: String, isGoogleUser: Boolean,
}, { timestamps: true });
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

const propertySchema = new mongoose.Schema({
  title: String, description: String, type: String, pricePerNight: Number,
  maxGuests: Number, bedrooms: Number, bathrooms: Number, beds: Number,
  location: {
    address: String, city: String, state: String, country: String, zipCode: String,
    coordinates: { type: { type: String, default: 'Point' }, coordinates: [Number] },
  },
  images: [{ url: String, publicId: String, caption: String }],
  thumbnail: String, host: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amenities: [String], isAvailable: { type: Boolean, default: true },
  blockedDates: [Date], minStay: { type: Number, default: 1 }, maxStay: { type: Number, default: 90 },
  houseRules: String, smokingAllowed: Boolean, petsAllowed: Boolean, eventsAllowed: Boolean,
  avgRating: { type: Number, default: 0 }, totalReviews: { type: Number, default: 0 },
  totalBookings: { type: Number, default: 0 }, isFeatured: { type: Boolean, default: false },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
}, { timestamps: true });
propertySchema.index({ 'location.coordinates': '2dsphere' });
const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);

const bookingSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  guest: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  checkIn: Date, checkOut: Date, guests: Number, nights: Number,
  pricePerNight: Number, subtotal: Number, cleaningFee: Number, serviceFee: Number, totalPrice: Number,
  status: { type: String, default: 'confirmed' },
  paymentIntentId: String, paymentStatus: { type: String, default: 'paid' },
  specialRequests: String, hasReview: { type: Boolean, default: false },
}, { timestamps: true });
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

const reviewSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  guest: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  rating: Number, comment: String,
  cleanliness: Number, accuracy: Number, location: Number, value: Number,
  hostReply: String, hostRepliedAt: Date,
}, { timestamps: true });
const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

// ─── Seed data ─────────────────────────────────────────────────────────────────

const HOSTS = [
  {
    name: 'Priya Sharma',
    email: 'priya@stayhaven.com',
    password: 'password123',
    role: 'host',
    isVerifiedHost: true,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    bio: 'Passionate traveller and superhost with 5+ years of experience. Love creating memorable stays!',
    location: 'Bali, Indonesia',
    phone: '+62 812 3456 7890',
  },
  {
    name: 'Marcus Chen',
    email: 'marcus@stayhaven.com',
    password: 'password123',
    role: 'host',
    isVerifiedHost: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    bio: 'Architecture enthusiast who designs and manages unique properties across Asia and Europe.',
    location: 'Tokyo, Japan',
    phone: '+81 90 1234 5678',
  },
  {
    name: 'Sofia Rossi',
    email: 'sofia@stayhaven.com',
    password: 'password123',
    role: 'host',
    isVerifiedHost: true,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    bio: 'Tuscany native sharing the beauty of Italian countryside with guests from around the world.',
    location: 'Florence, Italy',
    phone: '+39 055 123 4567',
  },
  {
    name: 'James Okafor',
    email: 'james@stayhaven.com',
    password: 'password123',
    role: 'host',
    isVerifiedHost: false,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    bio: 'New York local offering cozy spots in the heart of Manhattan. Expert on hidden city gems.',
    location: 'New York, USA',
    phone: '+1 212 555 0100',
  },
];

const GUESTS = [
  {
    name: 'Aarav Patel',
    email: 'aarav@example.com',
    password: 'password123',
    role: 'guest',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150',
    location: 'Mumbai, India',
  },
  {
    name: 'Emma Wilson',
    email: 'emma@example.com',
    password: 'password123',
    role: 'guest',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    location: 'London, UK',
  },
  {
    name: 'Raj Kumar',
    email: 'raj@example.com',
    password: 'password123',
    role: 'guest',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    location: 'Delhi, India',
  },
];

// Admin (can log in as admin@stayhaven.com / admin123)
const ADMIN = {
  name: 'Admin',
  email: 'admin@stayhaven.com',
  password: 'admin123',
  role: 'admin',
  isVerifiedHost: true,
};

const PROPERTIES = [
  // ── BALI ──
  {
    title: 'Infinity Pool Villa with Rice Terrace View',
    description: `Perched above Ubud's famous rice terraces, this stunning villa offers an unmatched sense of peace and luxury. Wake up to misty green valleys, swim in the private infinity pool that seems to merge with the horizon, and fall asleep to the sound of cicadas.\n\nThe villa features open-air living spaces, a traditional joglo roof, and hand-crafted Balinese furnishings throughout. Our dedicated staff includes a private chef available for breakfast and dinner.\n\nPerfect for couples seeking romance or small families wanting an authentic cultural experience.`,
    type: 'villa',
    pricePerNight: 320,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    beds: 3,
    location: { address: 'Jalan Raya Ubud', city: 'Ubud', country: 'Indonesia', state: 'Bali', coordinates: { type: 'Point', coordinates: [115.2624, -8.5069] } },
    images: [
      { url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', caption: 'Infinity pool at sunset' },
      { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', caption: 'Rice terrace view' },
      { url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800', caption: 'Master bedroom' },
      { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', caption: 'Open-air dining' },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600',
    amenities: ['wifi', 'pool', 'kitchen', 'ac', 'workspace'],
    isFeatured: true,
    avgRating: 4.9,
    totalReviews: 3,
    totalBookings: 5,
    smokingAllowed: false,
    petsAllowed: false,
    eventsAllowed: false,
    minStay: 2,
    houseRules: 'Quiet hours after 10pm. No shoes inside the villa.',
    hostIdx: 0,
  },
  {
    title: 'Beachfront Bungalow — Steps from Seminyak Beach',
    description: `Fall asleep to the sound of waves in this charming beachfront bungalow. Just 30 seconds walk from one of Bali's most beautiful beaches, the location doesn't get better than this.\n\nThe bungalow is fully equipped with a modern kitchen, outdoor shower, and a private garden with hammocks. Bicycles are provided for exploring the local area, and we have a partnership with a nearby surf school for lessons at a discounted rate.\n\nIdeal for surfers, beach lovers, and anyone wanting the true Bali experience.`,
    type: 'cabin',
    pricePerNight: 145,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    beds: 1,
    location: { address: 'Jalan Kayu Aya', city: 'Seminyak', country: 'Indonesia', state: 'Bali', coordinates: { type: 'Point', coordinates: [115.1697, -8.6882] } },
    images: [
      { url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800', caption: 'Beachfront view' },
      { url: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800', caption: 'Bungalow exterior' },
      { url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800', caption: 'Cozy interior' },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600',
    amenities: ['wifi', 'kitchen', 'ac', 'balcony'],
    isFeatured: false,
    avgRating: 4.7,
    totalReviews: 2,
    totalBookings: 8,
    petsAllowed: false,
    minStay: 3,
    hostIdx: 0,
  },

  // ── TOKYO ──
  {
    title: 'Minimalist Zen Apartment in Shibuya',
    description: `Experience Tokyo living at its finest in this beautifully designed apartment inspired by Japanese minimalist aesthetics. Located in the heart of Shibuya, you are a 5-minute walk from the famous crossing, dozens of restaurants, and the subway system.\n\nThe apartment features floor-to-ceiling windows, a Japanese soaking tub (ofuro), a high-tech kitchen, and a workspace with dual monitors for remote workers.\n\nEverything is thought of — from the curated library of Japanese art books to the Nespresso machine with premium capsules.`,
    type: 'apartment',
    pricePerNight: 190,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    beds: 1,
    location: { address: '2-12-1 Dogenzaka', city: 'Shibuya', country: 'Japan', state: 'Tokyo', coordinates: { type: 'Point', coordinates: [139.6917, 35.6586] } },
    images: [
      { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', caption: 'Living area' },
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', caption: 'Bedroom' },
      { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', caption: 'Modern kitchen' },
      { url: 'https://images.unsplash.com/photo-1560448075-bb485b067938?w=800', caption: 'City view' },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600',
    amenities: ['wifi', 'kitchen', 'ac', 'heating', 'workspace', 'washer'],
    isFeatured: true,
    avgRating: 4.8,
    totalReviews: 2,
    totalBookings: 12,
    smokingAllowed: false,
    petsAllowed: false,
    minStay: 2,
    houseRules: 'Please remove shoes at the entrance. Quiet hours 10pm – 8am.',
    hostIdx: 1,
  },
  {
    title: 'Traditional Machiya Townhouse — Kyoto Old Town',
    description: `Stay in a lovingly restored 100-year-old machiya (wooden townhouse) in the heart of Kyoto's historic Gion district. This authentic experience puts you steps away from geisha districts, ancient temples, and the city's finest kaiseki restaurants.\n\nThe machiya retains original wooden beams, sliding shoji screens, and a serene inner garden (tsuboniwa), while providing all modern comforts including fast WiFi, underfloor heating, and a fully equipped kitchen.\n\nA rare chance to live like a Kyoto local in a piece of living history.`,
    type: 'house',
    pricePerNight: 275,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    beds: 2,
    location: { address: 'Gion, Higashiyama-ku', city: 'Kyoto', country: 'Japan', state: 'Kyoto', coordinates: { type: 'Point', coordinates: [135.7751, 35.0038] } },
    images: [
      { url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800', caption: 'Machiya entrance' },
      { url: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800', caption: 'Inner garden' },
      { url: 'https://images.unsplash.com/photo-1574691250077-03a929faece5?w=800', caption: 'Traditional room' },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600',
    amenities: ['wifi', 'kitchen', 'heating', 'garden', 'workspace'],
    isFeatured: true,
    avgRating: 5.0,
    totalReviews: 2,
    totalBookings: 7,
    smokingAllowed: false,
    petsAllowed: false,
    minStay: 2,
    houseRules: 'Please be respectful of neighbors. Shoes off at the entrance.',
    hostIdx: 1,
  },

  // ── ITALY ──
  {
    title: 'Tuscan Farmhouse with Vineyard Views',
    description: `Escape to the rolling hills of Tuscany in this gorgeous restored farmhouse (agriturismo) surrounded by vineyards and olive groves. The views from the stone terrace are simply breathtaking — especially at golden hour with a glass of local Chianti.\n\nThe house sleeps up to 8 guests across 4 bedrooms, making it perfect for family reunions, friend groups, or destination celebrations. The outdoor stone pool is heated May through October.\n\nYour host Sofia can arrange wine tastings at the estate winery, truffle hunting with a local guide, and private cooking classes with a Florentine chef.`,
    type: 'villa',
    pricePerNight: 480,
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    beds: 5,
    location: { address: 'Via del Chianti 45', city: 'Greve in Chianti', country: 'Italy', state: 'Tuscany', coordinates: { type: 'Point', coordinates: [11.3105, 43.5837] } },
    images: [
      { url: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800', caption: 'Vineyard view' },
      { url: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', caption: 'Stone terrace' },
      { url: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800', caption: 'Pool area' },
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', caption: 'Master bedroom' },
      { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', caption: 'Living room' },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=600',
    amenities: ['wifi', 'pool', 'kitchen', 'parking', 'bbq', 'garden', 'washer'],
    isFeatured: true,
    avgRating: 4.9,
    totalReviews: 2,
    totalBookings: 4,
    smokingAllowed: false,
    petsAllowed: true,
    eventsAllowed: true,
    minStay: 3,
    houseRules: 'Pets welcome with prior notice. No smoking indoors. Pool closes at midnight.',
    hostIdx: 2,
  },
  {
    title: 'Amalfi Coast Cliffside Studio',
    description: `Perched dramatically on the cliffs of the Amalfi Coast, this intimate studio apartment offers postcard-perfect views of the Mediterranean Sea and the colourful villages below. The private terrace is your own slice of Italian paradise.\n\nThe studio is compact but perfectly designed — a king bed faces the sea view, the kitchenette is stocked with local produce on arrival, and the bathroom features hand-painted ceramic tiles from Vietri.\n\nA short walk down the cliff path brings you to a private rocky beach. Lemon groves surround the property.`,
    type: 'studio',
    pricePerNight: 210,
    maxGuests: 2,
    bedrooms: 0,
    bathrooms: 1,
    beds: 1,
    location: { address: 'Via Pasitea 120', city: 'Positano', country: 'Italy', state: 'Campania', coordinates: { type: 'Point', coordinates: [14.4843, 40.6281] } },
    images: [
      { url: 'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=800', caption: 'Amalfi Coast view' },
      { url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', caption: 'Terrace' },
      { url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800', caption: 'Interior' },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=600',
    amenities: ['wifi', 'ac', 'kitchen', 'balcony'],
    isFeatured: false,
    avgRating: 4.8,
    totalReviews: 1,
    totalBookings: 6,
    smokingAllowed: false,
    petsAllowed: false,
    minStay: 2,
    hostIdx: 2,
  },

  // ── NEW YORK ──
  {
    title: 'Luxury Loft in SoHo — Manhattan',
    description: `Live like a New Yorker in this spectacular 1,500 sq ft loft in the heart of SoHo. Original cast-iron columns, exposed brick walls, and 12-foot ceilings give the space a dramatic industrial-chic character, while the carefully curated furniture and art make it feel like a design magazine shoot.\n\nThe building has a rooftop terrace with panoramic Manhattan views, a gym, and a doorman. The neighbourhood is surrounded by world-class galleries, restaurants, and boutiques.\n\nIdeal for creative professionals, fashion industry visitors, and anyone wanting the ultimate NYC experience.`,
    type: 'apartment',
    pricePerNight: 395,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    beds: 2,
    location: { address: '110 Greene Street', city: 'New York', country: 'United States', state: 'New York', coordinates: { type: 'Point', coordinates: [-74.0002, 40.7243] } },
    images: [
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', caption: 'Loft living area' },
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', caption: 'Bedroom' },
      { url: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e8c?w=800', caption: 'Kitchen' },
      { url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800', caption: 'Rooftop view' },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600',
    amenities: ['wifi', 'gym', 'ac', 'heating', 'workspace', 'washer', 'tv'],
    isFeatured: true,
    avgRating: 4.7,
    totalReviews: 2,
    totalBookings: 9,
    smokingAllowed: false,
    petsAllowed: false,
    minStay: 2,
    houseRules: 'No parties. Quiet hours after 11pm.',
    hostIdx: 3,
  },
  {
    title: 'Cozy Brooklyn Brownstone — Park Slope',
    description: `This warm and welcoming brownstone apartment sits in one of Brooklyn's most beloved neighbourhoods. Park Slope is known for its tree-lined streets, independent cafes, Prospect Park (just 2 blocks away), and its vibrant local community.\n\nThe apartment spans the entire garden floor and has its own private backyard — a rarity in New York City. The interior blends exposed brick, hardwood floors, and colourful artwork for a home-away-from-home feel.\n\nGrocery stores, restaurants, the F/G train are all within a 3-minute walk.`,
    type: 'apartment',
    pricePerNight: 175,
    maxGuests: 3,
    bedrooms: 1,
    bathrooms: 1,
    beds: 2,
    location: { address: '345 7th Avenue', city: 'Brooklyn', country: 'United States', state: 'New York', coordinates: { type: 'Point', coordinates: [-73.9813, 40.6655] } },
    images: [
      { url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800', caption: 'Brownstone exterior' },
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', caption: 'Living room' },
      { url: 'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=800', caption: 'Private backyard' },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600',
    amenities: ['wifi', 'kitchen', 'heating', 'washer', 'tv', 'garden'],
    isFeatured: false,
    avgRating: 4.6,
    totalReviews: 1,
    totalBookings: 11,
    petsAllowed: true,
    minStay: 2,
    hostIdx: 3,
  },

  // ── DUBAI ──
  {
    title: 'Burj Khalifa View Penthouse — Downtown Dubai',
    description: `Wake up to the world's tallest building from the floor-to-ceiling windows of this extraordinary penthouse in the heart of Downtown Dubai. The 180-degree view takes in the Burj Khalifa, the Dubai Fountain, and the entire glittering city skyline.\n\nThe penthouse is spread across two levels with a rooftop terrace, private plunge pool, and a cinema room. The building includes 24-hour concierge, valet parking, an infinity pool, and a state-of-the-art spa.\n\nThis is the pinnacle of Dubai luxury — perfect for honeymoons, milestone celebrations, or high-profile visits.`,
    type: 'apartment',
    pricePerNight: 850,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3,
    beds: 4,
    location: { address: 'Downtown Dubai, Sheikh Mohammed bin Rashid Blvd', city: 'Dubai', country: 'UAE', state: 'Dubai', coordinates: { type: 'Point', coordinates: [55.2744, 25.1972] } },
    images: [
      { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', caption: 'Burj Khalifa view' },
      { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', caption: 'Master suite' },
      { url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800', caption: 'Rooftop terrace' },
      { url: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800', caption: 'Living area' },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600',
    amenities: ['wifi', 'pool', 'gym', 'ac', 'parking', 'workspace', 'tv', 'hot tub'],
    isFeatured: true,
    avgRating: 4.9,
    totalReviews: 2,
    totalBookings: 3,
    smokingAllowed: false,
    petsAllowed: false,
    minStay: 2,
    houseRules: 'Strictly no parties. Guests must be registered at the building security.',
    hostIdx: 1,
  },

  // ── PARIS ──
  {
    title: 'Haussmann Apartment with Eiffel Tower View',
    description: `The most romantic address in Paris — a classic Haussmann apartment on the 6th floor with a direct line of sight to the Eiffel Tower from every main room. Watch the tower sparkle every evening from the comfort of your own home.\n\nThe apartment has been elegantly restored with original herringbone parquet floors, marble fireplaces, and ornate cornicing — while adding a fully modernised kitchen and luxury bathrooms. Sleeping up to 4 guests across 2 bedrooms, it is ideal for couples or small families exploring the City of Light.\n\nThe 7th arrondissement location gives you immediate access to the Champ de Mars, Musée d'Orsay, and some of Paris's finest restaurants.`,
    type: 'apartment',
    pricePerNight: 340,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    beds: 2,
    location: { address: 'Rue Saint-Dominique, 7ème', city: 'Paris', country: 'France', state: 'Île-de-France', coordinates: { type: 'Point', coordinates: [2.3088, 48.8566] } },
    images: [
      { url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', caption: 'Eiffel Tower view' },
      { url: 'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800', caption: 'Living room' },
      { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800', caption: 'Bedroom' },
      { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', caption: 'Kitchen' },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',
    amenities: ['wifi', 'kitchen', 'heating', 'washer', 'workspace', 'tv'],
    isFeatured: true,
    avgRating: 4.8,
    totalReviews: 2,
    totalBookings: 10,
    smokingAllowed: false,
    petsAllowed: false,
    minStay: 3,
    hostIdx: 2,
  },

  // ── MOUNTAINS ──
  {
    title: 'Alpine Ski Chalet — Chamonix',
    description: `A skier's dream — this rustic-luxe chalet sits at the base of Mont Blanc in legendary Chamonix, the world capital of extreme sports and mountain adventure. In winter, ski directly to the slopes; in summer, access 200km of hiking trails.\n\nThe chalet features a large stone fireplace, exposed timber beams, a sauna and hot tub, and a wrap-around terrace with breathtaking views of the Mont Blanc massif. The fully-equipped kitchen and wine cellar make apres-ski evenings magical.\n\nSleeps up to 8, perfect for group getaways year-round.`,
    type: 'cabin',
    pricePerNight: 520,
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    beds: 5,
    location: { address: '18 Chemin des Moussoux', city: 'Chamonix', country: 'France', state: 'Haute-Savoie', coordinates: { type: 'Point', coordinates: [6.8696, 45.9237] } },
    images: [
      { url: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800', caption: 'Chalet exterior in snow' },
      { url: 'https://images.unsplash.com/photo-1586105449897-20b5efeb3233?w=800', caption: 'Stone fireplace' },
      { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', caption: 'Hot tub' },
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', caption: 'Mountain view bedroom' },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=600',
    amenities: ['wifi', 'fireplace', 'hot tub', 'parking', 'kitchen', 'heating', 'washer', 'bbq'],
    isFeatured: false,
    avgRating: 4.9,
    totalReviews: 2,
    totalBookings: 6,
    smokingAllowed: false,
    petsAllowed: true,
    eventsAllowed: false,
    minStay: 3,
    houseRules: 'Pets welcome. Ski boots must be left in the boot room. No smoking indoors.',
    hostIdx: 2,
  },

  // ── INDIA ──
  {
    title: 'Heritage Haveli Suite — Jaipur Old City',
    description: `Step into a living piece of Rajasthani history in this beautifully converted haveli (traditional mansion) in the heart of Jaipur's Pink City. The suite is decorated with hand-painted frescoes, antique furniture, and intricate mirror work that showcases centuries of local craftsmanship.\n\nGuests enjoy access to the haveli's rooftop with panoramic views of the old city and the Nahargarh Fort, a private courtyard garden, and a traditional Rajasthani breakfast each morning prepared by the resident cook.\n\nYou are a 10-minute walk from the City Palace, Hawa Mahal, and Johari Bazaar.`,
    type: 'hotel',
    pricePerNight: 95,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    beds: 1,
    location: { address: 'Chandpol Bazaar', city: 'Jaipur', country: 'India', state: 'Rajasthan', coordinates: { type: 'Point', coordinates: [75.8150, 26.9260] } },
    images: [
      { url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800', caption: 'Haveli courtyard' },
      { url: 'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=800', caption: 'Suite interior' },
      { url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', caption: 'Rooftop view' },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600',
    amenities: ['wifi', 'ac', 'parking', 'garden'],
    isFeatured: false,
    avgRating: 4.7,
    totalReviews: 2,
    totalBookings: 14,
    smokingAllowed: false,
    petsAllowed: false,
    minStay: 1,
    hostIdx: 0,
  },
  {
    title: 'Modern Studio in Bandra West — Mumbai',
    description: `A sleek, fully-furnished studio in Mumbai's trendiest neighbourhood — Bandra West. This compact yet smartly designed space is perfect for business travellers, solo explorers, or couples wanting to experience the energy of Maximum City.\n\nThe studio features a Smart TV, high-speed WiFi, a workspace, and a fully equipped kitchenette. The building has a rooftop gym and 24-hour security.\n\nBandra West puts you in the middle of Mumbai's café culture, with Bandstand promenade, Carter Road, and the best restaurants in the city all within walking distance.`,
    type: 'studio',
    pricePerNight: 55,
    maxGuests: 2,
    bedrooms: 0,
    bathrooms: 1,
    beds: 1,
    location: { address: 'Hill Road, Bandra West', city: 'Mumbai', country: 'India', state: 'Maharashtra', coordinates: { type: 'Point', coordinates: [72.8347, 19.0544] } },
    images: [
      { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', caption: 'Studio interior' },
      { url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800', caption: 'Workspace' },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
    amenities: ['wifi', 'ac', 'gym', 'workspace', 'tv'],
    isFeatured: false,
    avgRating: 4.4,
    totalReviews: 1,
    totalBookings: 20,
    smokingAllowed: false,
    petsAllowed: false,
    minStay: 1,
    hostIdx: 0,
  },
];

const REVIEW_COMMENTS = [
  { rating: 5, comment: 'Absolutely stunning property. The photos don\'t do it justice — it\'s even better in real life. Our host was incredibly welcoming and provided the most thoughtful welcome basket. Would book again in a heartbeat.', cleanliness: 5, accuracy: 5, location: 5, value: 5 },
  { rating: 5, comment: 'One of the best stays I\'ve ever had. Perfect location, immaculate cleanliness, and the host responded to messages within minutes. We didn\'t want to leave!', cleanliness: 5, accuracy: 5, location: 5, value: 4 },
  { rating: 4, comment: 'Beautiful property with a great location. The amenities were exactly as described. Only minor thing was the hot water took a moment to come through but honestly that was our only gripe in an otherwise perfect stay.', cleanliness: 4, accuracy: 5, location: 5, value: 4 },
  { rating: 5, comment: 'The view alone is worth every penny. We celebrated our anniversary here and it was magical. Host arranged a surprise bottle of champagne — above and beyond!', cleanliness: 5, accuracy: 5, location: 5, value: 5 },
  { rating: 4, comment: 'Really enjoyed our stay. The location is unbeatable and the space is very comfortable. A couple of small things could be improved (more kitchen utensils would help) but overall a fantastic experience.', cleanliness: 4, accuracy: 4, location: 5, value: 4 },
  { rating: 5, comment: 'Exceeded all expectations. Clean, stylish, and with the most responsive host I\'ve ever encountered. This is exactly what travel should feel like.', cleanliness: 5, accuracy: 5, location: 5, value: 5 },
  { rating: 5, comment: 'Perfect for our family trip. Kids loved it, parents loved it. The neighbourhood is safe and walkable. We\'ll definitely be back next year.', cleanliness: 5, accuracy: 5, location: 4, value: 5 },
  { rating: 4, comment: 'Lovely property in a great location. The beds were super comfortable and the kitchen was well stocked. Would recommend to anyone visiting this area.', cleanliness: 5, accuracy: 4, location: 5, value: 4 },
];

// ─── Seeder logic ──────────────────────────────────────────────────────────────

const clearDB = async () => {
  await Promise.all([
    User.deleteMany({}),
    Property.deleteMany({}),
    Booking.deleteMany({}),
    Review.deleteMany({}),
  ]);
  console.log('🗑️  Database cleared');
};

const seed = async () => {
  // 1. Create admin
  const admin = await User.create(ADMIN);
  console.log(`✅ Admin created: ${admin.email} / admin123`);

  // 2. Create hosts
  const hosts = await Promise.all(HOSTS.map(h => User.create(h)));
  console.log(`✅ ${hosts.length} hosts created`);

  // 3. Create guests
  const guests = await Promise.all(GUESTS.map(g => User.create(g)));
  console.log(`✅ ${guests.length} guests created`);

  // 4. Create properties
  const createdProperties = [];
  for (const propData of PROPERTIES) {
    const { hostIdx, ...data } = propData;
    const prop = await Property.create({ ...data, host: hosts[hostIdx]._id });
    createdProperties.push(prop);
  }
  console.log(`✅ ${createdProperties.length} properties created`);

  // 5. Update host listing counts
  for (const host of hosts) {
    const count = await Property.countDocuments({ host: host._id });
    await User.findByIdAndUpdate(host._id, { totalListings: count });
  }

  // 6. Create bookings + reviews for each property
  let bookingCount = 0;
  let reviewCount = 0;

  for (let i = 0; i < createdProperties.length; i++) {
    const prop = createdProperties[i];
    const numReviews = prop.totalReviews || 0;

    for (let j = 0; j < numReviews; j++) {
      const guest = guests[j % guests.length];
      const checkIn = new Date(Date.now() - (30 + j * 14) * 24 * 60 * 60 * 1000);
      const checkOut = new Date(checkIn.getTime() + (3 + j) * 24 * 60 * 60 * 1000);
      const nights = 3 + j;
      const subtotal = prop.pricePerNight * nights;
      const cleaningFee = Math.round(prop.pricePerNight * 0.1);
      const serviceFee = Math.round(subtotal * 0.12);

      const booking = await Booking.create({
        property: prop._id,
        guest: guest._id,
        host: prop.host,
        checkIn,
        checkOut,
        guests: 2,
        nights,
        pricePerNight: prop.pricePerNight,
        subtotal,
        cleaningFee,
        serviceFee,
        totalPrice: subtotal + cleaningFee + serviceFee,
        status: 'completed',
        paymentStatus: 'paid',
        hasReview: true,
      });
      bookingCount++;

      const reviewData = REVIEW_COMMENTS[(i + j) % REVIEW_COMMENTS.length];
      const review = await Review.create({
        property: prop._id,
        guest: guest._id,
        booking: booking._id,
        ...reviewData,
      });
      reviewCount++;

      await Property.findByIdAndUpdate(prop._id, { $push: { reviews: review._id } });
    }
  }

  console.log(`✅ ${bookingCount} bookings created`);
  console.log(`✅ ${reviewCount} reviews created`);

  // 7. Add some pending bookings (future)
  for (let i = 0; i < 3; i++) {
    const prop = createdProperties[i];
    const guest = guests[i % guests.length];
    const checkIn = new Date(Date.now() + (10 + i * 7) * 24 * 60 * 60 * 1000);
    const checkOut = new Date(checkIn.getTime() + 4 * 24 * 60 * 60 * 1000);
    const subtotal = prop.pricePerNight * 4;
    const cleaningFee = Math.round(prop.pricePerNight * 0.1);
    const serviceFee = Math.round(subtotal * 0.12);

    await Booking.create({
      property: prop._id,
      guest: guest._id,
      host: prop.host,
      checkIn,
      checkOut,
      guests: 2,
      nights: 4,
      pricePerNight: prop.pricePerNight,
      subtotal,
      cleaningFee,
      serviceFee,
      totalPrice: subtotal + cleaningFee + serviceFee,
      status: 'confirmed',
      paymentStatus: 'paid',
    });
  }
  console.log('✅ 3 upcoming bookings created');
};

// ─── Main ──────────────────────────────────────────────────────────────────────

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const shouldClear = process.argv.includes('--clear');
    if (shouldClear) {
      await clearDB();
      console.log('\n✅ Done — database cleared\n');
      process.exit(0);
    }

    // Always clear before seeding to avoid duplicates
    await clearDB();
    await seed();

    console.log('\n🏠 StayHaven database seeded successfully!\n');
    console.log('─────────────────────────────────────');
    console.log('Test accounts:');
    console.log('  Admin:   admin@stayhaven.com  / admin123');
    console.log('  Host 1:  priya@stayhaven.com  / password123');
    console.log('  Host 2:  marcus@stayhaven.com / password123');
    console.log('  Host 3:  sofia@stayhaven.com  / password123');
    console.log('  Host 4:  james@stayhaven.com  / password123');
    console.log('  Guest 1: aarav@example.com    / password123');
    console.log('  Guest 2: emma@example.com     / password123');
    console.log('─────────────────────────────────────');
    console.log(`  ${PROPERTIES.length} properties across 8 cities`);
    console.log('  Bali · Tokyo · Kyoto · Tuscany · Positano');
    console.log('  New York · Brooklyn · Dubai · Paris · Chamonix');
    console.log('  Jaipur · Mumbai');
    console.log('─────────────────────────────────────\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

run();
