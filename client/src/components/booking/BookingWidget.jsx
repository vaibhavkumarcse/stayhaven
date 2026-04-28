import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DateRange } from 'react-date-range';
import { format, addDays, isSameDay } from 'date-fns';
import { Users, Calendar, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { formatPrice, calculateNights } from '../../utils/helpers';
import { createBooking } from '../../services/authService';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export default function BookingWidget({ property }) {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [showCalendar, setShowCalendar] = useState(false);
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState([{
    startDate: new Date(),
    endDate: addDays(new Date(), 3),
    key: 'selection',
  }]);

  const nights = calculateNights(range[0].startDate, range[0].endDate) || 1;
  const subtotal = property.pricePerNight * nights;
  const cleaningFee = Math.round(property.pricePerNight * 0.1);
  const serviceFee = Math.round(subtotal * 0.12);
  const total = subtotal + cleaningFee + serviceFee;

  const handleBook = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book');
      navigate('/login');
      return;
    }

    if (user?._id === property.host?._id || user?._id === property.host) {
        toast.error('You cannot book your own property');
        return;
    }

    if (isSameDay(range[0].startDate, range[0].endDate)) {
        toast.error('Check-out date must be after check-in date');
        return;
    }

    setLoading(true);
    try {
      const bookingData = {
        propertyId: property._id,
        checkIn: range[0].startDate.toISOString(),
        checkOut: range[0].endDate.toISOString(),
        guests: guests
      };
      const res = await createBooking(bookingData);
      if (res.success) {
        toast.success('Booking initiated!');
        navigate(`/payment/${res.booking._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface border border-surface-lighter rounded-[2.5rem] p-8 sticky top-32 shadow-2xl animate-fade-in transition-all duration-500">
      <div className="flex items-baseline gap-2 mb-8">
        <span className="text-4xl font-black text-white">{formatPrice(property.pricePerNight)}</span>
        <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">/ night</span>
      </div>

      <div className="space-y-4 mb-8">
        {/* Date Selector */}
        <div className={`relative border border-surface-lighter rounded-3xl overflow-hidden transition-all duration-300 ${showCalendar ? 'border-brand ring-4 ring-brand/10' : 'hover:border-gray-600'}`}>
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-full flex items-center justify-between px-6 py-5 bg-dark/30"
          >
            <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5 text-brand" />
              <div className="text-left">
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Schedule</p>
                <p className="text-sm font-black text-white">
                  {format(range[0].startDate, 'MMM d')} — {format(range[0].endDate, 'MMM d, yyyy')}
                </p>
              </div>
            </div>
            {showCalendar ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
          </button>

          {showCalendar && (
            <div className="bg-dark p-2 border-t border-surface-lighter overflow-x-auto">
              <DateRange
                ranges={range}
                onChange={item => setRange([item.selection])}
                minDate={new Date()}
                maxDate={addDays(new Date(), 365)}
                rangeColors={['#5850ec']}
                months={1}
                direction="vertical"
                showDateDisplay={false}
              />
              <button 
                onClick={() => setShowCalendar(false)}
                className="w-full py-3 text-xs font-black text-brand hover:bg-brand/10 rounded-xl transition mt-2 uppercase tracking-widest"
              >
                Close Calendar
              </button>
            </div>
          )}
        </div>

        {/* Guest Selector */}
        <div className="border border-surface-lighter bg-dark/30 rounded-3xl px-6 py-5 hover:border-gray-600 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Users className="w-5 h-5 text-brand" />
              <div className="text-left">
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Capacity</p>
                <p className="text-sm font-black text-white">{guests} {guests > 1 ? 'GUESTS' : 'GUEST'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setGuests(g => Math.max(1, g - 1))} className="w-8 h-8 rounded-xl border border-surface-lighter flex items-center justify-center text-white hover:bg-surface-lighter transition font-black text-lg">−</button>
              <button onClick={() => setGuests(g => Math.min(property.maxGuests, g + 1))} className="w-8 h-8 rounded-xl border border-surface-lighter flex items-center justify-center text-white hover:bg-surface-lighter transition font-black text-lg">+</button>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={handleBook} 
        disabled={loading} 
        className="w-full bg-brand text-white py-5 rounded-[1.5rem] text-lg font-black shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 uppercase tracking-widest"
      >
        {loading ? 'Processing...' : 'Reserve Now'}
      </button>

      <p className="text-center text-[10px] font-black text-gray-600 mt-6 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
        <ShieldCheck className="w-3 h-3 text-green-500" />
        No immediate charges
      </p>

      {/* Price breakdown */}
      <div className="mt-10 pt-8 border-t border-surface-lighter space-y-4">
        <div className="flex justify-between text-sm font-bold text-gray-500 uppercase tracking-wide">
          <span>{formatPrice(property.pricePerNight)} × {nights} nights</span>
          <span className="text-white">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm font-bold text-gray-500 uppercase tracking-wide">
          <span>Cleaning fee</span>
          <span className="text-white">{formatPrice(cleaningFee)}</span>
        </div>
        <div className="flex justify-between text-sm font-bold text-gray-500 uppercase tracking-wide">
          <span>Service fee</span>
          <span className="text-white">{formatPrice(serviceFee)}</span>
        </div>
        <div className="pt-6 mt-6 border-t border-surface-lighter flex justify-between">
          <span className="text-sm font-black text-white uppercase tracking-widest">Total Price</span>
          <span className="text-2xl font-black text-brand">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
