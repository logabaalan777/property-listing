import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPropertyById } from '../services/propertyService';
import { addToFavorites, removeFromFavorites, checkIsFavorite } from '../services/favoriteService';
import { Property } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { 
  Heart, MapPin, BedDouble, Bath, Tag, Calendar, 
  CheckCircle, Home, Share, Edit, Trash2, ArrowLeft, Clock 
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const isOwner = property?.createdBy === user?.id;
  
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const propertyData = await getPropertyById(id);
        setProperty(propertyData);
        
        // Check if property is in user's favorites
        if (isAuthenticated) {
          const favoriteStatus = await checkIsFavorite(id);
          setIsFavorite(favoriteStatus);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch property details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPropertyDetails();
  }, [id, isAuthenticated]);
  
  const handleToggleFavorite = async () => {
    if (!isAuthenticated || !property) {
      toast.error('Please log in to save favorites');
      return;
    }
    
    setFavoriteLoading(true);
    
    try {
      if (isFavorite) {
        await removeFromFavorites(property.id);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await addToFavorites(property.id);
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    } finally {
      setFavoriteLoading(false);
    }
  };
  
  const handleShareProperty = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title || 'Check out this property',
        text: `Check out this property: ${property?.title}`,
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };
  
  const handleRecommendProperty = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to recommend properties');
      return;
    }
    
    navigate(`/recommend-property/${id}`);
  };
  
  const handleEditProperty = () => {
    navigate(`/edit-property/${id}`);
  };
  
  const handleDeleteProperty = async () => {
    // This would be implemented with a modal confirmation
    // and API call to delete the property
    toast.error('Delete functionality would be implemented here');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error || 'Property not found'}
        </div>
        <div className="mt-4">
          <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Back button and actions bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-between items-center">
            <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft size={20} className="mr-2" />
              <span className="font-medium">Back to Properties</span>
            </Link>
            
            <div className="flex mt-2 sm:mt-0 space-x-2">
              <button
                onClick={handleShareProperty}
                className="btn-outline flex items-center text-sm py-1.5"
              >
                <Share size={16} className="mr-1" />
                Share
              </button>
              
              <button
                onClick={handleToggleFavorite}
                disabled={favoriteLoading}
                className={`btn flex items-center text-sm py-1.5 ${
                  isFavorite 
                    ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                    : 'btn-outline'
                }`}
              >
                <Heart 
                  size={16} 
                  className={`mr-1 ${isFavorite ? 'fill-red-500' : ''}`} 
                />
                {isFavorite ? 'Saved' : 'Save'}
              </button>
              
              {isAuthenticated && !isOwner && (
                <button
                  onClick={handleRecommendProperty}
                  className="btn-primary flex items-center text-sm py-1.5"
                >
                  Recommend
                </button>
              )}
              
              {isOwner && (
                <>
                  <button
                    onClick={handleEditProperty}
                    className="btn-secondary flex items-center text-sm py-1.5"
                  >
                    <Edit size={16} className="mr-1" />
                    Edit
                  </button>
                  
                  <button
                    onClick={handleDeleteProperty}
                    className="btn flex items-center text-sm py-1.5 bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header with image */}
          <div 
            className="h-64 sm:h-96 bg-gray-200 relative"
            style={{ backgroundColor: `${property.colorTheme}20` }}
          >
            {property.images && property.images.length > 0 ? (
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Home size={96} className="text-gray-400" />
              </div>
            )}
            
            {/* Type and listing type badges */}
            <div className="absolute top-4 left-4 flex space-x-2">
              <div 
                className="text-sm font-medium px-3 py-1 rounded-full"
                style={{ backgroundColor: property.colorTheme, color: 'white' }}
              >
                {property.type}
              </div>
              
              <div className="bg-black bg-opacity-70 text-white text-sm font-medium px-3 py-1 rounded-full">
                {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
              </div>
            </div>
            
            {/* Verified badge */}
            {property.isVerified && (
              <div className="absolute top-4 right-4">
                <div className="bg-green-500 text-white text-sm font-medium px-3 py-1 rounded-full flex items-center">
                  <CheckCircle size={14} className="mr-1" />
                  Verified
                </div>
              </div>
            )}
          </div>
          
          <div className="p-6">
            {/* Title and location */}
            <div className="mb-6">
              <div className="flex items-start justify-between">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{property.title}</h1>
                <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-lg font-bold">
                  {property.rating.toFixed(1)}
                </div>
              </div>
              
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin size={18} className="mr-1" />
                {property.city}, {property.state}
              </div>
              
              <div className="flex flex-wrap items-center text-2xl font-bold text-gray-900">
                {formatCurrency(property.price)}
                {property.listingType === 'rent' && <span className="text-base font-normal text-gray-500 ml-1">/month</span>}
              </div>
            </div>
            
            {/* Property details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-t border-b border-gray-200">
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Property Type</span>
                <span className="font-medium">{property.type}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Area</span>
                <span className="font-medium">{property.areaSqFt} sq.ft</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Bedrooms</span>
                <span className="font-medium">{property.bedrooms}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Bathrooms</span>
                <span className="font-medium">{property.bathrooms}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Furnished</span>
                <span className="font-medium">{property.furnished}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Listed By</span>
                <span className="font-medium">{property.listedBy}</span>
              </div>
              
              <div className="flex flex-col col-span-2">
                <span className="text-gray-500 text-sm">Available From</span>
                <div className="font-medium flex items-center">
                  <Calendar size={16} className="mr-1 text-gray-500" />
                  {formatDate(property.availableFrom)}
                </div>
              </div>
            </div>
            
            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-3">Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <div className="mr-2 p-1.5 rounded-full bg-primary-50">
                        <CheckCircle className="h-4 w-4 text-primary-600" />
                      </div>
                      <span className="capitalize">{amenity.replace('-', ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Tags */}
            {property.tags && property.tags.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-3">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {property.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm"
                      style={{ 
                        backgroundColor: `${property.colorTheme}15`, 
                        color: property.colorTheme
                      }}
                    >
                      <Tag size={14} className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Listed by and date */}
            <div className="mt-8 text-sm text-gray-500 flex items-center">
              <Clock size={14} className="mr-1" />
              Listed {formatDate(property.createdAt || '2023-01-01')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;