import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import Button from '../../components/ui/Button';
import { getDashboardPathByRole } from '../../utils/roleRouting';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    const role = data.session?.user?.user_metadata?.role || 'Field Officer';
    const target = getDashboardPathByRole(role);
    navigate(target, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header with National Emblem and Title */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src="https://i.ibb.co/FLW9FQS7/Government-of-India-logo-svg.png" 
              alt="National Emblem" 
              className="h-16 w-auto"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-800">भारत सरकार</h1>
              <h2 className="text-lg font-semibold text-orange-600">Government of India</h2>
              <h3 className="text-md font-medium text-gray-700">Ministry of Tribal Affairs</h3>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden border border-orange-100">
          {/* Orange Header */}
          <div className="bg-orange-600 text-white py-3 px-6">
            <h2 className="text-xl font-semibold">Login to Your Account</h2>
            <p className="text-sm text-orange-100">Access the Tribal Affairs Management System</p>
          </div>
          
          {/* Form Section */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email address"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <Link to="/forgot-password" className="text-xs text-orange-600 hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
              
              <div className="text-center text-sm text-gray-600">
                <p>Don't have an account?{' '}
                  <Link to="/auth/signup" className="font-medium text-orange-600 hover:text-orange-500">
                    Register here
                  </Link>
                </p>
              </div>
            </form>
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">
              &copy; {new Date().getFullYear()} Ministry of Tribal Affairs, Government of India. All Rights Reserved.
            </p>
          </div>
        </div>
      </main>
      
      {/* National Portal Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>National Portal of India | Content Owned and Maintained by Ministry of Tribal Affairs</p>
          <p className="mt-1 text-gray-400">Designed, Developed and Hosted by National Informatics Centre</p>
        </div>
      </footer>
    </div>
  );
}
