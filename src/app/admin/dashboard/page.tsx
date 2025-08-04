'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AuthService } from '@/lib/auth';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { 
  FileText, 
  PlusCircle, 
  CheckCircle,
  Upload,
  Search,
  Image as ImageIcon,
  Trash2,
  Eye,
  ArrowLeft
} from 'lucide-react';

// Import data
import blogPostsData from '@/data/blog-posts.json';
import caseStudiesData from '@/data/case-studies.json';

const user = {
  name: 'Jared Buckley',
  email: 'jared.buckley@email.com',
  imageUrl: '/big-mouth_bucklemeshoe_avatar_2.png',
};

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', current: true },
  { name: 'Media Bank', href: '/admin/media', current: false },
];

const userNavigation = [
  { name: 'View Site', href: '/', target: '_blank' },
  { name: 'Sign out', href: '#' },
];

function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface Post {
  id: string;
  title: string;
  date?: string;
  publishedDate?: string;
  type: 'thought' | 'case-study';
  excerpt?: string;
  readingTime?: number;
  tags?: string[];
}

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

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<'dashboard' | 'media-bank'>('dashboard');
  const [activeTab, setActiveTab] = useState<'all' | 'thoughts' | 'case-studies'>('all');
  
  // Media Bank state
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewingImage, setViewingImage] = useState<MediaItem | null>(null);

  useEffect(() => {
    // Check authentication on component mount
    if (!AuthService.isAuthenticated()) {
      window.location.href = '/admin';
      return;
    }
    setIsLoading(false);

    // Load media items when switching to media bank
    if (activeView === 'media-bank') {
      const savedMedia = localStorage.getItem('mediaItems');
      if (savedMedia) {
        setMediaItems(JSON.parse(savedMedia));
      } else {
        loadMockMedia();
      }
    }
  }, [activeView]);

  // Transform data to unified format
  const allPosts: Post[] = [
    ...blogPostsData.map(post => ({
      id: post.id,
      title: post.title,
      date: post.date,
      type: 'thought' as const,
      excerpt: post.excerpt,
      tags: post.tags
    })),
    ...caseStudiesData.map(caseStudy => ({
      id: caseStudy.id,
      title: caseStudy.title,
      publishedDate: caseStudy.publishedDate,
      type: 'case-study' as const,
      readingTime: caseStudy.readingTime
    }))
  ];

  // Filter posts based on active tab
  const filteredPosts = activeTab === 'all' 
    ? allPosts 
    : allPosts.filter(post => 
        activeTab === 'thoughts' ? post.type === 'thought' : post.type === 'case-study'
      );

  // Sort by date (newest first)
  const sortedPosts = filteredPosts.sort((a, b) => {
    const dateA = new Date(a.date || a.publishedDate || '');
    const dateB = new Date(b.date || b.publishedDate || '');
    return dateB.getTime() - dateA.getTime();
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Media Bank functions
  const loadMockMedia = () => {
    const mockMedia: MediaItem[] = [
      {
        id: '1',
        filename: 'ecommerce-interface.jpg',
        originalName: 'Ecom_Retailer_X_main_image.jpg',
        path: '/images/case-studies/Ecom_Retailer_X_main_image.jpg',
        size: 245760,
        uploadedAt: '2024-01-15T10:30:00Z',
        alt: 'E-commerce platform interface',
        tags: ['uploaded'],
        usageCount: 3
      },
      {
        id: '2',
        filename: 'takealot-screenshot.png',
        originalName: 'Screenshot+of+Takealot.png',
        path: '/images/case-studies/Screenshot+of+Takealot.png',
        size: 189440,
        uploadedAt: '2024-01-15T11:15:00Z',
        alt: 'Takealot.com homepage',
        tags: ['uploaded'],
        usageCount: 1
      },
      {
        id: '3',
        filename: 'crying-faces.png',
        originalName: 'Crying_faces.png',
        path: '/images/case-studies/Crying_faces.png',
        size: 102400,
        uploadedAt: '2024-01-15T12:00:00Z',
        alt: 'Crying faces illustration',
        tags: ['uploaded'],
        usageCount: 0
      }
    ];
    setMediaItems(mockMedia);
    localStorage.setItem('mediaItems', JSON.stringify(mockMedia));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadResults: MediaItem[] = [];
    const errors: string[] = [];

    try {
      // Process all files in parallel with individual error handling
      const uploadPromises = Array.from(files).map(async (file) => {
        try {
          // Validate file size
          if (file.size > 10 * 1024 * 1024) {
            errors.push(`${file.name} is too large. Maximum size is 10MB.`);
            return null;
          }

          // Validate file type
          if (!file.type.startsWith('image/')) {
            errors.push(`${file.name} is not a valid image file.`);
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

          const { path } = await response.json();

          const newItem: MediaItem = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            filename: file.name,
            originalName: file.name,
            path: path,
            size: file.size,
            uploadedAt: new Date().toISOString(),
            alt: file.name.replace(/\.[^/.]+$/, ''),
            tags: ['uploaded'],
            usageCount: 0
          };

          return newItem;
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
        const updatedItems = [...uploadResults, ...mediaItems];
        setMediaItems(updatedItems);
        localStorage.setItem('mediaItems', JSON.stringify(updatedItems));
      }

      // Show summary message
      if (uploadResults.length > 0 && errors.length === 0) {
        alert(`Successfully uploaded ${uploadResults.length} file${uploadResults.length > 1 ? 's' : ''}!`);
      } else if (uploadResults.length > 0 && errors.length > 0) {
        alert(`Uploaded ${uploadResults.length} file${uploadResults.length > 1 ? 's' : ''} successfully. ${errors.length} failed:\n${errors.join('\n')}`);
      } else if (errors.length > 0) {
        alert(`Upload failed:\n${errors.join('\n')}`);
      }

    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleDeleteSelected = () => {
    const updatedItems = mediaItems.filter(item => !selectedItems.includes(item.id));
    setMediaItems(updatedItems);
    setSelectedItems([]);
    localStorage.setItem('mediaItems', JSON.stringify(updatedItems));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStorageUsage = (): string => {
    try {
      const used = new Blob([localStorage.getItem('mediaItems') || '']).size;
      return formatFileSize(used);
    } catch {
      return 'Unknown';
    }
  };

  // Filter media based on search
  const filteredMedia = mediaItems.filter(item =>
    item.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.alt && item.alt.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  const handleSignOut = () => {
    AuthService.logout();
    window.location.href = '/admin';
  };

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
                  <button
                    key={item.name}
                    onClick={() => {
                      if (item.name === 'Dashboard') {
                        setActiveView('dashboard');
                      } else if (item.name === 'Media Bank') {
                        setActiveView('media-bank');
                      }
                    }}
                    aria-current={item.name === 'Dashboard' ? (activeView === 'dashboard' ? 'page' : undefined) : (activeView === 'media-bank' ? 'page' : undefined)}
                    className={classNames(
                      (item.name === 'Dashboard' && activeView === 'dashboard') || (item.name === 'Media Bank' && activeView === 'media-bank')
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                      'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium',
                    )}
                  >
                    {item.name}
                  </button>
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

      <div className="min-h-screen py-10 bg-white">
        <header>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {activeView === 'dashboard' ? 'Dashboard' : 'Media Bank'}
            </h1>
          </div>
        </header>
        <main className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
            {activeView === 'dashboard' ? (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  {/* Tabs Header */}
                  <div className="border-b border-gray-200 -mx-6 px-6 -mt-6 pt-6">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline">
                    <h3 className="text-base font-semibold text-gray-900">Writing</h3>
                    <div className="ml-10">
                      <nav className="-mb-px flex space-x-8">
                        <button
                          onClick={() => setActiveTab('all')}
                          aria-current={activeTab === 'all' ? 'page' : undefined}
                          className={classNames(
                            activeTab === 'all'
                              ? 'border-blue-500 text-gray-900'
                              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                            'border-b-2 px-1 pb-4 text-sm font-medium whitespace-nowrap',
                          )}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setActiveTab('thoughts')}
                          aria-current={activeTab === 'thoughts' ? 'page' : undefined}
                          className={classNames(
                            activeTab === 'thoughts'
                              ? 'border-blue-500 text-gray-900'
                              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                            'border-b-2 px-1 pb-4 text-sm font-medium whitespace-nowrap',
                          )}
                        >
                          Thoughts
                        </button>
                        <button
                          onClick={() => setActiveTab('case-studies')}
                          aria-current={activeTab === 'case-studies' ? 'page' : undefined}
                          className={classNames(
                            activeTab === 'case-studies'
                              ? 'border-blue-500 text-gray-900'
                              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                            'border-b-2 px-1 pb-4 text-sm font-medium whitespace-nowrap',
                          )}
                        >
                          Case Studies
                        </button>
                      </nav>
                    </div>
                  </div>
                  

                </div>
              </div>

              {/* Posts Grid */}
              <div className="p-6">
                                <div className="space-y-3">
                  {sortedPosts.map((post) => (
                    <div key={post.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          {/* Title */}
                          <h3 
                            className="text-base font-medium text-gray-900 mb-2 leading-tight" 
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical' as const,
                              overflow: 'hidden'
                            }}
                          >
                            {post.title}
                          </h3>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {/* Status */}
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              published
                            </span>
                            
                            {/* Date */}
                            <span>Date: {formatDate(post.date || post.publishedDate)}</span>
                            
                            {/* Tag */}
                            <span>Tag: {post.type === 'thought' ? 'Thought' : 'Case Study'}</span>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-2 ml-4">
                          <Link
                            href={`/admin/edit/${post.id}`}
                            className="inline-flex justify-center items-center px-2.5 py-1.5 border border-zinc-300 text-xs font-medium rounded-md text-zinc-700 bg-zinc-100 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
                          >
                            Edit
                          </Link>

                          <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 shadow-sm">
                            Publish
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Empty State */}
              {sortedPosts.length === 0 && (
                <div className="text-center py-12 px-6">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No posts found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new {activeTab === 'thoughts' ? 'thought' : activeTab === 'case-studies' ? 'case study' : 'post'}.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/admin/content"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 shadow-lg"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add new post
                    </Link>
                  </div>
                </div>
              )}
                </div>
              </div>
            ) : (
              // Media Bank Content
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  {/* Upload Section */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Upload Media</h2>
                      <p className="text-xs text-gray-500 mt-1">Storage used: {getStorageUsage()} • {mediaItems.length} items</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedItems.length > 0 && (
                        <button
                          onClick={handleDeleteSelected}
                          className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Selected ({selectedItems.length})
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-semibold text-gray-900">
                          {isUploading ? 'Processing...' : 'Upload images'}
                        </span>
                        <span className="mt-1 block text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB each • Images auto-compressed for storage
                        </span>
                      </label>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        className="sr-only"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                    </div>
                    {isUploading && (
                      <div className="mt-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-600 mx-auto"></div>
                        <p className="text-sm text-gray-500 mt-2">Generating thumbnails...</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search images by name, alt text, or tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Media Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredMedia.map((item) => (
                    <div
                      key={item.id}
                      className={`bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${
                        selectedItems.includes(item.id) ? 'ring-2 ring-pink-500' : 'border-gray-200'
                      }`}
                      onClick={() => {
                        if (selectedItems.includes(item.id)) {
                          setSelectedItems(prev => prev.filter(id => id !== item.id));
                        } else {
                          setSelectedItems(prev => [...prev, item.id]);
                        }
                      }}
                    >
                      {/* Image Preview */}
                      <div className="relative h-48 bg-gray-100">
                        {item.path.startsWith('data:') ? (
                          <img
                            src={item.path}
                            alt={item.alt || item.originalName}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <Image
                            src={item.path}
                            alt={item.alt || item.originalName}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover"
                            onError={() => {
                              console.log('Image failed to load:', item.path);
                            }}
                          />
                        )}
                        <div className="absolute top-2 right-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingImage(item);
                            }}
                            className="p-1 bg-white rounded shadow-sm hover:bg-gray-50"
                            title="View image"
                          >
                            <Eye className="h-3 w-3 text-gray-600" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Image Info */}
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 truncate" title={item.originalName}>
                          {item.originalName}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatFileSize(item.size)} • {formatDate(item.uploadedAt)}
                        </p>
                        {item.usageCount > 0 && (
                          <p className="text-xs text-pink-600 mt-1">
                            Used in {item.usageCount} post{item.usageCount !== 1 ? 's' : ''}
                          </p>
                        )}
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                            uploaded
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredMedia.length === 0 && (
                  <div className="text-center py-12">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No images found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm ? 'Try adjusting your search terms.' : 'Get started by uploading some images.'}
                    </p>
                  </div>
                )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      
      {/* Image Viewing Modal */}
      {viewingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{viewingImage.originalName}</h3>
                <p className="text-sm text-gray-500">
                  {formatFileSize(viewingImage.size)} • {formatDate(viewingImage.uploadedAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const markdown = `![${viewingImage.alt || viewingImage.originalName}](${viewingImage.path})`;
                    navigator.clipboard.writeText(markdown);
                  }}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  Copy Markdown
                </button>
                <button
                  onClick={() => setViewingImage(null)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-4 max-h-[70vh] overflow-auto">
              {viewingImage.path.startsWith('data:') ? (
                <img
                  src={viewingImage.path}
                  alt={viewingImage.alt || viewingImage.originalName}
                  className="max-w-full h-auto rounded-lg"
                />
              ) : (
                <Image
                  src={viewingImage.path}
                  alt={viewingImage.alt || viewingImage.originalName}
                  width={800}
                  height={600}
                  className="max-w-full h-auto rounded-lg"
                  style={{ objectFit: 'contain' }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}