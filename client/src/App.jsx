import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import Home from './pages/Home';
import PropertyListing from './pages/PropertyListing';
import PropertyDetail from './pages/PropertyDetail';
import { Login } from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import Dashboard from './pages/Dashboard';
import ListingForm from './pages/ListingForm';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Payment from './pages/Payment';
import BecomeHost from './pages/BecomeHost';
import HelpCenter from './pages/HelpCenter';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<PropertyListing />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/payment/:bookingId" element={<Payment />} />
            <Route path="/become-host" element={<BecomeHost />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />

            {/* Protected — any logged-in user */}
            <Route path="/bookings" element={
              <ProtectedRoute><MyBookings /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
            <Route path="/wishlist" element={
              <ProtectedRoute><Wishlist /></ProtectedRoute>
            } />

            {/* Protected — host only */}
            <Route path="/dashboard" element={
              <ProtectedRoute requiredRole="host"><Dashboard /></ProtectedRoute>
            } />
            <Route path="/dashboard/new" element={
              <ProtectedRoute requiredRole="host"><ListingForm /></ProtectedRoute>
            } />
            <Route path="/dashboard/edit/:id" element={
              <ProtectedRoute requiredRole="host"><ListingForm /></ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
