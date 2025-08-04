'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Search, X, Eye, Upload } from 'lucide-react';

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  path: string;
  size: number;
  uploadedAt: string;
  alt?: string;
  tags?: string[];
  usageCount: number;
}

interface MediaBankPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (markdown: string) => void;
}

export default function MediaBankPopup({ isOpen, onClose, onSelect }: MediaBankPopupProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const popupRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadMediaItems();
      
      // Focus search input
      const searchInput = document.getElementById('media-search');
      if (searchInput) {
        searchInput.focus();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const loadMediaItems = async () => {
    try {
      // Try to load from localStorage first
      const savedMedia = localStorage.getItem('mediaItems');
      if (savedMedia) {
        const parsed = JSON.parse(savedMedia);
        setMediaItems(parsed);
        return;
      }

      // If no saved media, load existing images from public folder
      const existingImages: MediaItem[] = [
        {
          id: '1',
          filename: 'Ecom_Retailer_X_main_image.jpg',
          originalName: 'Ecom_Retailer_X_main_image.jpg',
          path: '/images/case-studies/Ecom_Retailer_X_main_image.jpg',
          size: 245760,
          uploadedAt: '2024-01-15T10:30:00Z',
          alt: 'E-commerce platform interface',
          tags: ['existing'],
          usageCount: 3
        },
        {
          id: '2',
          filename: 'Screenshot+of+Takealot.png',
          originalName: 'Screenshot of Takealot.png',
          path: '/images/case-studies/Screenshot+of+Takealot.png',
          size: 189440,
          uploadedAt: '2024-01-15T11:15:00Z',
          alt: 'Takealot.com homepage',
          tags: ['existing'],
          usageCount: 1
        },
        {
          id: '3',
          filename: 'Crying_faces.png',
          originalName: 'Crying_faces.png',
          path: '/images/case-studies/Crying_faces.png',
          size: 102400,
          uploadedAt: '2024-01-15T12:00:00Z',
          alt: 'Crying faces illustration',
          tags: ['existing'],
          usageCount: 2
        }
      ];
      
      setMediaItems(existingImages);
      localStorage.setItem('mediaItems', JSON.stringify(existingImages));
    } catch (error) {
      console.error('Error loading media items:', error);
      setMediaItems([]);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);
    const uploadResults: MediaItem[] = [];
    const errors: string[] = [];

    try {
      // Process all files in parallel with individual error handling
      const uploadPromises = Array.from(files).map(async (file) => {
        try {
          // Validate file type
          if (!file.type.startsWith('image/')) {
            errors.push(`${file.name} is not a valid image file`);
            return null;
          }

          // Validate file size (10MB limit)
          if (file.size > 10 * 1024 * 1024) {
            errors.push(`${file.name} is too large. Maximum file size is 10MB`);
            return null;
          }

          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('/api/upload-media', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Upload API Error:', response.status, errorText);
            errors.push(`Failed to upload ${file.name}: ${response.status}`);
            return null;
          }

          const result = await response.json();
          
          // Create media item
          const newMediaItem: MediaItem = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            filename: file.name.replace(/\s+/g, '-'),
            originalName: file.name,
            path: result.path,
            size: file.size,
            uploadedAt: new Date().toISOString(),
            alt: file.name.replace(/\.[^/.]+$/, ''), // Remove extension for alt text
            tags: ['uploaded'],
            usageCount: 0
          };

          return newMediaItem;
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          errors.push(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          return null;
        }
      });

      const results = await Promise.allSettled(uploadPromises);
      
      // Collect successful uploads
      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          uploadResults.push(result.value);
        }
      });

      // Update media items with successful uploads
      if (uploadResults.length > 0) {
        const updatedItems = [...mediaItems, ...uploadResults];
        setMediaItems(updatedItems);
        localStorage.setItem('mediaItems', JSON.stringify(updatedItems));
      }

      // Set error message if any files failed
      if (errors.length > 0) {
        if (uploadResults.length > 0) {
          setUploadError(`${uploadResults.length} file${uploadResults.length > 1 ? 's' : ''} uploaded successfully. ${errors.length} failed: ${errors.join(', ')}`);
        } else {
          setUploadError(errors.join(', '));
        }
      } else if (uploadResults.length > 0) {
        // Clear any previous errors on successful upload
        setUploadError(null);
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const filteredMedia = mediaItems.filter(item =>
    item.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.alt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelect = (item: MediaItem) => {
    const markdown = `![${item.alt || item.originalName}](${item.path})`;
    onSelect(markdown);
    onClose();
  };



  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        ref={popupRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Media Bank</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Search and Upload */}
        <div className="p-6 border-b border-gray-200 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="media-search"
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          
          {/* Upload Area */}
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-pink-400 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
            />
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Drag & drop images here, or{' '}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-pink-600 hover:text-pink-700 font-medium"
                disabled={isUploading}
              >
                browse files
              </button>
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
            {isUploading && (
              <div className="mt-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-500 mx-auto"></div>
                <p className="text-xs text-gray-600 mt-1">Uploading...</p>
              </div>
            )}
            {uploadError && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                {uploadError}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {filteredMedia.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No images found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleSelect(item)}
                >
                  {/* Image Preview */}
                  <div className="relative h-32 bg-gray-100">
                    <Image
                      src={item.path}
                      alt={item.alt || item.originalName}
                      fill
                      className="object-cover"
                      onError={() => {
                        console.log('Image failed to load:', item.path);
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Just select the image when clicking the eye button
                          handleSelect(item);
                        }}
                        className="p-1 bg-white rounded shadow-sm hover:bg-gray-50"
                        title="Insert image"
                      >
                        <Eye className="h-3 w-3 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Image Info */}
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm truncate" title={item.originalName}>
                      {item.originalName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatFileSize(item.size)}
                    </p>
                    {item.usageCount > 0 && (
                      <p className="text-xs text-pink-600 mt-1">
                        Used in {item.usageCount} post{item.usageCount !== 1 ? 's' : ''}
                      </p>
                    )}
                    <div className="mt-1">
                      {item.tags?.filter(tag => tag === 'uploaded').map((tag) => (
                        <span 
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs mr-1 bg-green-100 text-green-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {filteredMedia.length} image{filteredMedia.length !== 1 ? 's' : ''} found
            </p>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 