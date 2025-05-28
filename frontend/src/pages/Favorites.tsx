import React, { useState, useEffect } from 'react';
import { getFavorites, removeFromFavorites } from '../services/favoriteService';
import { Favorite, Property } from '../types';
import PropertyCard from '../components/property/PropertyCard';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const favoritesData = await getFavorites(); 
      console.log('Fetched favorites:', favoritesData);
      setFavorites(favoritesData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (propertyId: string) => {
    try {
      await removeFromFavorites(propertyId);
      await fetchFavorites(); // refetch after removal
      toast.success('Removed from favorites');
    } catch (err) {
      // toast.error('Failed to remove from favorites');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <Heart className="mr-3 text-red-500" />
          My Favorites
        </h1>
        <p className="text-gray-600 mt-2">Properties you've saved</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {favorites.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <Heart className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No favorites yet</h3>
          <p className="mt-1 text-gray-500">
            Properties you save will appear here. Start browsing to find properties you like!
          </p>
          <div className="mt-6">
            <a href="/" className="btn-primary inline-block">
              Browse Properties
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites
            .filter((fav) => fav.propertyId && fav.propertyId.id)
            .map((fav) => (
              <PropertyCard
                key={fav.propertyId.id}
                property={fav.propertyId}
                isFavorite={true}
                onRemoveFavorite={() => handleRemoveFavorite(fav.propertyId.id)}
              />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;