import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin, Star, Shield, Clock, ArrowRight } from 'lucide-react';
import { getProperties } from '../services/propertyService';
import PropertyCard from '../components/property/PropertyCard';
import { PageSpinner } from '../components/common/Spinner';

const PROPERTY_TYPES = ['All', 'apartment', 'house', 'villa', 'hotel', 'cabin', 'cottage'];

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('All');

  const { data, isLoading } = useQuery({
    queryKey: ['featured-properties'],
    queryFn: () => getProperties({ featured: true, limit: 8 }),
  });

  const { data: allData, isLoading: allLoading } = useQuery({
    queryKey: ['properties-home', activeType],
    queryFn: () => getProperties({
      limit: 12,
      ...(activeType !== 'All' && { type: activeType }),
    }),
  });

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/properties?city=${encodeURIComponent(search)}`);
  };

  return (
    <div className="bg-dark min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-gradient-to-b from-dark/0 via-dark/50 to-dark" />
           <img 
             src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600" 
             className="w-full h-full object-cover opacity-30 grayscale"
             alt=""
           />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center animate-fade-in">
          <p className="text-brand font-black tracking-[0.3em] text-sm mb-6 uppercase">Stay with StayHaven</p>
          <h1 className="text-7xl md:text-9xl font-black mb-12 leading-[1.1] tracking-tighter uppercase">
            Travel <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/50">Redefined</span>
          </h1>
          <p className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto font-medium">
            Discover the world's most exceptional properties. Handpicked for quality, designed for comfort.
          </p>

          <form onSubmit={handleSearch} className="bg-surface/50 backdrop-blur-2xl border border-surface-lighter rounded-3xl p-3 flex flex-col md:flex-row items-center gap-2 shadow-2xl max-w-2xl mx-auto group focus-within:border-brand/50 transition-all duration-500">
            <div className="flex items-center gap-3 flex-1 px-4 w-full">
              <MapPin className="w-5 h-5 text-brand" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Where to next?"
                className="flex-1 text-white text-lg font-bold outline-none py-3 bg-transparent placeholder:text-gray-600"
              />
            </div>
            <button type="submit" className="bg-brand text-white font-black py-4 px-10 rounded-2xl w-full md:w-auto hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-brand/20">
              SEARCH
            </button>
          </form>

          <div className="flex flex-wrap justify-center items-center gap-4 mt-16 text-sm">
             <span className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Trending:</span>
            {['Bali', 'Paris', 'Tokyo', 'Dubai'].map(city => (
              <button key={city} onClick={() => navigate(`/properties?city=${city}`)}
                className="px-6 py-2 bg-surface-lighter border border-white/5 hover:border-brand hover:text-white rounded-full transition-all duration-300 font-bold text-xs text-gray-400">
                {city.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="text-[10px] font-black tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-brand to-transparent" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-y border-surface-lighter">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: 'Verified Stays', value: '12K+' },
            { label: 'Global Cities', value: '450+' },
            { label: 'Happy Guests', value: '85K+' },
            { label: 'Superhosts', value: '4.9/5' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-4xl font-black mb-2 text-white tracking-tighter">{stat.value}</p>
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      {!isLoading && data?.properties?.length > 0 && (
        <section className="py-32 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-16">
              <div>
                <p className="text-brand font-black tracking-[0.2em] text-xs mb-3 uppercase">Exclusives</p>
                <h2 className="text-5xl font-black text-white uppercase tracking-tighter">Featured Stays</h2>
              </div>
              <button onClick={() => navigate('/properties')} className="group flex items-center gap-2 text-sm font-black text-gray-400 hover:text-brand transition-colors">
                VIEW ALL <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {data.properties.map(p => <PropertyCard key={p._id} property={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Browse by type */}
      <section className="py-32 px-4 bg-surface/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-white mb-16 uppercase tracking-tighter">Browse Categories</h2>

          <div className="flex gap-4 flex-wrap mb-16">
            {PROPERTY_TYPES.map(t => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`px-8 py-3 rounded-2xl text-xs font-black transition-all uppercase tracking-widest border-2 ${
                  activeType === t
                    ? 'bg-brand border-brand text-white shadow-xl shadow-brand/20 scale-105'
                    : 'bg-dark border-surface-lighter text-gray-500 hover:border-gray-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {allLoading ? <PageSpinner /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {allData?.properties?.map(p => <PropertyCard key={p._id} property={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Why StayHaven */}
      <section className="py-32 px-4 border-t border-surface-lighter">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-20">
          {[
            { icon: Shield, title: 'PURE SECURITY', desc: 'Every stay is backed by our full coverage protection plan.' },
            { icon: Clock, title: 'REAL TIME', desc: 'Instant confirmations and 24/7 concierge support globally.' },
            { icon: Star, title: 'ELITE HOSTS', desc: 'Curated selection of the top 1% properties worldwide.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group">
              <div className="w-16 h-16 bg-surface border border-surface-lighter rounded-3xl flex items-center justify-center mb-8 group-hover:border-brand/50 group-hover:scale-110 transition-all duration-500 shadow-xl">
                <Icon className="w-8 h-8 text-brand" />
              </div>
              <h3 className="text-xl font-black text-white mb-4 tracking-tight uppercase">{title}</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto bg-brand rounded-[3rem] p-16 md:p-32 text-center relative overflow-hidden shadow-2xl shadow-brand/20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-black mb-8 uppercase tracking-tighter leading-none">Share your <br /> exceptional space</h2>
            <p className="text-white/80 mb-12 max-w-lg mx-auto text-lg font-bold">Join the world's most elite collection of property hosts and earn what you deserve.</p>
            <button onClick={() => navigate('/become-host')} className="bg-white text-brand px-12 py-5 rounded-2xl text-lg font-black hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/10">
              LIST PROPERTY
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
