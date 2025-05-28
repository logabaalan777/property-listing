import React from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../../types';
import { Heart, MapPin, Home, Bath, BedDouble, Tag, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { addToFavorites, removeFromFavorites, checkIsFavorite } from '../../services/favoriteService';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
  onRemoveFavorite?: (propertyId: string) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  isFavorite: initialFavorite, 
  onRemoveFavorite 
}) => {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = React.useState(initialFavorite || false);
  const [loading, setLoading] = React.useState(false);
  
  // Check if the property is in favorites on initial load
  React.useEffect(() => {
    if (isAuthenticated && initialFavorite === undefined) {
      const checkFavoriteStatus = async () => {
        try {
          const status = await checkIsFavorite(property.id);
          setIsFavorite(status);
        } catch (error) {
          console.error('Failed to check favorite status:', error);
        }
      };
      
      checkFavoriteStatus();
    }
  }, [property.id, isAuthenticated, initialFavorite]);
  
  // Toggle favorite status
  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to property details
    
    if (!isAuthenticated) {
      toast.error('Please log in to save favorites');
      return;
    }
    
    setLoading(true);
    
    try {
      if (isFavorite) {
        await removeFromFavorites(property.id);
        setIsFavorite(false);
        toast.success('Removed from favorites');
        if (onRemoveFavorite) {
          onRemoveFavorite(property.id);
        }
      } else {
        await addToFavorites(property.id);
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    } finally {
      setLoading(false);
    }
  };
  
  const getColorStyle = (colorTheme: string) => ({
    backgroundColor: `${colorTheme}10`, // Very light version of the color
    borderColor: colorTheme
  });

  return (
    <Link to={`/property/${property.id}`} className="block group">
      <div 
        className="card overflow-hidden transition-all duration-300 border-t-4 hover:translate-y-[-4px]" 
        style={{ borderColor: property.colorTheme }}
      >
        {/* Property Image */}
        <div className="relative h-48 bg-gray-200">
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: `${property.colorTheme}30` }}
            >
              <Home size={48} className="text-gray-400" />
            </div>
          )}
          
          {/* Type and listingType badge */}
          <div className="absolute top-2 left-2">
            <div 
              className="text-xs font-medium px-2 py-1 rounded-md"
              style={{ backgroundColor: property.colorTheme, color: 'white' }}
            >
              {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
            </div>
          </div>

          {/* Verified badge */}
          {property.isVerified && (
            <div className="absolute top-2 right-10">
              <div className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-md flex items-center">
                <CheckCircle size={12} className="mr-1" />
                Verified
              </div>
            </div>
          )}
          
          {/* Favorite button */}
          <button
            onClick={toggleFavorite}
            disabled={loading}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white shadow-sm hover:bg-gray-100 focus:outline-none transition-colors"
          >
            <Heart
              size={18}
              className={`${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'} transition-colors`}
            />
          </button>
        </div>
        
        {/* Property Info */}
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">{property.title}</h3>
            <div className="flex items-center bg-gray-100 px-2 py-1 rounded text-sm font-medium">
              <span className="sr-only">Rating:</span>
              {property.rating.toFixed(1)}
            </div>
          </div>
          
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <MapPin size={14} className="mr-1" />
            {property.city}, {property.state}
          </div>

          <div className="flex justify-between items-center mb-3">
            <div className="font-bold text-xl text-gray-900">
              {formatCurrency(property.price)}
              {property.listingType === 'rent' && <span className="text-sm font-normal text-gray-500">/month</span>}
            </div>
            <div className="text-sm text-gray-500">{property.areaSqFt} sq.ft</div>
          </div>
          
          <div className="flex gap-4 mb-3">
            <div className="flex items-center text-gray-700">
              <BedDouble size={16} className="mr-1" />
              <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Bath size={16} className="mr-1" />
              <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
          </div>

          {/* Tags */}
          {property.tags && property.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {property.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center text-xs rounded-full px-2 py-1 tag"
                  style={getColorStyle(property.colorTheme)}
                >
                  <Tag size={10} className="mr-1" style={{ color: property.colorTheme }} />
                  {tag}
                </span>
              ))}
              {property.tags.length > 3 && (
                <span className="text-xs text-gray-500 flex items-center">
                  +{property.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;