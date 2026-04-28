import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getMyBookings, cancelBooking } from '../services/authService';
import { formatDate, formatPrice } from '../utils/helpers';
import { PageSpinner } from '../components/common/Spinner';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  pending:   { cls: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: Clock },
  confirmed: { cls: 'bg-green-50 text-green-700 border-green-200',  icon: CheckCircle },
  cancelled: { cls: 'bg-red-50 text-red-700 border-red-200',       icon: XCircle },
  completed: { cls: 'bg-blue-50 text-blue-700 border-blue-200',    icon: CheckCircle },
  refunded:  { cls: 'bg-gray-50 text-gray-700 border-gray-200',    icon: AlertCircle },
};

export default function MyBookings() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['my-bookings'], queryFn: getMyBookings });

  const { mutate: cancel } = useMutation({
    mutationFn: (id) => cancelBooking(id, 'Cancelled by guest'),
    onSuccess: () => { qc.invalidateQueries(['my-bookings']); toast.success('Booking cancelled'); },
    onError: () => toast.error('Failed to cancel booking'),
  });

  if (isLoading) return <PageSpinner />;

  const bookings = data?.bookings || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">My Trips</h1>
      <p className="text-gray-500 mb-8">{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</p>

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl">
          <p className="text-5xl mb-4">✈️</p>
          <h3 className="font-semibold text-gray-900 mb-2">No trips yet</h3>
          <p className="text-gray-500 mb-6">When you book a stay, it will show up here</p>
          <Link to="/properties" className="btn-primary">Start exploring</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(b => {
            const { cls, icon: Icon } = STATUS_STYLES[b.status] || STATUS_STYLES.pending;
            return (
              <div key={b._id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col sm:flex-row">
                <div className="w-full sm:w-40 h-40 sm:h-auto shrink-0">
                  <img
                    src={b.property?.thumbnail || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300'}
                    alt="" className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <Link to={`/properties/${b.property?._id}`} className="font-semibold text-gray-900 hover:text-brand transition">
                        {b.property?.title}
                      </Link>
                      <span className={`shrink-0 flex items-center gap-1 text-xs font-medium border px-2 py-1 rounded-full capitalize ${cls}`}>
                        <Icon className="w-3 h-3" /> {b.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{b.property?.location?.city}, {b.property?.location?.country}</span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
                      </div>
                      <span>{b.nights} night{b.nights !== 1 ? 's' : ''} · {b.guests} guest{b.guests !== 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className="font-semibold text-gray-900">{formatPrice(b.totalPrice)}</span>
                    <div className="flex gap-2">
                      <Link to={`/bookings/${b._id}`} className="text-sm text-gray-600 border border-gray-200 hover:border-gray-400 px-3 py-1.5 rounded-xl transition">
                        View details
                      </Link>
                      {['pending', 'confirmed'].includes(b.status) && (
                        <button
                          onClick={() => { if (confirm('Cancel this booking?')) cancel(b._id); }}
                          className="text-sm text-red-600 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-xl transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
