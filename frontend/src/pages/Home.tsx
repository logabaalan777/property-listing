import React, { useState, useEffect } from 'react';
import { getProperties } from '../services/propertyService';
import { Property, FilterOptions } from '../types';
import PropertyCard from '../components/property/PropertyCard';
import FilterPanel from '../components/filters/FilterPanel';
import { Building, Search } from 'lucide-react';

const Home: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Changed to show 10 properties by default
  const [filters, setFilters] = useState<FilterOptions>({
    page: 1,
    limit,
    sortBy: 'newest'
  });
  
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const { properties: propertiesData, total: totalCount } = await getProperties({
          ...filters,
          page,
          limit
        });
        setProperties(propertiesData);
        setTotal(totalCount);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters, page, limit]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setPage(1); // Reset to first page when filters change
    setFilters({ ...filters, ...newFilters });
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit,
      sortBy: 'newest'
    });
  };

  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };

  return (
    <div className="bg-gray-50">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Find Your Dream Property</h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8">
              Browse our extensive collection of properties for sale and rent across India.
            </p>
            
            <div className="mt-8 flex justify-center">
              <button 
                onClick={toggleFilterPanel}
                className="btn bg-white text-primary-700 hover:bg-gray-100 flex items-center"
              >
                <Search size={18} className="mr-2" />
                Search Properties
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h2 className="font-semibold text-lg mb-4 flex items-center">
                  <Search size={18} className="mr-2" />
                  Filter Properties
                </h2>
                <FilterPanel 
                  filters={filters} 
                  onFilterChange={handleFilterChange} 
                  onClearFilters={handleClearFilters}
                  propertyTypes={[]}
                  states={[]}
                />
              </div>
            </div>
          </div>
          
          {/* Filter modal for mobile */}
          {isFilterPanelOpen && (
            <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
              <div className="bg-white rounded-t-xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="font-semibold text-lg">Filters</h2>
                  <button 
                    onClick={toggleFilterPanel}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <FilterPanel 
                    filters={filters} 
                    onFilterChange={(newFilters) => {
                      handleFilterChange(newFilters);
                      setIsFilterPanelOpen(false);
                    }}
                    onClearFilters={() => {
                      handleClearFilters();
                      setIsFilterPanelOpen(false);
                    }}
                    propertyTypes={[]}
                    states={[]}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Main content */}
          <div className="flex-1">
            {/* Mobile filter button */}
            <div className="md:hidden mb-4 flex justify-between items-center">
              <h1 className="text-xl font-bold flex items-center">
                <Building className="mr-2" size={24} />
                Properties
              </h1>
              <button
                onClick={toggleFilterPanel}
                className="btn-outline flex items-center text-sm"
              >
                <Search size={16} className="mr-1" />
                Filters
              </button>
            </div>

            {/* Results section */}
            <div>
              {/* Results header with count and sorting */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="font-semibold text-lg hidden md:flex items-center">
                  <Building className="mr-2" size={20} />
                  Properties {total > 0 && <span className="ml-2 text-gray-500">({total})</span>}
                </h2>
                
                <div className="mt-3 sm:mt-0 w-full sm:w-auto">
                  <select
                    value={filters.sortBy || 'newest'}
                    onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                    className="w-full sm:w-auto rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                  {error}
                </div>
              ) : properties.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <Building className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No properties found</h3>
                  <p className="mt-1 text-gray-500">Try adjusting your filters to find more properties.</p>
                  <button
                    onClick={handleClearFilters}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {total > limit && (
                    <div className="flex justify-center mt-8">
                      <div className="flex space-x-2">
                        <button
                          disabled={page === 1}
                          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                          className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        
                        <span className="px-4 py-2 border rounded-md bg-primary-50 text-primary-700">
                          {page}
                        </span>
                        
                        <button
                          disabled={page * limit >= total}
                          onClick={() => setPage((prev) => prev + 1)}
                          className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;