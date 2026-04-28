import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { User, Mail, Phone, MapPin, FileText } from 'lucide-react';
import { updateProfile, becomeHost } from '../services/authService';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');

  const { register, handleSubmit } = useForm({ defaultValues: user });

  const { mutate: saveProfile, isLoading } = useMutation({
    mutationFn: updateProfile,
    onSuccess: ({ user: u }) => { updateUser(u); toast.success('Profile updated!'); },
    onError: () => toast.error('Update failed'),
  });

  const { mutate: makeHost, isLoading: hostLoading } = useMutation({
    mutationFn: becomeHost,
    onSuccess: ({ user: u }) => { updateUser(u); toast.success('You are now a host!'); },
    onError: () => toast.error('Failed'),
  });

  const handleLogout = () => { logout(); navigate('/'); toast.success('Logged out'); };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-8">
        {['profile', 'security'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition ${tab === t ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <form onSubmit={handleSubmit(saveProfile)} className="space-y-5">
          {/* Avatar placeholder */}
          <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
            <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-500 capitalize">{user?.role} · Member since {new Date(user?.createdAt || Date.now()).getFullYear()}</p>
            </div>
          </div>

          {[
            { icon: User, name: 'name', label: 'Full name', type: 'text' },
            { icon: Mail, name: 'email', label: 'Email', type: 'email', disabled: true },
            { icon: Phone, name: 'phone', label: 'Phone', type: 'tel' },
            { icon: MapPin, name: 'location', label: 'Location', type: 'text', placeholder: 'City, Country' },
          ].map(({ icon: Icon, name, label, type, disabled, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={type} {...register(name)} disabled={disabled} placeholder={placeholder}
                  className={`input-field pl-10 ${disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''}`} />
              </div>
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <textarea {...register('bio')} rows={3} className="input-field pl-10 resize-none" placeholder="Tell guests about yourself..." />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? 'Saving...' : 'Save changes'}
            </button>
            {user?.role === 'guest' && (
              <button type="button" onClick={() => makeHost()} disabled={hostLoading} className="btn-outline">
                {hostLoading ? '...' : '🏠 Become a host'}
              </button>
            )}
          </div>
        </form>
      )}

      {tab === 'security' && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-2xl p-5">
            <h3 className="font-semibold text-gray-900 mb-1">Danger Zone</h3>
            <p className="text-sm text-gray-500 mb-4">Actions here cannot be undone.</p>
            <button onClick={handleLogout} className="text-sm text-red-600 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-xl transition">
              Log out of account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
