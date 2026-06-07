import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
        : 'text-gray-300 hover:text-white hover:bg-gray-800'
    }`;

  return (
    <nav className="bg-dark-950/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-white font-extrabold text-xl tracking-tight font-display">
              <span className="bg-gradient-to-r from-primary-500 to-indigo-500 text-transparent bg-clip-text">CreatorConnect</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className={linkClass('/')}>Home</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
                {user.role === 'CREATOR' ? (
                  <>
                    <Link to="/campaigns" className={linkClass('/campaigns')}>Find Campaigns</Link>
                    <Link to="/profile" className={linkClass('/profile')}>My Profile</Link>
                  </>
                ) : (
                  <>
                    <Link to="/creators" className={linkClass('/creators')}>Browse Creators</Link>
                    <Link to="/profile" className={linkClass('/profile')}>Company Profile</Link>
                  </>
                )}
              </>
            ) : (
              <Link to="/campaigns" className={linkClass('/campaigns')}>Browse Campaigns</Link>
            )}
          </div>

          {/* User CTA / Profile */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">
                  <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                    {user.username.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-gray-300">{user.username}</span>
                  <span className="text-[10px] bg-primary-500/20 text-primary-400 border border-primary-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 border border-gray-800 hover:border-red-500/30 hover:bg-red-500/10 text-gray-300 hover:text-red-400 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-primary-500/20 transition-all duration-200"
                >
                  Join as Creator
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 h-6" /> : <Menu className="h-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-dark-900 border-b border-gray-800 px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            Home
          </Link>
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                Dashboard
              </Link>
              {user.role === 'CREATOR' ? (
                <>
                  <Link
                    to="/campaigns"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    Find Campaigns
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    My Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/creators"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    Browse Creators
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    Company Profile
                  </Link>
                </>
              )}
              <div className="border-t border-gray-800 my-2 pt-2">
                <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase">
                  Logged in as {user.username} ({user.role})
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-red-950/20"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/campaigns"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                Browse Campaigns
              </Link>
              <div className="border-t border-gray-800 my-2 pt-2 flex flex-col space-y-2 px-3">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2 border border-gray-800 hover:bg-gray-800 text-sm font-semibold rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2 bg-primary-600 text-sm font-semibold rounded-lg text-white"
                >
                  Sign Up
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
