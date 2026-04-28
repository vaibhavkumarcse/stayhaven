import { Link, useNavigate } from 'react-router-dom';
import { Heart, Star, MapPin, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { formatPrice, truncate, capitalize } from '../../utils/helpers';
import { toggleWishlist } from '../../services/propertyService';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function PropertyCard({ property }) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [wishlisted, setWishlisted] = useState(
    user?.wishlist?.includes(property._id)
  );
  const [imgIdx, setImgIdx] = useState(0);

  const images = property.images?.length
    ? property.images.map(i => i.url)
    : [property.thumbnail || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600'];

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please log in to save properties'); return; }
    try {
      await toggleWishlist(property._id);
      setWishlisted(w => !w);
      toast.success(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist');
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <Link to={`/properties/${property._id}`} className="group block animate-fade-in">
      <div className="card-hover">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-surface-lighter">
          <img
            src={images[imgIdx]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600'; }}
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent opacity-60" />

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-4 right-4 p-3 rounded-2xl bg-dark/40 backdrop-blur-md border border-white/10 hover:bg-brand transition-all duration-300 z-10"
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-white text-white' : 'text-white/70'}`} />
          </button>

          {/* Price Tag */}
          <div className="absolute bottom-4 left-4 bg-white text-dark px-4 py-2 rounded-xl font-black text-sm shadow-2xl">
            {formatPrice(property.pricePerNight)}
          </div>

          {/* Arrow Indicator */}
          <div className="absolute top-4 left-4 w-10 h-10 bg-brand rounded-xl flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 shadow-xl shadow-brand/20">
            <ArrowUpRight className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Info Area */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
             <span className="text-[10px] font-black text-brand uppercase tracking-widest">{capitalize(property.type)}</span>
             {property.avgRating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-brand text-brand" />
                <span className="text-xs font-black text-white">{property.avgRating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <h3 className="text-lg font-black text-white leading-tight mb-2 uppercase tracking-tight group-hover:text-brand transition-colors duration-300">
            {truncate(property.title, 35)}
          </h3>

          <div className="flex items-center gap-1.5 text-gray-500 mb-4">
            <MapPin className="w-3 h-3" />
            <p className="text-xs font-bold uppercase tracking-wide truncate">{property.location.city}, {property.location.country}</p>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-black text-gray-600 uppercase tracking-widest border-t border-surface-lighter pt-4">
            <span>{property.maxGuests} GUESTS</span>
            <span>{property.bedrooms} BEDS</span>
            <span>{property.bathrooms} BATHS</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
