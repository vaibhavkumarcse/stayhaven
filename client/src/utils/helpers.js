import { format, differenceInDays, parseISO } from 'date-fns';

export const formatPrice = (price, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price);

export const formatDate = (date, fmt = 'MMM d, yyyy') =>
  format(typeof date === 'string' ? parseISO(date) : date, fmt);

export const calculateNights = (checkIn, checkOut) =>
  differenceInDays(
    typeof checkOut === 'string' ? parseISO(checkOut) : checkOut,
    typeof checkIn === 'string' ? parseISO(checkIn) : checkIn,
  );

export const truncate = (str, n = 100) =>
  str?.length > n ? str.slice(0, n) + '...' : str;

export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

export const getRatingLabel = (rating) => {
  if (rating >= 4.8) return 'Exceptional';
  if (rating >= 4.5) return 'Excellent';
  if (rating >= 4.0) return 'Very Good';
  if (rating >= 3.5) return 'Good';
  return 'Fair';
};

export const AMENITY_ICONS = {
  wifi: '📶', pool: '🏊', parking: '🚗', kitchen: '🍳',
  gym: '💪', ac: '❄️', heating: '🔥', tv: '📺',
  washer: '🫧', dryer: '🌀', 'hot tub': '♨️', fireplace: '🔥',
  balcony: '🏠', garden: '🌿', bbq: '🍖', workspace: '💼',
};

export const PROPERTY_TYPES = [
  'apartment', 'house', 'villa', 'hotel', 'hostel', 'cabin', 'cottage', 'studio',
];

export const AMENITIES_LIST = [
  'wifi', 'pool', 'parking', 'kitchen', 'gym', 'ac', 'heating', 'tv',
  'washer', 'dryer', 'hot tub', 'fireplace', 'balcony', 'garden', 'bbq', 'workspace',
];
