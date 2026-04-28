import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, User, LogOut, PlusSquare, Calendar, Heart } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const isHome = location.pathname === '/';

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled || !isHome ? 'bg-dark/80 backdrop-blur-xl border-b border-surface-lighter py-4' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-brand rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-brand/20">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">STAY<span className="text-brand">HAVEN</span></span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/properties" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
              EXPLORE
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/wishlist" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
                  WISHLIST
                </Link>
                <Link to="/bookings" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
                  MY TRIPS
                </Link>
                
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-3 pl-4 border-l border-surface-lighter hover:opacity-80 transition"
                  >
                    <div className="text-right hidden lg:block">
                      <p className="text-xs font-black text-white leading-none mb-1">{user?.name?.toUpperCase()}</p>
                      <p className="text-[10px] font-bold text-brand uppercase tracking-widest">{user?.role}</p>
                    </div>
                    <div className="w-10 h-10 bg-surface-lighter rounded-2xl flex items-center justify-center text-white text-sm font-black border border-white/10">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-4 w-64 bg-surface border border-surface-lighter rounded-3xl shadow-2xl p-3 animate-fade-in">
                      <div className="p-4 border-b border-surface-lighter mb-2">
                        <p className="text-sm font-black text-white">{user?.name}</p>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{user?.role}</p>
                      </div>
                      <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-400 hover:text-white hover:bg-surface-lighter rounded-2xl transition">
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <Link to="/bookings" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-400 hover:text-white hover:bg-surface-lighter rounded-2xl transition">
                        <Calendar className="w-4 h-4" /> My Bookings
                      </Link>
                      <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-400 hover:text-white hover:bg-surface-lighter rounded-2xl transition">
                        <Heart className="w-4 h-4" /> Wishlist
                      </Link>
                      {user?.role === 'host' ? (
                        <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-400 hover:text-white hover:bg-surface-lighter rounded-2xl transition">
                          <PlusSquare className="w-4 h-4" /> Dashboard
                        </Link>
                      ) : (
                        <Link to="/become-host" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-brand hover:bg-brand/10 rounded-2xl transition">
                          <PlusSquare className="w-4 h-4" /> Become a Host
                        </Link>
                      )}
                      <div className="h-px bg-surface-lighter my-2" />
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-2xl transition">
                        <LogOut className="w-4 h-4" /> Log out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-bold text-white px-6 py-2 hover:opacity-80 transition">
                  LOGIN
                </Link>
                <Link to="/register" className="bg-white text-dark px-6 py-2.5 rounded-xl text-sm font-black hover:scale-105 transition-all shadow-xl shadow-white/5">
                  SIGN UP
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-3 bg-surface-lighter rounded-2xl hover:bg-brand transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-surface border border-surface-lighter rounded-3xl mt-4 p-4 space-y-2 animate-fade-in shadow-2xl">
            <Link to="/properties" onClick={() => setMenuOpen(false)} className="block px-6 py-4 text-sm font-bold text-gray-400 hover:text-white hover:bg-surface-lighter rounded-2xl transition">EXPLORE</Link>
            {isAuthenticated ? (
              <>
                <Link to="/bookings" onClick={() => setMenuOpen(false)} className="block px-6 py-4 text-sm font-bold text-gray-400 hover:text-white hover:bg-surface-lighter rounded-2xl transition">MY TRIPS</Link>
                <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="block px-6 py-4 text-sm font-bold text-gray-400 hover:text-white hover:bg-surface-lighter rounded-2xl transition">WISHLIST</Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-6 py-4 text-sm font-bold text-gray-400 hover:text-white hover:bg-surface-lighter rounded-2xl transition">PROFILE</Link>
                {user?.role === 'host' ? (
                   <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block px-6 py-4 text-sm font-bold text-gray-400 hover:text-white hover:bg-surface-lighter rounded-2xl transition">DASHBOARD</Link>
                ) : (
                  <Link to="/become-host" onClick={() => setMenuOpen(false)} className="block px-6 py-4 text-sm font-bold text-brand hover:bg-brand/10 rounded-2xl transition">BECOME A HOST</Link>
                )}
                <button onClick={handleLogout} className="block w-full text-left px-6 py-4 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-2xl transition">LOG OUT</button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-6 py-4 text-center text-sm font-bold text-white bg-surface-lighter rounded-2xl transition">LOGIN</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-6 py-4 text-center text-sm font-black text-dark bg-white rounded-2xl transition">SIGN UP</Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Close dropdown when clicking outside */}
      {menuOpen && (
        <div className="fixed inset-0 z-[-1]" onClick={() => setMenuOpen(false)} />
      )}
    </nav>
  );
}
