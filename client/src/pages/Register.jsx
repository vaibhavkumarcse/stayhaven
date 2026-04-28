import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Home } from 'lucide-react';
import { registerUser } from '../services/authService';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function Register() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultRole = searchParams.get('role') || 'guest';

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { role: defaultRole }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await registerUser(data);
      setAuth(res.user, res.token);
      toast.success(`Welcome to StayHaven, ${res.user.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 bg-brand rounded-xl flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold">Stay<span className="text-brand">Haven</span></span>
        </Link>

        <div className="bg-white rounded-2xl shadow-card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Create account</h2>
          <p className="text-sm text-gray-500 mb-6">Join StayHaven to start booking or hosting</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name too short' } })}
                placeholder="John Doe"
                className="input-field"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                placeholder="you@example.com"
                className="input-field"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                  placeholder="Min. 6 characters"
                  className="input-field pr-10"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            {/* Role selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I want to</label>
              <div className="grid grid-cols-2 gap-3">
                {[{ val: 'guest', label: '🏖️ Book stays', desc: 'Find and book properties' },
                  { val: 'host', label: '🏠 Host', desc: 'List my property' }].map(opt => (
                  <label key={opt.val} className={`cursor-pointer border-2 rounded-xl p-3 transition ${watch('role') === opt.val ? 'border-brand bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" value={opt.val} {...register('role')} className="sr-only" />
                    <p className="font-medium text-sm text-gray-900">{opt.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
