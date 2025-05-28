import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  createProperty, 
  updateProperty, 
  getPropertyById
} from '../services/propertyService';
import { useAuth } from '../contexts/AuthContext';
import { Property } from '../types';
import { 
  Plus, 
  Home, 
  Save, 
  Trash2, 
  X,
  ArrowLeft,
  MapPin
} from 'lucide-react';
import toast from 'react-hot-toast';

const AddEditProperty: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!id;
  
  // Default options
  const defaultPropertyTypes = [
    "Penthouse",
    "Apartment",
    "Villa",
    "Bungalow",
    "Studio"
  ];
  
  const defaultStates = [
    "Maharashtra",
    "Karnataka",
    "Tamil Nadu",
    "Delhi",
    "Telangana",
    "Gujarat",
    "West Bengal",
    "Uttar Pradesh",
    "Rajasthan",
    "Kerala",
    "Madhya Pradesh",
    "Haryana"
  ];
  
  // Form state
  const [formData, setFormData] = useState<Partial<Property>>({
    id: '',
    title: '',
    type: '',
    price: 0,
    state: '',
    city: '',
    areaSqFt: 0,
    bedrooms: 1,
    bathrooms: 1,
    amenities: [],
    furnished: 'Unfurnished',
    availableFrom: new Date().toISOString().split('T')[0],
    listedBy: 'Owner',
    tags: [],
    colorTheme: '#1361c4',
    listingType: 'sale',
    isVerified: false,
    rating: 0
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Amenities options
  const amenityOptions = [
    "lift", "power-backup", "security", "wifi", "pool", 
    "clubhouse", "gym", "garden", "parking", "ac"
  ];
  
  // Load property data
  useEffect(() => {
    const loadData = async () => {
      if (isEditing && id) {
        setLoading(true);
        
        try {
          const propertyData = await getPropertyById(id);
          setFormData(propertyData);
        } catch (err: any) {
          toast.error('Failed to load property');
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadData();
  }, [id, isEditing]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };
  
  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => {
      const currentAmenities = prev.amenities || [];
      if (currentAmenities.includes(amenity)) {
        return {
          ...prev,
          amenities: currentAmenities.filter((a) => a !== amenity)
        };
      } else {
        return {
          ...prev,
          amenities: [...currentAmenities, amenity]
        };
      }
    });
  };
  
  const handleAddTag = () => {
    if (!newTag.trim()) return;
    
    setFormData((prev) => {
      const currentTags = prev.tags || [];
      if (!currentTags.includes(newTag)) {
        return {
          ...prev,
          tags: [...currentTags, newTag.trim()]
        };
      }
      return prev;
    });
    
    setNewTag('');
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((tag) => tag !== tagToRemove)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    
    try {
      const propertyData = {
        ...formData,
        // Add current user info when creating new property
        ...(isEditing ? {} : { createdBy: user?.id, ownerEmail: user?.email })
      };
      
      if (isEditing && id) {
        await updateProperty(id, propertyData);
        toast.success('Property updated successfully');
      } else {
        console.log(propertyData);
        const newProperty = await createProperty(propertyData);
        toast.success('Property created successfully');
      }
      
      navigate('/my-listings');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save property');
    } finally {
      setSaveLoading(false);
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
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => navigate('/my-listings')}
          className="mr-4 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            {isEditing ? (
              <><Save className="mr-2" size={24} /> Edit Property</>
            ) : (
              <><Plus className="mr-2" size={24} /> Add New Property</>
            )}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Update your property listing' : 'Create a new property listing'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* Property ID */}
            <div className="sm:col-span-3">
              <label htmlFor="id" className="block text-sm font-medium text-gray-700">
                Property ID*
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="id"
                  id="id"
                  required
                  value={formData.id}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g. PROP10002"
                  disabled={isEditing}
                />
              </div>
              {isEditing && (
                <p className="mt-1 text-xs text-gray-500">Property ID cannot be changed when editing</p>
              )}
            </div>

            {/* Property Title */}
            <div className="sm:col-span-3">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Property Title*
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            {/* Property Type and Listing Type */}
            <div className="sm:col-span-3">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Property Type*
              </label>
              <div className="mt-1">
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select Type</option>
                  {defaultPropertyTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="listingType" className="block text-sm font-medium text-gray-700">
                Listing Type*
              </label>
              <div className="mt-1">
                <select
                  id="listingType"
                  name="listingType"
                  required
                  value={formData.listingType}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
            </div>

            {/* Price */}
            <div className="sm:col-span-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price*
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="price"
                  id="price"
                  required
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            {/* Area */}
            <div className="sm:col-span-2">
              <label htmlFor="areaSqFt" className="block text-sm font-medium text-gray-700">
                Area (sq.ft)*
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="areaSqFt"
                  id="areaSqFt"
                  required
                  min="0"
                  value={formData.areaSqFt}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            {/* Bedrooms and Bathrooms */}
            <div className="sm:col-span-1">
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
                Bedrooms*
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="bedrooms"
                  id="bedrooms"
                  required
                  min="0"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>
            
            <div className="sm:col-span-1">
              <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
                Bathrooms*
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="bathrooms"
                  id="bathrooms"
                  required
                  min="0"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            {/* State and City */}
            <div className="sm:col-span-3">
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State*
              </label>
              <div className="mt-1">
                <select
                  id="state"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select State</option>
                  {defaultStates.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City*
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="city"
                  id="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter city name"
                />
              </div>
            </div>

            {/* Available From */}
            <div className="sm:col-span-2">
              <label htmlFor="availableFrom" className="block text-sm font-medium text-gray-700">
                Available From*
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="availableFrom"
                  id="availableFrom"
                  required
                  value={formData.availableFrom?.split('T')[0]}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            {/* Furnished Status */}
            <div className="sm:col-span-2">
              <label htmlFor="furnished" className="block text-sm font-medium text-gray-700">
                Furnished Status*
              </label>
              <div className="mt-1">
                <select
                  id="furnished"
                  name="furnished"
                  required
                  value={formData.furnished}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="Unfurnished">Unfurnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Furnished">Furnished</option>
                </select>
              </div>
            </div>

            {/* Listed By */}
            <div className="sm:col-span-2">
              <label htmlFor="listedBy" className="block text-sm font-medium text-gray-700">
                Listed By*
              </label>
              <div className="mt-1">
                <select
                  id="listedBy"
                  name="listedBy"
                  required
                  value={formData.listedBy}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="Owner">Owner</option>
                  <option value="Builder">Builder</option>
                  <option value="Agent">Agent</option>
                </select>
              </div>
            </div>

            {/* Color Theme */}
            <div className="sm:col-span-2">
              <label htmlFor="colorTheme" className="block text-sm font-medium text-gray-700">
                Color Theme
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="color"
                  name="colorTheme"
                  id="colorTheme"
                  value={formData.colorTheme}
                  onChange={handleChange}
                  className="w-12 h-8 p-0 border-0 rounded"
                />
                <input
                  type="text"
                  name="colorTheme"
                  value={formData.colorTheme}
                  onChange={handleChange}
                  className="ml-2 input-field"
                />
              </div>
            </div>

            {/* Verification Status */}
            <div className="sm:col-span-1">
              <label htmlFor="isVerified" className="block text-sm font-medium text-gray-700">
                Verified Status
              </label>
              <div className="mt-1">
                <select
                  id="isVerified"
                  name="isVerified"
                  value={formData.isVerified ? 'true' : 'false'}
                  onChange={(e) => setFormData(prev => ({ ...prev, isVerified: e.target.value === 'true' }))}
                  className="input-field"
                >
                  <option value="false">Not Verified</option>
                  <option value="true">Verified</option>
                </select>
              </div>
            </div>

            {/* Rating */}
            <div className="sm:col-span-1">
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                Rating
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="rating"
                  id="rating"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="0.0 - 5.0"
                />
              </div>
            </div>

            {/* Amenities */}
            <div className="sm:col-span-6">
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-2">
                  Amenities
                </legend>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {amenityOptions.map((amenity) => (
                    <div key={amenity} className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id={`amenity-${amenity}`}
                          name="amenities"
                          type="checkbox"
                          checked={(formData.amenities || []).includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor={`amenity-${amenity}`} className="font-medium text-gray-700 capitalize">
                          {amenity.replace('-', ' ')}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>

            {/* Tags */}
            <div className="sm:col-span-6">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="new-tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="input-field"
                  placeholder="Add a tag (e.g. 'luxury', 'garden', 'lakeside')"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="ml-2 btn-primary"
                >
                  Add
                </button>
              </div>
              
              {formData.tags && formData.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm"
                      style={{ 
                        backgroundColor: `${formData.colorTheme}15`, 
                        color: formData.colorTheme
                      }}
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1.5 h-4 w-4 inline-flex items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/my-listings')}
              className="btn-outline mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={saveLoading}
            >
              {saveLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditing ? 'Saving...' : 'Creating...'}
                </span>
              ) : (
                <>
                  {isEditing ? (
                    <><Save size={18} className="mr-1" /> Save Changes</>
                  ) : (
                    <><Plus size={18} className="mr-1" /> Create Property</>
                  )}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditProperty;