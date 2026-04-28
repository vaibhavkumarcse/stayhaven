import { useNavigate } from 'react-router-dom';
import { Shield, TrendingUp, Users, CheckCircle, ArrowRight } from 'lucide-react';
import useAuthStore from '../store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function BecomeHost() {
  const { user, updateUser, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    if (!isAuthenticated) {
      navigate('/register?role=host');
      return;
    }

    if (user.role === 'host') {
      navigate('/dashboard');
      return;
    }

    try {
      const res = await axios.patch(`${import.meta.env.VITE_API_URL}/api/users/${user._id}/role`, 
        { role: 'host' },
        { headers: { Authorization: `Bearer ${localStorage.getItem('stayhaven-auth') ? JSON.parse(localStorage.getItem('stayhaven-auth')).state.token : ''}` } }
      );
      if (res.data.success) {
        updateUser(res.data.user);
        toast.success('Congratulations! You are now a host.');
        navigate('/dashboard/new');
      }
    } catch (err) {
      toast.error('Failed to upgrade account');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Host your space, <br />
            <span className="text-brand">share your world.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-10">
            Join millions of hosts on StayHaven. Whether you have a spare room, a villa, or an apartment, start earning today.
          </p>
          <button 
            onClick={handleUpgrade}
            className="btn-primary px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 mx-auto group"
          >
            {user?.role === 'host' ? 'Go to Dashboard' : 'Start Hosting Now'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:border-brand/20 transition-colors">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6 text-brand" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Earn Extra Income</h3>
            <p className="text-gray-600 leading-relaxed">
              Turn your unused space into a source of income. Most hosts earn enough to cover their mortgage or travel the world.
            </p>
          </div>

          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:border-brand/20 transition-colors">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Payments</h3>
            <p className="text-gray-600 leading-relaxed">
              We handle the payments and provide insurance coverage for every stay, so you can host with peace of mind.
            </p>
          </div>

          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:border-brand/20 transition-colors">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Global Community</h3>
            <p className="text-gray-600 leading-relaxed">
              Connect with travelers from all over the globe and share your local culture and hospitality.
            </p>
          </div>
        </div>
      </div>

      {/* Why Host Section */}
      <div className="bg-gray-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-white mb-8">Why host on StayHaven?</h2>
            <div className="space-y-6">
              {[
                { title: 'Free Listings', desc: 'Listing your space is completely free, and we only take a small service fee.' },
                { title: 'Full Control', desc: 'You decide your price, your rules, and your schedule.' },
                { title: 'Host Support', desc: 'Our dedicated team is here to help you 24/7 with any questions.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <CheckCircle className="w-6 h-6 text-brand shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="aspect-video bg-gray-800 rounded-3xl border border-gray-700 flex items-center justify-center text-gray-500 font-medium">
               [ Professional Host Image ]
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-24 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Ready to welcome your first guest?</h2>
        <button 
          onClick={handleUpgrade}
          className="btn-primary px-10 py-4 rounded-2xl text-lg font-bold shadow-xl"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
