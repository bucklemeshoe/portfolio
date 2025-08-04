'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AuthService } from '@/lib/auth';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ArrowLeft, Upload, Search, Eye, Trash2, PlusCircle } from 'lucide-react';

const user = {
  name: 'Jared Buckley',
  email: 'jared.buckley@email.com',
  imageUrl: '/big-mouth_bucklemeshoe_avatar_2.png',
};

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', current: false },
  { name: 'Media Bank', href: '/admin/media', current: true },
];

const userNavigation = [
  { name: 'View Site', href: '/', target: '_blank' },
  { name: 'Sign out', href: '#' },
];

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

function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default function MediaBankPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    // Check authentication on component mount
    if (!AuthService.isAuthenticated()) {
      window.location.href = '/admin';
      return;
    }
    setIsAuthenticating(false);
    loadMediaItems();
  }, []);

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

  const deleteMediaItem = (id: string) => {
    const updatedItems = mediaItems.filter(item => item.id !== id);
    setMediaItems(updatedItems);
    localStorage.setItem('mediaItems', JSON.stringify(updatedItems));
  };

  const copyToClipboard = (item: MediaItem) => {
    const markdown = `![${item.alt || item.originalName}](${item.path})`;
    navigator.clipboard.writeText(markdown);
    // Could add a toast notification here
  };

  const handleSignOut = () => {
    AuthService.logout();
    window.location.href = '/admin';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredMedia = mediaItems.filter(item =>
    item.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.alt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <Disclosure as="nav" className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 justify-between">
            <div className="flex">
              <div className="flex shrink-0 items-center">
                <div className="bg-gradient-to-tr from-pink-400 via-pink-300 to-fuchsia-500 p-1 rounded-full block lg:hidden">
                  <Image
                    alt="Jared Buckley"
                    src="/big-mouth_bucklemeshoe_avatar_2.png"
                    width={48}
                    height={48}
                    className="rounded-full object-cover bg-white"
                  />
                </div>
                <div className="bg-gradient-to-tr from-pink-400 via-pink-300 to-fuchsia-500 p-1 rounded-full hidden lg:block">
                  <Image
                    alt="Jared Buckley"
                    src="/big-mouth_bucklemeshoe_avatar_2.png"
                    width={48}
                    height={48}
                    className="rounded-full object-cover bg-white"
                  />
                </div>
              </div>
              <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                      item.current
                        ? 'border-pink-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                      'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium',
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {/* Add New Button */}
              <Link
                href="/admin/content"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 mr-4 shadow-lg"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add new
              </Link>

              <button
                type="button"
                className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:outline-hidden"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="size-6" />
              </button>

              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <MenuButton className="relative flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-hidden focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <div className="size-8 rounded-full bg-zinc-700 flex items-center justify-center text-white text-sm font-semibold">
                    JB
                  </div>
                </MenuButton>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  {userNavigation.map((item) => (
                    <MenuItem key={item.name}>
                      {item.name === 'Sign out' ? (
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                        >
                          {item.name}
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          target={item.target}
                          className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                        >
                          {item.name}
                        </Link>
                      )}
                    </MenuItem>
                  ))}
                </MenuItems>
              </Menu>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              {/* Mobile menu button */}
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:outline-hidden">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
              </DisclosureButton>
            </div>
          </div>
        </div>

        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 pt-2 pb-3">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as={Link}
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800',
                  'block border-l-4 py-2 pr-4 pl-3 text-base font-medium',
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-4 pb-3">
            <div className="flex items-center px-4">
              <div className="shrink-0">
                <div className="size-10 rounded-full bg-zinc-700 flex items-center justify-center text-white text-sm font-semibold">
                  JB
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user.name}</div>
                <div className="text-sm font-medium text-gray-500">{user.email}</div>
              </div>
              <button
                type="button"
                className="relative ml-auto shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:outline-hidden"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-3 space-y-1">
              {userNavigation.map((item) => (
                item.name === 'Sign out' ? (
                  <DisclosureButton
                    key={item.name}
                    as="button"
                    onClick={handleSignOut}
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 w-full text-left"
                  >
                    {item.name}
                  </DisclosureButton>
                ) : (
                  <DisclosureButton
                    key={item.name}
                    as={Link}
                    href={item.href}
                    target={item.target}
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                    {item.name}
                  </DisclosureButton>
                )
              ))}
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>

      <div className="py-10 bg-white">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Link href="/admin/dashboard" className="text-zinc-600 hover:text-zinc-900 transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">Media Bank</h1>
            </div>
          </div>
        </header>
        
        <main className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {/* Upload Area */}
            <div className="mb-8">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-400 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Images</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Drag & drop images here, or{' '}
                  <label htmlFor="file-upload" className="text-pink-600 hover:text-pink-700 font-medium cursor-pointer">
                    browse files
                  </label>
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                {isUploading && (
                  <div className="mt-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500 mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-2">Uploading...</p>
                  </div>
                )}
                {uploadError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    {uploadError}
                  </div>
                )}
              </div>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Media Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Image Preview */}
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={item.path}
                      alt={item.alt || item.originalName}
                      fill
                      className="object-cover"
                      onError={() => {
                        console.log('Image failed to load:', item.path);
                      }}
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        onClick={() => copyToClipboard(item)}
                        className="p-1 bg-white rounded shadow-sm hover:bg-gray-50"
                        title="Copy markdown"
                      >
                        <Eye className="h-3 w-3 text-gray-600" />
                      </button>
                      {item.tags?.includes('uploaded') && (
                        <button
                          onClick={() => deleteMediaItem(item.id)}
                          className="p-1 bg-white rounded shadow-sm hover:bg-red-50"
                          title="Delete image"
                        >
                          <Trash2 className="h-3 w-3 text-red-600" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Image Info */}
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 text-sm truncate mb-2" title={item.originalName}>
                      {item.originalName}
                    </h3>
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                      <span>{formatFileSize(item.size)}</span>
                      <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
                    </div>
                    {item.usageCount > 0 && (
                      <p className="text-xs text-pink-600 mb-2">
                        Used in {item.usageCount} post{item.usageCount !== 1 ? 's' : ''}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {item.tags?.filter(tag => tag === 'uploaded').map((tag) => (
                        <span 
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredMedia.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No images found</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}