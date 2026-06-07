import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KeyRound, User, Mail, Sparkles, Building, AlertCircle, CheckCircle } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CREATOR'); // CREATOR or BRAND
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await register(username, email, password, role);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.toString());
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-950 border border-gray-800 rounded-3xl p-8 shadow-2xl relative">
        {/* Glow effect */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white font-display">Create an Account</h2>
          <p className="mt-2 text-sm text-gray-400">Join the ultimate collaboration hub today.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center space-x-2 text-sm animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-xl flex items-center space-x-2 text-sm animate-fade-in">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Role selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 text-center">
              Register As
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('CREATOR')}
                className={`py-3.5 px-4 rounded-2xl flex flex-col items-center justify-center border transition-all duration-200 ${
                  role === 'CREATOR'
                    ? 'border-primary-500 bg-primary-500/10 text-white shadow-lg'
                    : 'border-gray-800 bg-gray-900/20 text-gray-400 hover:border-gray-750 hover:bg-gray-800/30'
                }`}
              >
                <Sparkles className={`w-6 h-6 mb-2 ${role === 'CREATOR' ? 'text-primary-400' : 'text-gray-500'}`} />
                <span className="text-sm font-bold">Content Creator</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('BRAND')}
                className={`py-3.5 px-4 rounded-2xl flex flex-col items-center justify-center border transition-all duration-200 ${
                  role === 'BRAND'
                    ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-lg'
                    : 'border-gray-800 bg-gray-900/20 text-gray-400 hover:border-gray-750 hover:bg-gray-800/30'
                }`}
              >
                <Building className={`w-6 h-6 mb-2 ${role === 'BRAND' ? 'text-indigo-400' : 'text-gray-500'}`} />
                <span className="text-sm font-bold">Brand / Company</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="reg-username" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="reg-username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-800 bg-gray-900/40 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                  placeholder="Choose username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-800 bg-gray-900/40 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <KeyRound className="w-5 h-5" />
                </div>
                <input
                  id="reg-password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-800 bg-gray-900/40 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                  placeholder="Choose password"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg hover:shadow-primary-500/20 flex items-center justify-center transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>

        <div className="text-center text-sm border-t border-gray-850 pt-6">
          <span className="text-gray-400">Already have an account? </span>
          <Link to="/login" className="font-bold text-primary-400 hover:text-primary-300">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
