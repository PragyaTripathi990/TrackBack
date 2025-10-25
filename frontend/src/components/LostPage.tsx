import React, { useState } from 'react';
import { ArrowLeft, Upload, Sparkles, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { items, upload } from '../lib/api';

interface LostPageProps {
  onBack: () => void;
}

const LostPage: React.FC<LostPageProps> = ({ onBack }) => {
  const { user, isAuthenticated } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const categories = [
    'Electronics',
    'Bags & Luggage',
    'Clothing',
    'Accessories',
    'Documents',
    'Keys',
    'Wallets & Purses',
    'Books & Stationery',
    'Sports Equipment',
    'Jewelry',
    'Other'
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      setError('Please sign in to report a lost item');
      return;
    }

    if (!title.trim() || !description.trim() || !location.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      let imageUrl: string | undefined;

      // Upload image if provided
      if (imageFile) {
        setIsUploading(true);
        const uploadResponse = await upload.image(imageFile);
        imageUrl = uploadResponse.data.data.url;
        setIsUploading(false);
      }

      // Create lost item
      await items.create({
        user_id: user.id,
        type: 'lost',
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        category: category || undefined,
        image_url: imageUrl,
        date_lost_or_found: new Date().toISOString(),
      });

      setSuccess(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setTitle('');
        setDescription('');
        setLocation('');
        setCategory('');
        setImageFile(null);
        setImagePreview(null);
        setSuccess(false);
        onBack();
      }, 2000);

    } catch (err: any) {
      console.error('Error submitting item:', err);
      setError(err.response?.data?.error || 'Failed to submit item. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <button
            onClick={onBack}
            className="mb-8 flex items-center gap-3 btn-secondary px-6 py-3"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </button>

          <div className="card text-center py-12">
            <div className="w-16 h-16 mx-auto mb-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Sign In Required</h2>
            <p className="text-gray-400 mb-6">
              You need to be signed in to report a lost item.
            </p>
            <button className="btn-primary">
              Sign In to Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="card text-center py-12 animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-gradient mb-4">Item Reported Successfully!</h2>
            <p className="text-gray-300 mb-6">
              Our AI is now searching for potential matches. We'll notify you if we find anything!
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Redirecting...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-3 btn-secondary px-6 py-3"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </button>

        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-4xl font-bold text-gradient mb-4">
            Report Lost Item
          </h2>
          <p className="text-lg text-gray-300">
            Provide details about your lost item. Our AI will search for potential matches!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-6 animate-fade-in">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Item Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="e.g., Black iPhone 14, Blue Backpack, Silver Watch"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Detailed Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="input-field resize-none"
              placeholder="Describe your lost item in detail - color, brand, distinctive features..."
              required
            />
            <p className="text-xs text-gray-400">
              💡 Tip: More details help our AI find better matches!
            </p>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Location Where Lost *
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input-field"
              placeholder="e.g., Main Library, 2nd Floor Reading Room"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Category (Optional)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Upload Reference Image (Optional)
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-white/30 transition-all duration-300 bg-white/5 hover:bg-white/10"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-300">
                      Click to upload a reference image
                    </span>
                    <p className="text-xs text-gray-500 mt-2">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                )}
              </label>
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors"
                >
                  ×
                </button>
              )}
            </div>
            <p className="text-xs text-gray-400">
              📸 Optional: Helps our AI find visually similar items
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Upload className="w-5 h-5 animate-pulse" />
                <span>Uploading image...</span>
              </>
            ) : isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating AI embeddings...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Report Lost Item</span>
                <Sparkles className="w-5 h-5" />
              </>
            )}
          </button>

          <p className="text-xs text-center text-gray-400">
            ⚡ Our AI will automatically search for matches and notify you!
          </p>
        </form>
      </div>
    </div>
  );
};

export default LostPage;
