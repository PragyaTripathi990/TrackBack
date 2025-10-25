import React, { useState } from 'react';
import { MapPin, Calendar, User, Phone, Mail, TrendingUp, Eye, X } from 'lucide-react';
import { SearchResult } from '../lib/api';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  searchQuery?: string;
  searchMode?: 'text' | 'image' | 'hybrid';
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
  searchQuery,
  searchMode,
}) => {
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null);

  const getMatchQuality = (score: number) => {
    if (score >= 0.8) return { label: 'Excellent Match', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (score >= 0.7) return { label: 'Good Match', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    if (score >= 0.6) return { label: 'Fair Match', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { label: 'Possible Match', color: 'text-gray-400', bg: 'bg-gray-500/20' };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-300 text-lg">Searching with AI...</p>
        <p className="text-gray-500 text-sm">This may take a few seconds</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="card text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 bg-gray-500/20 rounded-full flex items-center justify-center">
          <TrendingUp className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">No matches found</h3>
        <p className="text-gray-400 mb-6">
          {searchQuery
            ? `No items match "${searchQuery}". Try different keywords or upload an image.`
            : 'Try adjusting your search criteria or lowering the similarity threshold.'}
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>💡 Search tips:</p>
          <ul className="max-w-md mx-auto text-left space-y-1">
            <li>• Use general terms: "phone" instead of "iPhone 13 Pro"</li>
            <li>• Include location: "wallet near library"</li>
            <li>• Try image search if text doesn't work</li>
            <li>• Check both lost and found items</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Results Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Found {results.length} {results.length === 1 ? 'Match' : 'Matches'}
        </h2>
        <p className="text-gray-400">
          {searchMode === 'text' && 'Results ranked by semantic similarity'}
          {searchMode === 'image' && 'Results ranked by visual similarity'}
          {searchMode === 'hybrid' && 'Results ranked by combined text and image similarity'}
        </p>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((item) => {
          const matchQuality = getMatchQuality(item.similarity_score);

          return (
            <div
              key={item.id}
              className="card cursor-pointer hover:scale-105 group"
              onClick={() => setSelectedItem(item)}
            >
              {/* Image */}
              {item.image_url && (
                <div className="relative mb-4 overflow-hidden rounded-lg">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`${
                        item.type === 'lost'
                          ? 'bg-red-500/80'
                          : 'bg-green-500/80'
                      } text-white text-xs font-medium px-2 py-1 rounded-full`}
                    >
                      {item.type === 'lost' ? 'Lost' : 'Found'}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className={`${matchQuality.bg} ${matchQuality.color} px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1`}>
                      <TrendingUp className="w-3 h-3" />
                      <span>{Math.round(item.similarity_score * 100)}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                </div>

                <div className="flex items-center text-sm text-gray-400">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="line-clamp-1">{item.location}</span>
                </div>

                <div className="flex items-center text-sm text-gray-400">
                  <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{formatDate(item.date_lost_or_found)}</span>
                </div>

                {item.user && (
                  <div className="flex items-center text-sm text-gray-400">
                    <User className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="line-clamp-1">{item.user.name}</span>
                  </div>
                )}

                <div className={`pt-3 border-t border-white/10`}>
                  <div className={`${matchQuality.bg} ${matchQuality.color} px-3 py-2 rounded-lg text-xs font-medium text-center`}>
                    {matchQuality.label}
                  </div>
                </div>

                <button className="btn-primary w-full text-sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          />

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-dark-900 rounded-xl border border-white/20 shadow-2xl animate-fade-in">
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6">
                {/* Image */}
                {selectedItem.image_url && (
                  <img
                    src={selectedItem.image_url}
                    alt={selectedItem.title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                )}

                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span
                        className={`${
                          selectedItem.type === 'lost'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-green-500/20 text-green-400'
                        } px-3 py-1 rounded-full text-sm font-medium`}
                      >
                        {selectedItem.type === 'lost' ? 'Lost Item' : 'Found Item'}
                      </span>
                      <div className="flex items-center space-x-1 text-primary-400">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {Math.round(selectedItem.similarity_score * 100)}% Match
                        </span>
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-white">{selectedItem.title}</h2>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-1">Description</h3>
                    <p className="text-gray-200">{selectedItem.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 mb-1">Location</h3>
                      <div className="flex items-center text-gray-200">
                        <MapPin className="w-4 h-4 mr-2 text-primary-400" />
                        {selectedItem.location}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 mb-1">Date</h3>
                      <div className="flex items-center text-gray-200">
                        <Calendar className="w-4 h-4 mr-2 text-primary-400" />
                        {formatDate(selectedItem.date_lost_or_found)}
                      </div>
                    </div>
                  </div>

                  {selectedItem.category && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 mb-1">Category</h3>
                      <span className="inline-block bg-white/10 px-3 py-1 rounded-full text-sm text-gray-200">
                        {selectedItem.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Contact Info */}
                {selectedItem.user && (
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-300">
                        <User className="w-4 h-4 mr-3 text-primary-400" />
                        <span>{selectedItem.user.name}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Mail className="w-4 h-4 mr-3 text-primary-400" />
                        <a
                          href={`mailto:${selectedItem.user.email}`}
                          className="hover:text-primary-400 transition-colors"
                        >
                          {selectedItem.user.email}
                        </a>
                      </div>
                      {selectedItem.user.phone && (
                        <div className="flex items-center text-gray-300">
                          <Phone className="w-4 h-4 mr-3 text-primary-400" />
                          <a
                            href={`tel:${selectedItem.user.phone}`}
                            className="hover:text-primary-400 transition-colors"
                          >
                            {selectedItem.user.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-6 flex gap-3">
                  <button className="btn-primary flex-1">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Owner
                  </button>
                  <button className="btn-secondary">
                    Report Issue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchResults;

