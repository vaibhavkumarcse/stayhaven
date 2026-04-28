import { Link } from 'react-router-dom';
import { Home, Mail, Phone, Globe, Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark border-t border-surface-lighter mt-32 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-8 group">
              <div className="w-10 h-10 bg-brand rounded-2xl flex items-center justify-center shadow-lg shadow-brand/20">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter uppercase">Stay<span className="text-brand">Haven</span></span>
            </Link>
            <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8">
              Redefining luxury travel. Exceptional properties, elite hosts, and unparalleled service worldwide.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-surface border border-surface-lighter rounded-xl flex items-center justify-center text-gray-500 hover:text-brand hover:border-brand transition-all duration-300">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-8">Hosting</h4>
            <ul className="space-y-4">
              <li><Link to="/become-host" className="text-sm font-bold text-gray-500 hover:text-brand transition-colors uppercase">Become a Host</Link></li>
              <li><Link to="/dashboard" className="text-sm font-bold text-gray-500 hover:text-brand transition-colors uppercase">Host Dashboard</Link></li>
              <li><Link to="/help" className="text-sm font-bold text-gray-500 hover:text-brand transition-colors uppercase">Resource Center</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-8">Support</h4>
            <ul className="space-y-4">
              <li><Link to="/help" className="text-sm font-bold text-gray-500 hover:text-brand transition-colors uppercase">Help Center</Link></li>
              <li><Link to="/privacy" className="text-sm font-bold text-gray-500 hover:text-brand transition-colors uppercase">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm font-bold text-gray-500 hover:text-brand transition-colors uppercase">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-8">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm font-bold text-gray-500 uppercase">
                <Mail className="w-4 h-4 text-brand" /> hello@stayhaven.com
              </li>
              <li className="flex items-center gap-3 text-sm font-bold text-gray-500 uppercase">
                <Phone className="w-4 h-4 text-brand" /> +1 (555) 000-0000
              </li>
              <li className="flex items-center gap-3 text-sm font-bold text-gray-500 uppercase">
                <Globe className="w-4 h-4 text-brand" /> Global HQ, NYC
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-surface-lighter flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
            © {new Date().getFullYear()} STAYHAVEN. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
             <Link to="/privacy" className="text-[10px] font-black text-gray-600 hover:text-white uppercase tracking-widest transition-colors">Privacy</Link>
             <Link to="/terms" className="text-[10px] font-black text-gray-600 hover:text-white uppercase tracking-widest transition-colors">Terms</Link>
             <Link to="/help" className="text-[10px] font-black text-gray-600 hover:text-white uppercase tracking-widest transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
