import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, MapPin, Users, Bed, Bath, Shield, ChevronLeft, ArrowLeft, Heart } from 'lucide-react';
import { getPropertyById } from '../services/propertyService';
import BookingWidget from '../components/booking/BookingWidget';
import { PageSpinner } from '../components/common/Spinner';
import { formatDate, capitalize, AMENITY_ICONS, getRatingLabel } from '../utils/helpers';

export default function PropertyDetail() {
  const { id } = useParams();
  const [imgIdx, setImgIdx] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['property', id],
    queryFn: () => getPropertyById(id),
  });

  if (isLoading) return <PageSpinner />;
  if (isError) return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Property Not Found</h2>
      <Link to="/properties" className="text-brand font-black text-sm uppercase tracking-widest hover:underline">← Explore Listings</Link>
    </div>
  );

  const { property } = data;
  const images = property.images?.length
    ? property.images.map(i => i.url)
    : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'];

  return (
    <div className="bg-dark min-h-screen text-white">
      {/* Hero Gallery */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <img 
          src={images[imgIdx]} 
          className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0" 
          alt="" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/40 via-transparent to-dark" />
        
        <div className="absolute top-10 left-4 right-4 max-w-7xl mx-auto flex justify-between items-center z-10">
          <Link to="/properties" className="w-12 h-12 bg-dark/40 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center hover:bg-brand transition-all duration-300 shadow-2xl">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <button className="w-12 h-12 bg-dark/40 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center hover:bg-brand transition-all duration-300 shadow-2xl">
            <Heart className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Thumbnail Selector */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 p-3 bg-dark/40 backdrop-blur-md border border-white/10 rounded-3xl z-10 overflow-x-auto max-w-[90vw]">
          {images.map((url, i) => (
            <button 
              key={i} 
              onClick={() => setImgIdx(i)}
              className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 shrink-0 ${imgIdx === i ? 'border-brand scale-110 shadow-xl' : 'border-transparent opacity-50 hover:opacity-100'}`}
            >
              <img src={url} className="w-full h-full object-cover" alt="" />
            </button>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Content */}
          <div className="lg:col-span-7 space-y-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-brand/10 text-brand text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                   {property.type}
                </span>
                {property.host?.isVerifiedHost && (
                  <span className="flex items-center gap-1.5 text-[10px] font-black text-green-500 uppercase tracking-widest">
                    <Shield className="w-3 h-3" /> Verified Host
                  </span>
                )}
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter leading-[0.95]">
                {property.title}
              </h1>

              <div className="flex flex-wrap items-center gap-8 text-xs font-black text-gray-500 uppercase tracking-[0.2em]">
                {property.avgRating > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-brand text-brand" />
                    <span className="text-white">{property.avgRating}</span>
                    <span>({property.totalReviews} REVIEWS)</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand" />
                  <span className="text-white">{property.location.city}, {property.location.country}</span>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-surface-lighter">
              {[
                { label: 'Type', value: property.type },
                { label: 'Guests', value: `${property.maxGuests} Max` },
                { label: 'Bedrooms', value: property.bedrooms },
                { label: 'Bathrooms', value: property.bathrooms },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-sm font-black text-white uppercase">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-20">
              <section>
                <h2 className="text-2xl font-black text-white mb-8 uppercase tracking-tight">The Space</h2>
                <p className="text-gray-400 leading-relaxed text-lg font-medium whitespace-pre-line">{property.description}</p>
              </section>

              <section>
                <h2 className="text-2xl font-black text-white mb-10 uppercase tracking-tight">Amenities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {property.amenities.map(a => (
                    <div key={a} className="flex items-center gap-4 bg-surface border border-surface-lighter px-6 py-4 rounded-2xl group hover:border-brand/50 transition-all duration-300">
                      <div className="w-2 h-2 bg-brand rounded-full group-hover:scale-150 transition-transform" />
                      <span className="text-sm font-bold text-gray-400 group-hover:text-white uppercase tracking-widest">{a}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <div className="bg-surface border border-surface-lighter p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 bg-brand rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-brand/20">
                {property.host?.avatar 
                  ? <img src={property.host.avatar} className="w-full h-full object-cover rounded-[2rem]" alt="" />
                  : property.host?.name?.charAt(0)}
              </div>
              <div className="text-center md:text-left flex-1">
                <p className="text-[10px] font-black text-brand uppercase tracking-widest mb-1">Your Host</p>
                <h4 className="text-2xl font-black text-white uppercase mb-2">{property.host?.name}</h4>
                <p className="text-sm text-gray-500 font-medium">Member since {new Date(property.host?.createdAt).getFullYear()}</p>
              </div>
              <button className="btn-outline px-10 py-4 text-xs">CONTACT HOST</button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5">
             <BookingWidget property={property} />
          </div>
        </div>
      </div>
    </div>
  );
}
