import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserRecommendations, deleteRecommendation } from '../services/recommendationService';
import { Recommendation } from '../types';
import { MessageSquare, MapPin, ExternalLink, Trash2, AlertTriangle } from 'lucide-react';
import { formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

const ReceivedRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recommendationToDelete, setRecommendationToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const recommendationsData = await getUserRecommendations();
        setRecommendations(recommendationsData);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err?.response?.data?.message || err.message || 'Failed to fetch recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const openDeleteModal = (recommendationId: string) => {
    setRecommendationToDelete(recommendationId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setRecommendationToDelete(null);
    setShowDeleteModal(false);
  };

  const confirmDelete = async () => {
    if (!recommendationToDelete) return;
    try {
      await deleteRecommendation(recommendationToDelete);

      // Use _id instead of id to filter out deleted recommendation
      setRecommendations(recommendations.filter(rec => rec._id !== recommendationToDelete));

      toast.success('Recommendation deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete recommendation');
    } finally {
      closeDeleteModal();
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
          <MessageSquare className="mr-3 text-primary-600" />
          Recommendations
        </h1>
        <p className="text-gray-600 mt-2">Properties recommended to you by other users</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {recommendations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No recommendations yet</h3>
          <p className="mt-1 text-gray-500">
            You haven't received any property recommendations yet. When someone recommends a property to you, it will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {recommendations.map((recommendation) => {
            const property = recommendation.propertyId;
            return (
              <div key={recommendation._id ?? property?.id ?? crypto.randomUUID()} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start">
                        <div
                          className="h-16 w-16 bg-gray-200 rounded-lg mr-4 flex-shrink-0"
                          style={{ backgroundColor: `${property?.colorTheme ?? '#cccccc'}30` }}
                        >
                          {property?.images && property.images.length > 0 ? (
                            <img
                              src={property.images[0]}
                              alt={property.title}
                              className="h-16 w-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="h-16 w-16 flex items-center justify-center rounded-lg">
                              <MessageSquare size={24} className="text-gray-400" />
                            </div>
                          )}
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-1">
                            {property?.title ?? 'Untitled Property'}
                          </h3>
                          <div className="flex items-center text-gray-600 text-sm mb-2">
                            <MapPin size={14} className="mr-1" />
                            {property?.city ?? 'Unknown City'}, {property?.state ?? 'Unknown State'}
                          </div>
                          <div className="text-gray-600 text-sm">
                            Recommended by <span className="font-medium">{recommendation.fromUserId?.email}</span> on {formatDate(recommendation.createdAt)}
                          </div>
                        </div>
                      </div>

                      {recommendation.message && (
                        <div className="mt-4 bg-gray-50 p-4 rounded-lg text-gray-700 text-sm">
                          "{recommendation.message}"
                        </div>
                      )}
                    </div>

                    <div className="mt-4 sm:mt-0 sm:ml-4 flex sm:flex-col items-center sm:items-end space-x-3 sm:space-x-0 sm:space-y-2">
                      <Link
                        to={`/property/${property?.id ?? ''}`}
                        className="btn-primary text-sm"
                      >
                        <ExternalLink size={16} className="mr-1" />
                        View Property
                      </Link>

                      <button
                        onClick={() => openDeleteModal(recommendation._id)}
                        className="text-red-600 hover:text-red-800 text-sm flex items-center"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Remove Recommendation
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to remove this recommendation? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                >
                  Remove
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={closeDeleteModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceivedRecommendations;

