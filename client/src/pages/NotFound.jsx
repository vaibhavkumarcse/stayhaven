import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-8xl font-bold text-gray-100 mb-4">404</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
      <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary">← Back to home</Link>
    </div>
  );
}
