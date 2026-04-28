import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getMe } from '../services/authService';
import PropertyCard from '../components/property/PropertyCard';
import { PageSpinner } from '../components/common/Spinner';

export default function Wishlist() {
  const { data, isLoading } = useQuery({ queryKey: ['me'], queryFn: getMe });

  if (isLoading) return <PageSpinner />;

  const wishlist = data?.user?.wishlist || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Wishlist</h1>
      <p className="text-gray-500 mb-8">{wishlist.length} saved propert{wishlist.length !== 1 ? 'ies' : 'y'}</p>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl">
          <p className="text-5xl mb-4">❤️</p>
          <h3 className="font-semibold text-gray-900 mb-2">No saved properties yet</h3>
          <p className="text-gray-500 mb-6">Tap the heart on any listing to save it here</p>
          <Link to="/properties" className="btn-primary">Explore properties</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map(p => <PropertyCard key={p._id} property={p} />)}
        </div>
      )}
    </div>
  );
}
