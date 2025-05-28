import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, Phone, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Logo and About */}
          <div>
            <Link to="/" className="flex items-center">
              <Home className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-bold text-white">PropertyPulse</span>
            </Link>
            <p className="mt-4 text-sm leading-6">
              Discover your perfect property with PropertyPulse - your trusted partner in real estate.
              We offer a wide selection of properties with advanced search capabilities.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <span className="sr-only">Facebook</span>
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <span className="sr-only">Instagram</span>
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <span className="sr-only">Twitter</span>
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link to="/favorites" className="text-gray-300 hover:text-white transition">Favorites</Link>
              </li>
              <li>
                <Link to="/my-listings" className="text-gray-300 hover:text-white transition">My Listings</Link>
              </li>
              <li>
                <Link to="/add-property" className="text-gray-300 hover:text-white transition">Add Property</Link>
              </li>
              <li>
                <Link to="/recommendations" className="text-gray-300 hover:text-white transition">Recommendations</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Home className="h-5 w-5 mr-2 mt-0.5 text-gray-400" />
                <span>123 Property Street, Real Estate City, 10001</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-gray-400" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-gray-400" />
                <span>contact@propertypulse.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} PropertyPulse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;