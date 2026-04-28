import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { PlusCircle, Eye, Pencil, Trash2, ToggleLeft, ToggleRight, Star, DollarSign, Calendar, Home } from 'lucide-react';
import { getMyListings, deleteProperty, toggleAvailability } from '../services/propertyService';
import { getHostBookings } from '../services/authService';
import { formatPrice, formatDate } from '../utils/helpers';
import { PageSpinner } from '../components/common/Spinner';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const qc = useQueryClient();

  const { data: listingsData, isLoading: lLoading } = useQuery({
    queryKey: ['my-listings'], queryFn: getMyListings,
  });

  const { data: bookingsData, isLoading: bLoading } = useQuery({
    queryKey: ['host-bookings'], queryFn: getHostBookings,
  });

  const { mutate: deleteProp } = useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => { qc.invalidateQueries(['my-listings']); toast.success('Property deleted'); },
    onError: () => toast.error('Delete failed'),
  });

  const { mutate: toggleAvail } = useMutation({
    mutationFn: toggleAvailability,
    onSuccess: () => { qc.invalidateQueries(['my-listings']); },
  });

  const listings = listingsData?.properties || [];
  const bookings = bookingsData?.bookings || [];

  const totalEarnings = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  if (lLoading || bLoading) return <PageSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Host Dashboard</h1>
        <Link to="/dashboard/new" className="btn-primary flex items-center gap-2 text-sm">
          <PlusCircle className="w-4 h-4" /> Add Listing
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Listings', value: listings.length, icon: Home, color: 'bg-blue-50 text-blue-600' },
          { label: 'Total Bookings', value: bookings.length, icon: Calendar, color: 'bg-purple-50 text-purple-600' },
          { label: 'Total Earnings', value: formatPrice(totalEarnings), icon: DollarSign, color: 'bg-green-50 text-green-600' },
          { label: 'Avg Rating', value: listings.length ? (listings.reduce((s, l) => s + l.avgRating, 0) / listings.length).toFixed(1) : '—', icon: Star, color: 'bg-yellow-50 text-yellow-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Listings */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">My Listings</h2>
        {listings.length === 0 ? (
          <div className="text-center py-14 bg-gray-50 rounded-2xl">
            <p className="text-4xl mb-3">🏠</p>
            <p className="text-gray-600 mb-5">You haven't added any listings yet</p>
            <Link to="/dashboard/new" className="btn-primary text-sm">Add your first listing</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map(p => (
              <div key={p._id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="relative h-44">
                  <img src={p.thumbnail || p.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'}
                    alt="" className="w-full h-full object-cover" />
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${p.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {p.isAvailable ? 'Active' : 'Paused'}
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-gray-900 truncate mb-1">{p.title}</p>
                  <p className="text-sm text-gray-500 mb-3">{formatPrice(p.pricePerNight)} / night · {p.totalBookings} bookings</p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Link to={`/properties/${p._id}`} className="flex items-center gap-1 text-xs text-gray-600 border border-gray-200 hover:border-gray-400 px-2.5 py-1.5 rounded-lg transition">
                      <Eye className="w-3.5 h-3.5" /> View
                    </Link>
                    <Link to={`/dashboard/edit/${p._id}`} className="flex items-center gap-1 text-xs text-gray-600 border border-gray-200 hover:border-gray-400 px-2.5 py-1.5 rounded-lg transition">
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </Link>
                    <button onClick={() => toggleAvail(p._id)} className="flex items-center gap-1 text-xs text-gray-600 border border-gray-200 hover:border-gray-400 px-2.5 py-1.5 rounded-lg transition">
                      {p.isAvailable ? <ToggleLeft className="w-3.5 h-3.5" /> : <ToggleRight className="w-3.5 h-3.5" />}
                      {p.isAvailable ? 'Pause' : 'Activate'}
                    </button>
                    <button onClick={() => { if (confirm('Delete this property?')) deleteProp(p._id); }}
                      className="flex items-center gap-1 text-xs text-red-600 border border-red-100 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent bookings */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-500 text-sm">No bookings yet.</p>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Guest', 'Property', 'Dates', 'Total', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.slice(0, 10).map(b => (
                  <tr key={b._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-brand rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {b.guest?.name?.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">{b.guest?.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[150px] truncate">{b.property?.title}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatDate(b.checkIn, 'MMM d')} → {formatDate(b.checkOut, 'MMM d')}</td>
                    <td className="px-4 py-3 font-medium">{formatPrice(b.totalPrice)}</td>
                    <td className="px-4 py-3">
                      <span className={`capitalize text-xs font-medium px-2 py-1 rounded-full ${
                        b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        b.status === 'pending'   ? 'bg-yellow-100 text-yellow-700' :
                        b.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                      }`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
