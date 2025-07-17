import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { 
  FilmIcon, 
  TvIcon, 
  BookmarkIcon, 
  UserIcon, 
  MagnifyingGlassIcon, 
  ArrowRightOnRectangleIcon, 
  ChevronDownIcon, 
  UserCircleIcon, 
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import { userAPI } from '../src/services/api';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get current user on component mount
  useEffect(() => {
    try {
      const user = userAPI.getCurrentUser();
      setCurrentUser(user || null);
    } catch (error) {
      console.error('Error getting current user:', error);
      setCurrentUser(null);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const { authAPI } = await import("../src/services/api");
      await authAPI.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white relative overflow-hidden">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-purple-900/20 to-transparent animate-pulse" aria-hidden="true"></div>
      
      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Visible on desktop, hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 left-0 right-0 h-16 bg-zinc-800/80 backdrop-blur-sm border-b border-zinc-700/50 z-50 transition-all duration-300">
          <div className="flex items-center justify-between h-full max-w-7xl mx-auto px-4 sm:px-6">
            {/* Mobile menu button */}
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="md:hidden text-gray-300 hover:text-white focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                )}
              </button>

              <Link to="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                  <FilmIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Entertainment Hub
                </span>
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-4">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search movies, TV shows, and more..."
                  className="block w-full pl-10 pr-3 py-2 border border-zinc-600 rounded-lg bg-zinc-700/50 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Mobile search button */}
            <button 
              className="md:hidden p-2 text-gray-300 hover:text-white focus:outline-none"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>

            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 group focus:outline-none"
              >
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5">
                    <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
                      {currentUser?.profilePicture ? (
                        <img
                          src={currentUser.profilePicture}
                          alt={currentUser.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserCircleIcon className="w-6 h-6 text-zinc-300" />
                      )}
                    </div>
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-800"></span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white">{currentUser?.name || 'User'}</p>
                  <p className="text-xs text-zinc-400">Premium Member</p>
                </div>
                <ChevronDownIcon 
                  className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${showDropdown ? 'transform rotate-180' : ''}`} 
                />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-zinc-800/95 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-zinc-700/50 z-50 transform transition-all duration-200 origin-top-right">
                  <div className="p-4 border-b border-zinc-700/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5">
                        <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center">
                          {currentUser?.profilePicture ? (
                            <img
                              src={currentUser.profilePicture}
                              alt={currentUser.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <UserCircleIcon className="w-6 h-6 text-zinc-300" />
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{currentUser?.name || 'User'}</p>
                        <p className="text-xs text-zinc-400 truncate max-w-[180px]">{currentUser?.email || 'user@example.com'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-700/50 hover:text-white transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <UserIcon className="w-5 h-5 mr-3 text-zinc-400" />
                      <span>Your Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-700/50 hover:text-white transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Cog6ToothIcon className="w-5 h-5 mr-3 text-zinc-400" />
                      <span>Account Settings</span>
                    </Link>
                    <div className="border-t border-zinc-700/50 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-3 text-sm text-red-400 hover:bg-zinc-700/50 hover:text-red-300 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-zinc-800/95 backdrop-blur-sm px-4 py-3 border-b border-zinc-700/50"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search movies, TV shows..."
                  className="block w-full pl-10 pr-3 py-2 border border-zinc-600 rounded-lg bg-zinc-700/50 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-200"
                  autoFocus
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900/95 backdrop-blur-sm border-r border-zinc-700/50 overflow-y-auto md:hidden"
            >
              <div className="pt-20 pb-8 px-4 space-y-6">
                <nav className="space-y-2">
                  <Link
                    to="/"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === '/' ? 'bg-indigo-500/20 text-indigo-400' : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'
                    }`}
                  >
                    <HomeIcon className="w-6 h-6" />
                    <span>Home</span>
                  </Link>
                  <Link
                    to="/movies"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      location.pathname.startsWith('/movies') ? 'bg-indigo-500/20 text-indigo-400' : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'
                    }`}
                  >
                    <FilmIcon className="w-6 h-6" />
                    <span>Movies</span>
                  </Link>
                  <Link
                    to="/tvseries"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      location.pathname.startsWith('/tvseries') ? 'bg-indigo-500/20 text-indigo-400' : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'
                    }`}
                  >
                    <TvIcon className="w-6 h-6" />
                    <span>TV Shows</span>
                  </Link>
                  <Link
                    to="/bookmark"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === '/bookmark' ? 'bg-indigo-500/20 text-indigo-400' : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'
                    }`}
                  >
                    <BookmarkIcon className="w-6 h-6" />
                    <span>Bookmarks</span>
                  </Link>
                  <Link
                    to="/dashboard"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === '/dashboard' ? 'bg-indigo-500/20 text-indigo-400' : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'
                    }`}
                  >
                    <Cog6ToothIcon className="w-6 h-6" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/profile"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === '/profile' ? 'bg-indigo-500/20 text-indigo-400' : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'
                    }`}
                  >
                    <UserIcon className="w-6 h-6" />
                    <span>Profile</span>
                  </Link>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-zinc-800/50 backdrop-blur-sm border-t border-zinc-700/50 py-4">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-6">
                <span className="text-sm text-zinc-400">© 2025 Entertainment Hub</span>
                <div className="hidden md:flex items-center space-x-4">
                  <a href="#" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Terms of Service</a>
                  <a href="#" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Privacy Policy</a>
                  <a href="#" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Help Center</a>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <span className="text-xs text-zinc-500">v1.0.0</span>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-green-400">All systems operational</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
