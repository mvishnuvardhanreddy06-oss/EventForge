import React, { useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Star } from 'lucide-react';

const SAMPLE_VENUE_IMAGES = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&auto=format&fit=crop'
];

const VenueImageUpload = ({ images = [], onChange }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Convert local files to object URLs or base64 preview
    const newUrls = files.map((file) => URL.createObjectURL(file));
    onChange([...images, ...newUrls]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (indexToRemove) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetPrimary = (index) => {
    if (index === 0) return;
    const target = images[index];
    const rest = images.filter((_, idx) => idx !== index);
    onChange([target, ...rest]);
  };

  const handleAddSample = (sampleUrl) => {
    if (!images.includes(sampleUrl)) {
      onChange([...images, sampleUrl]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-bold text-slate-700">
            Venue Images
          </label>
          <p className="text-[11px] text-slate-400">
            Recommended: 1600 × 900 px (16:9 ratio). Upload high-resolution photos of halls, seating & exterior.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-slate-500">
          {images.length} {images.length === 1 ? 'image' : 'images'} added
        </span>
      </div>

      {/* Upload Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/60 hover:bg-blue-50/20 rounded-2xl p-4 text-center cursor-pointer transition-all duration-200 group"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/*"
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-3 rounded-full bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-700">
              Click to upload or drag & drop venue photos
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              PNG, JPG, WebP up to 10MB each
            </p>
          </div>
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {images.map((imgUrl, idx) => (
            <div
              key={idx}
              className="relative group/thumb rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100"
            >
              <img
                src={imgUrl}
                alt={`Venue preview ${idx + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Primary Image Badge */}
              {idx === 0 && (
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold flex items-center space-x-1 shadow-2xs">
                  <Star className="w-2.5 h-2.5 fill-current" />
                  <span>Primary</span>
                </div>
              )}

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                {idx !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(idx)}
                    className="p-1.5 rounded-lg bg-white/90 text-slate-800 hover:bg-white text-[10px] font-bold transition-transform hover:scale-105"
                    title="Set as primary cover"
                  >
                    Set Primary
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-transform hover:scale-105"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Sample Presets */}
      <div className="pt-1 flex items-center space-x-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase">
          Quick Samples:
        </span>
        <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5">
          {SAMPLE_VENUE_IMAGES.map((sampleUrl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAddSample(sampleUrl)}
              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 transition-colors shrink-0"
            >
              + Photo {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VenueImageUpload;
