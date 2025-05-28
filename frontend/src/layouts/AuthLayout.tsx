import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex flex-col">
      <div className="p-4">
        <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 transition">
          <Home size={24} className="mr-2" />
          <span className="font-medium">Back to Home</span>
        </Link>
      </div>
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
      <div className="p-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} PropertyPulse. All rights reserved.
      </div>
    </div>
  );
};

export default AuthLayout;