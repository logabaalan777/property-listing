import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPropertyById } from '../services/propertyService';
import { recommendPropertyToUser } from '../services/recommendationService';
import { Property } from '../types';
import { Send, User, ArrowLeft } from 'lucide-react';
import { MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const RecommendProperty: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const propertyData = await getPropertyById(id);
        setProperty(propertyData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch property details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperty();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !email) return;
    
    setSubmitLoading(true);
    
    try {
      await recommendPropertyToUser(email, id, message);
      toast.success('Property recommended successfully!');
      navigate('/property/' + id);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to recommend property');
    } finally {
      setSubmitLoading(false);
    }
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="mr-4 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Send className="mr-2" size={24} />
            Recommend Property
          </h1>
          <p className="text-gray-600">
            Share this property with someone you know
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Property preview */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div 
              className="w-16 h-16 rounded-lg flex-shrink-0 mr-4"
              style={{ backgroundColor: `${property.colorTheme}20` }}
            >
              {property.images && property.images.length > 0 ? (
                <img 
                  src={property.images[0]} 
                  alt={property.title} 
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg flex items-center justify-center">
                  <Send size={24} className="text-gray-400" />
                </div>
              )}
            </div>
            
            <div>
              <h3 className="font-semibold text-lg">{property.title}</h3>
              <div className="text-gray-600 text-sm flex items-center mt-1">
                <MapPin size={14} className="mr-1" />
                {property.city}, {property.state}
              </div>
            </div>
          </div>
        </div>
        
        {/* Recommendation form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Recipient's Email Address*
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="friend@example.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Personal Message (Optional)
              </label>
              <textarea
                name="message"
                id="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="input-field"
                placeholder="Hey, I think you might like this property..."
              />
            </div>
            
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-outline mr-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={submitLoading || !email}
              >
                {submitLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                      <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <>
                    <Send size={18} className="mr-1" />
                    Send Recommendation
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecommendProperty;