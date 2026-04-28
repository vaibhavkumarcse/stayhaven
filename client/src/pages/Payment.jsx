import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Shield, ChevronLeft, Lock, Calendar, Users, MapPin } from 'lucide-react';
import { getBookingById, createPaymentIntent, confirmPayment as confirmPaymentAPI } from '../services/authService';
import { PageSpinner } from '../components/common/Spinner';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51...');

function CheckoutForm({ booking }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('stripe'); // 'stripe' or 'upi_qr'
  const [loading, setLoading] = useState(false);
  const upiId = "stayhaven@upi"; // Mock UPI ID

  const upiUrl = `upi://pay?pa=${upiId}&pn=StayHaven&am=${booking.totalPrice}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}&bgcolor=121212&color=5850ec`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paymentMethod === 'upi_qr') {
      toast.success('UPI Payment initiated. Please confirm after scanning.');
      // In a real app, you'd poll the backend for payment status
      return;
    }
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/bookings`,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast.error(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        await confirmPaymentAPI({ 
          bookingId: booking._id, 
          paymentIntentId: paymentIntent.id 
        });
        toast.success('Payment successful! Your stay is confirmed.');
        navigate('/bookings');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred during payment processing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 animate-fade-in">
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setPaymentMethod('stripe')}
          className={`flex-1 py-4 rounded-2xl font-black text-xs tracking-widest transition-all border-2 ${
            paymentMethod === 'stripe' 
              ? 'bg-brand border-brand text-white shadow-lg shadow-brand/20' 
              : 'bg-dark border-surface-lighter text-gray-500 hover:border-gray-400'
          }`}
        >
          SECURE CHECKOUT
        </button>
        <button
          type="button"
          onClick={() => setPaymentMethod('upi_qr')}
          className={`flex-1 py-4 rounded-2xl font-black text-xs tracking-widest transition-all border-2 ${
            paymentMethod === 'upi_qr' 
              ? 'bg-brand border-brand text-white shadow-lg shadow-brand/20' 
              : 'bg-dark border-surface-lighter text-gray-500 hover:border-gray-400'
          }`}
        >
          UPI QR CODE
        </button>
      </div>

      <div className="bg-surface p-8 rounded-[2rem] border border-surface-lighter shadow-2xl">
        <div className="flex items-center gap-3 mb-8 text-white">
          <div className="w-10 h-10 bg-brand/10 rounded-2xl flex items-center justify-center">
            {paymentMethod === 'stripe' ? <Lock className="w-5 h-5 text-brand" /> : <MapPin className="w-5 h-5 text-brand" />}
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight">
              {paymentMethod === 'stripe' ? 'Payment Details' : 'Scan to Pay'}
            </h3>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
              {paymentMethod === 'stripe' ? 'Secure SSL Encrypted' : 'Scan with any UPI App'}
            </p>
          </div>
        </div>
        
        {paymentMethod === 'stripe' ? (
          <div className="payment-element-container">
             <PaymentElement options={{ layout: 'tabs' }} />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8 py-4">
            <div className="p-4 bg-white rounded-3xl shadow-2xl">
              <img src={qrCodeUrl} alt="UPI QR Code" className="w-64 h-64" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm font-black text-white uppercase tracking-widest">{upiId}</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Amount: {formatPrice(booking.totalPrice)}</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-6">
        <button 
          disabled={loading || (paymentMethod === 'stripe' && !stripe)} 
          className="w-full bg-brand text-white py-6 rounded-[2rem] text-xl font-black shadow-2xl shadow-brand/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 uppercase tracking-tighter"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              <span>PROCESSING...</span>
            </div>
          ) : (
            paymentMethod === 'stripe' 
              ? `Confirm and Pay ${formatPrice(booking.totalPrice)}`
              : 'I HAVE PAID'
          )}
        </button>
        
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
            <Shield className="w-4 h-4 text-green-500" />
            <span>Guaranteed Secure {paymentMethod === 'stripe' ? 'via Stripe' : 'via UPI'}</span>
          </div>
        </div>
      </div>
    </form>
  );
}

export default function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => getBookingById(bookingId),
    retry: 1
  });

  useEffect(() => {
    if (data?.booking) {
      createPaymentIntent(bookingId)
        .then(res => {
          setClientSecret(res.clientSecret);
        })
        .catch(err => {
          console.error(err);
          toast.error('Failed to initialize payment gateway.');
        });
    }
  }, [data, bookingId]);

  if (isLoading) return <PageSpinner />;
  if (error || !data?.booking) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-dark">
        <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Booking Not Found</h2>
        <p className="text-gray-500 mb-8 font-bold uppercase tracking-widest text-xs">We couldn't retrieve your checkout session.</p>
        <button onClick={() => navigate('/')} className="btn-primary px-12 py-4">GO HOME</button>
      </div>
    );
  }

  const { booking } = data;
  const property = booking.property;

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24">
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center gap-2 text-xs font-black text-gray-500 mb-12 hover:text-white transition-colors uppercase tracking-widest"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Back to Listing
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Main Content */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="mb-12">
               <p className="text-brand font-black tracking-[0.3em] text-[10px] mb-3 uppercase">Checkout</p>
               <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9]">Finalize <br /> Booking</h1>
            </div>
            
            {clientSecret ? (
              <Elements stripe={stripePromise} options={{ 
                clientSecret, 
                appearance: { 
                  theme: 'night', 
                  variables: { 
                    colorPrimary: '#5850ec',
                    colorBackground: '#121212',
                    colorText: '#ffffff',
                    borderRadius: '16px',
                    fontFamily: 'Inter, sans-serif'
                  } 
                } 
              }}>
                <CheckoutForm booking={booking} />
              </Elements>
            ) : (
              <div className="h-96 flex flex-col items-center justify-center gap-6 bg-surface border border-surface-lighter rounded-[3rem] shadow-2xl">
                <div className="w-12 h-12 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Encrypting Connection...</p>
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="bg-surface rounded-[3rem] border border-surface-lighter shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden sticky top-32">
              <div className="aspect-[4/3] relative group">
                <img 
                  src={property?.thumbnail || property?.images?.[0]?.url} 
                  className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                  alt={property?.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-brand font-black tracking-[0.2em] text-[10px] mb-2 uppercase">Destination</p>
                  <h3 className="text-2xl font-black text-white leading-tight uppercase tracking-tight">{property?.title}</h3>
                </div>
              </div>

              <div className="p-10">
                <div className="grid grid-cols-2 gap-8 mb-10">
                  <div>
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <Calendar className="w-3 h-3 text-brand" /> Dates
                    </p>
                    <p className="text-sm font-black text-white">
                      {new Date(booking.checkIn).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} — {new Date(booking.checkOut).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <Users className="w-3 h-3 text-brand" /> Guests
                    </p>
                    <p className="text-sm font-black text-white">{booking.guests} GUESTS</p>
                  </div>
                </div>

                <div className="pt-10 border-t border-surface-lighter space-y-4">
                  <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <span>Rate</span>
                    <span className="text-white">{formatPrice(booking.totalPrice / 1.17)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <span>Fees & Taxes</span>
                    <span className="text-white">{formatPrice(booking.totalPrice - (booking.totalPrice / 1.17))}</span>
                  </div>
                  <div className="flex justify-between items-center pt-8 mt-8 border-t border-surface-lighter">
                    <span className="text-sm font-black text-white uppercase tracking-widest">Total (INR)</span>
                    <span className="text-4xl font-black text-brand tracking-tighter">{formatPrice(booking.totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
