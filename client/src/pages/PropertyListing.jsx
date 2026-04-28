import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SlidersHorizontal, X } from 'lucide-react';
import { getProperties } from '../services/propertyService';
import PropertyCard from '../components/property/PropertyCard';
import { PageSpinner } from '../components/common/Spinner';
import { PROPERTY_TYPES } from '../utils/helpers';

export default function PropertyListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    type: searchParams.get('type') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    guests: searchParams.get('guests') || '',
    page: 1,
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => getProperties(filters),
    keepPreviousData: true,
  });

  const updateFilter = (key, val) => {
    setFilters(f => ({ ...f, [key]: val, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ city: '', type: '', minPrice: '', maxPrice: '', guests: '', page: 1 });
    setSearchParams({});
  };

  const hasFilters = filters.city || filters.type || filters.minPrice || filters.maxPrice || filters.guests;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {filters.city ? `Stays in ${filters.city}` : 'All Properties'}
          </h1>
          {data && <p className="text-sm text-gray-500 mt-1">{data.total} properties found</p>}
        </div>

        <div className="flex items-center gap-2">
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 px-3 py-2 border border-gray-200 rounded-xl">
              <X className="w-4 h-4" /> Clear filters
            </button>
          )}
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 text-sm font-medium px-4 py-2 border border-gray-200 rounded-xl hover:border-gray-400 transition">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
            <input
              type="text"
              value={filters.city}
              onChange={e => updateFilter('city', e.target.value)}
              placeholder="Any city"
              className="input-field py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
            <select value={filters.type} onChange={e => updateFilter('type', e.target.value)} className="input-field py-2 text-sm">
              <option value="">All types</option>
              {PROPERTY_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Min Price</label>
            <input type="number" value={filters.minPrice} onChange={e => updateFilter('minPrice', e.target.value)}
              placeholder="$0" className="input-field py-2 text-sm" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Max Price</label>
            <input type="number" value={filters.maxPrice} onChange={e => updateFilter('maxPrice', e.target.value)}
              placeholder="Any" className="input-field py-2 text-sm" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Guests</label>
            <input type="number" value={filters.guests} min={1} onChange={e => updateFilter('guests', e.target.value)}
              placeholder="Any" className="input-field py-2 text-sm" />
          </div>
        </div>
      )}

      {/* Type quick filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {['All', ...PROPERTY_TYPES].map(t => (
          <button key={t} onClick={() => updateFilter('type', t === 'All' ? '' : t)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition capitalize border ${
              (t === 'All' && !filters.type) || filters.type === t
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <PageSpinner />
      ) : data?.properties?.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🏠</p>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your filters</p>
          <button onClick={clearFilters} className="btn-primary">Clear filters</button>
        </div>
      ) : (
        <>
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${isFetching ? 'opacity-70' : ''} transition-opacity`}>
            {data?.properties?.map(p => <PropertyCard key={p._id} property={p} />)}
          </div>

          {/* Pagination */}
          {data?.pages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: data.pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setFilters(f => ({ ...f, page: p }))}
                  className={`w-9 h-9 rounded-full text-sm font-medium transition ${
                    filters.page === p ? 'bg-gray-900 text-white' : 'border border-gray-200 hover:border-gray-400'
                  }`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
