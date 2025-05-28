import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, Heart, Home, LogOut, PlusSquare, MessageSquare, Home as HomeIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <HomeIcon className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">PropertyPulse</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:ml-8 md:flex md:space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100 transition">
                Home
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/favorites" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100 transition">
                    Favorites
                  </Link>
                  <Link to="/my-listings" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100 transition">
                    My Listings
                  </Link>
                  <Link to="/recommendations" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100 transition">
                    Recommendations
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="ml-4 relative">
                <button
                  onClick={toggleProfile}
                  className="bg-primary-50 flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 p-1"
                >
                  <span className="sr-only">Open user menu</span>
                  <User className="h-8 w-8 rounded-full p-1 text-primary-600" />
                </button>

                {/* Profile dropdown panel */}
                {isProfileOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1 rounded-md bg-white shadow-xs">
                      <div className="block px-4 py-2 text-sm text-gray-700 border-b">
                        {user?.email}
                      </div>
                      
                      <Link to="/my-listings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>
                        <Home className="mr-3 h-4 w-4" /> My Listings
                      </Link>
                      
                      <Link to="/favorites" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>
                        <Heart className="mr-3 h-4 w-4" /> Favorites
                      </Link>
                      
                      <Link to="/recommendations" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>
                        <MessageSquare className="mr-3 h-4 w-4" /> Recommendations
                      </Link>
                      
                      <Link to="/add-property" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>
                        <PlusSquare className="mr-3 h-4 w-4" /> Add Property
                      </Link>
                      
                      <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <LogOut className="mr-3 h-4 w-4" /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="btn-outline">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="flex md:hidden ml-2">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            {isAuthenticated && (
              <>
                <Link
                  to="/favorites"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Favorites
                </Link>
                <Link
                  to="/my-listings"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Listings
                </Link>
                <Link
                  to="/recommendations"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Recommendations
                </Link>
                <Link
                  to="/add-property"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Add Property
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </>
            )}

            {!isAuthenticated && (
              <div className="flex flex-col space-y-2 px-3 py-2">
                <Link to="/login" className="btn-outline text-center" onClick={() => setIsMenuOpen(false)}>
                  Log in
                </Link>
                <Link to="/register" className="btn-primary text-center" onClick={() => setIsMenuOpen(false)}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;