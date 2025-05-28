import React, { useEffect, useState } from 'react';
import { FilterOptions } from '../../types';
import { getPropertyCities } from '../../services/propertyService';

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  propertyTypes: string[];
  states: string[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  propertyTypes,
  states
}) => {
  const [cityInput, setCityInput] = useState(filters.city || '');
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || '',
    max: filters.maxPrice || ''
  });

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

  const listedByOptions = ["Builder", "Agent", "Owner"];
  
  const handlePriceRangeChange = () => {
    onFilterChange({
      minPrice: priceRange.min ? Number(priceRange.min) : undefined,
      maxPrice: priceRange.max ? Number(priceRange.max) : undefined
    });
  };

  const amenityOptions = [
    "lift", "power-backup", "security", "wifi", "pool", 
    "clubhouse", "gym", "garden", "parking", "ac"
  ];

  return (
    <div className="space-y-6">
      {/* Property Type */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Property Type</h3>
        <select
          value={filters.type || ''}
          onChange={(e) => onFilterChange({ type: e.target.value || undefined })}
          className="w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        >
          <option value="">Any Type</option>
          {defaultPropertyTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Listed By */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Listed By</h3>
        <select
          value={filters.listedBy || ''}
          onChange={(e) => onFilterChange({ listedBy: e.target.value || undefined })}
          className="w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        >
          <option value="">Any Seller</option>
          {listedByOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Location - State */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">State</h3>
        <select
          value={filters.state || ''}
          onChange={(e) => onFilterChange({ 
            state: e.target.value || undefined,
            city: undefined // Reset city when state changes
          })}
          className="w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        >
          <option value="">Any State</option>
          {defaultStates.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      {/* Location - City */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">City</h3>
        <input
          type="text"
          value={cityInput}
          onChange={(e) => {
            setCityInput(e.target.value);
            onFilterChange({ city: e.target.value || undefined });
          }}
          placeholder="Enter city name"
          className="w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        />
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            className="w-full rounded-md border-gray-300 py-2 px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            min="0"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            className="w-full rounded-md border-gray-300 py-2 px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            min="0"
          />
        </div>
        <button
          onClick={handlePriceRangeChange}
          className="mt-2 w-full py-1 bg-primary-50 text-primary-600 text-sm rounded hover:bg-primary-100 transition"
        >
          Apply Price
        </button>
      </div>

      {/* Bedrooms */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Bedrooms</h3>
        <select
          value={filters.minBedrooms || ''}
          onChange={(e) => onFilterChange({ minBedrooms: e.target.value ? Number(e.target.value) : undefined })}
          className="w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
        </select>
      </div>
      
      {/* Bathrooms */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Bathrooms</h3>
        <select
          value={filters.minBathrooms || ''}
          onChange={(e) => onFilterChange({ minBathrooms: e.target.value ? Number(e.target.value) : undefined })}
          className="w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>
      
      {/* Furnished Status */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Furnished Status</h3>
        <select
          value={filters.furnished || ''}
          onChange={(e) => onFilterChange({ furnished: e.target.value || undefined })}
          className="w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        >
          <option value="">Any</option>
          <option value="Furnished">Furnished</option>
          <option value="Semi-Furnished">Semi-Furnished</option>
          <option value="Unfurnished">Unfurnished</option>
        </select>
      </div>
      
      {/* Listing Type */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Listing Type</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            className={`py-2 px-4 rounded-md text-sm font-medium border 
              ${filters.listingType === 'sale' 
                ? 'bg-primary-50 border-primary-300 text-primary-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            onClick={() => onFilterChange({ listingType: filters.listingType === 'sale' ? undefined : 'sale' })}
          >
            For Sale
          </button>
          <button
            className={`py-2 px-4 rounded-md text-sm font-medium border 
              ${filters.listingType === 'rent' 
                ? 'bg-primary-50 border-primary-300 text-primary-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            onClick={() => onFilterChange({ listingType: filters.listingType === 'rent' ? undefined : 'rent' })}
          >
            For Rent
          </button>
        </div>
      </div>
      
      {/* Amenities */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Amenities</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {amenityOptions.map((amenity) => (
            <label key={amenity} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.amenities?.includes(amenity) || false}
                onChange={(e) => {
                  const currentAmenities = filters.amenities || [];
                  if (e.target.checked) {
                    onFilterChange({ amenities: [...currentAmenities, amenity] });
                  } else {
                    onFilterChange({ 
                      amenities: currentAmenities.filter((a) => a !== amenity) 
                    });
                  }
                }}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700 capitalize">
                {amenity.replace('-', ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Clear Filters */}
      <div>
        <button
          onClick={onClearFilters}
          className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;