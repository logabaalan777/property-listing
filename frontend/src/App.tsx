import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PropertyDetails from './pages/PropertyDetails';
import Favorites from './pages/Favorites';
import MyListings from './pages/MyListings';
import AddEditProperty from './pages/AddEditProperty';
import RecommendProperty from './pages/RecommendProperty';
import ReceivedRecommendations from './pages/ReceivedRecommendations';
import NotFound from './pages/NotFound';

// Guards
import ProtectedRoute from './components/guards/ProtectedRoute';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="property/:id" element={<PropertyDetails />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="favorites" element={<Favorites />} />
        <Route path="my-listings" element={<MyListings />} />
        <Route path="add-property" element={<AddEditProperty />} />
        <Route path="edit-property/:id" element={<AddEditProperty />} />
        <Route path="recommend-property/:id" element={<RecommendProperty />} />
        <Route path="recommendations" element={<ReceivedRecommendations />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;