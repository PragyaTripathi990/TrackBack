import React, { useState } from 'react';
import { Search, Upload, X, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { search, upload, SearchResult } from '../lib/api';
import SearchResults from './SearchResults';

type SearchMode = 'text' | 'image' | 'hybrid';
type ItemType = 'lost' | 'found' | 'all';

interface SearchPageProps {
  onBack?: () => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ onBack }) => {
  const [searchMode, setSearchMode] = useState<SearchMode>('text');
  const [itemType, setItemType] = useState<ItemType>('all');
  const [textQuery, setTextQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSearching(true);
    setSearchPerformed(true);

    try {
      let imageUrl: string | undefined;

      // Upload image if selected
      if (selectedImage && (searchMode === 'image' || searchMode === 'hybrid')) {
        setIsUploading(true);
        const uploadResponse = await upload.image(selectedImage);
        imageUrl = uploadResponse.data.data.url;
        setIsUploading(false);
      }

      // Perform search based on mode
      let searchResponse;
      const searchOptions = {
        type: itemType === 'all' ? undefined : itemType,
        threshold: 0.5,
        limit: 20,
      };

      if (searchMode === 'text' && textQuery.trim()) {
        searchResponse = await search.byText(textQuery, searchOptions);
      } else if (searchMode === 'image' && imageUrl) {
        searchResponse = await search.byImage(imageUrl, searchOptions);
      } else if (searchMode === 'hybrid') {
        searchResponse = await search.hybrid({
          query: textQuery.trim() || undefined,
          image_url: imageUrl,
          ...searchOptions,
        });
      } else {
        setError('Please provide search input');
        setIsSearching(false);
        return;
      }

      setResults(searchResponse.data.data);
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.response?.data?.error || 'Search failed. Please try again.');
    } finally {
      setIsSearching(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gradient mb-4">AI-Powered Search</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Find lost items using text descriptions or images. Our AI understands meaning, not just exact words.
          </p>
        </div>

        {/* Search Box */}
        <div className="card mb-8">
          {/* Search Mode Tabs */}
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setSearchMode('text')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                searchMode === 'text'
                  ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <Search className="w-5 h-5 inline-block mr-2" />
              Text Search
            </button>
            <button
              onClick={() => setSearchMode('image')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                searchMode === 'image'
                  ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <ImageIcon className="w-5 h-5 inline-block mr-2" />
              Image Search
            </button>
            <button
              onClick={() => setSearchMode('hybrid')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                searchMode === 'hybrid'
                  ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <Upload className="w-5 h-5 inline-block mr-2" />
              Hybrid Search
            </button>
          </div>

          {/* Item Type Filter */}
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setItemType('all')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                itemType === 'all'
                  ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setItemType('lost')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                itemType === 'lost'
                  ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Lost Only
            </button>
            <button
              onClick={() => setItemType('found')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                itemType === 'found'
                  ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Found Only
            </button>
          </div>

          <form onSubmit={handleSearch} className="space-y-6">
            {/* Text Input */}
            {(searchMode === 'text' || searchMode === 'hybrid') && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Describe what you're looking for
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={textQuery}
                    onChange={(e) => setTextQuery(e.target.value)}
                    className="input-field w-full pl-12"
                    placeholder="E.g., 'black wallet near library' or 'blue umbrella'"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-400">
                  💡 Tip: Use natural language. "Bottle" matches "Flask", "Specs" matches "Glasses"
                </p>
              </div>
            )}

            {/* Image Upload */}
            {(searchMode === 'image' || searchMode === 'hybrid') && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Upload an image {searchMode === 'hybrid' && '(optional)'}
                </label>

                {!imagePreview ? (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/20 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-300">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageSelect}
                    />
                  </label>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            {/* Search Button */}
            <button
              type="submit"
              disabled={isSearching || isUploading}
              className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Upload className="w-5 h-5 animate-pulse" />
                  <span>Uploading image...</span>
                </>
              ) : isSearching ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Searching with AI...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </>
              )}
            </button>
          </form>

          {/* Search Tips */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-300 mb-2">✨ How AI Search Works:</h4>
            <ul className="text-xs text-blue-400 space-y-1">
              <li>• Text search understands meaning: "flask" finds "water bottle"</li>
              <li>• Image search finds visually similar items</li>
              <li>• Hybrid search combines both for best results</li>
              <li>• Results ranked by AI similarity scores</li>
            </ul>
          </div>
        </div>

        {/* Results */}
        {searchPerformed && (
          <SearchResults
            results={results}
            isLoading={isSearching}
            searchQuery={textQuery}
            searchMode={searchMode}
          />
        )}
      </div>
    </div>
  );
};

export default SearchPage;

