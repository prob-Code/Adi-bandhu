import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import Button from '../../components/ui/Button';
import { getDashboardPathByRole } from '../../utils/roleRouting';

const ROLE_OPTIONS = [
  { value: 'Field Officer', label: 'Forest Officer' },
  { value: 'Committee Member', label: 'Collector' },
  { value: 'Administrator', label: 'Sarpanch' },
  { value: 'Public Viewer', label: 'Patta holder' },
  { value: 'Public Viewer', label: 'NGOs' }
  
];

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Field Officer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role, full_name: fullName },
          emailRedirectTo: window.location.origin + '/auth/login',
        },
      });
      
      if (err) throw err;
      
      if (!data.session) {
        navigate('/auth/login?registered=true');
        return;
      }
      
      navigate(getDashboardPathByRole(role), { replace: true });
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
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
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden border border-orange-100">
          {/* Orange Header */}
          <div className="bg-orange-600 text-white py-3 px-6">
            <h2 className="text-xl font-semibold">Create New Account</h2>
            <p className="text-sm text-orange-100">Register for the Tribal Affairs Management System</p>
          </div>
          
          {/* Form Section */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                
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
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    {ROLE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Create a password (min 8 characters)"
                    minLength="8"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm your password"
                    minLength="8"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="flex items-center mb-4">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the <a href="#" className="text-orange-600 hover:text-orange-500">Terms of Service</a> and{' '}
                    <a href="#" className="text-orange-600 hover:text-orange-500">Privacy Policy</a>
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
                
                <div className="mt-4 text-center text-sm text-gray-600">
                  <p>Already have an account?{' '}
                    <Link to="/auth/login" className="font-medium text-orange-600 hover:text-orange-500">
                      Sign in here
                    </Link>
                  </p>
                </div>
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
      <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>National Portal of India | Content Owned and Maintained by Ministry of Tribal Affairs</p>
          <p className="mt-1 text-gray-400">Designed, Developed and Hosted by National Informatics Centre</p>
        </div>
      </footer>
    </div>
  );
}
