'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AuthService } from '@/lib/auth';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { Save, Eye, ArrowLeft, Plus, X, Image as ImageIcon, PlusCircle, EyeOff } from 'lucide-react';
import MediaBankPopup from '@/components/MediaBankPopup';
import Toast from '@/components/Toast';


// Import data
import blogPostsData from '@/data/blog-posts.json';
import caseStudiesData from '@/data/case-studies.json';

const user = {
  name: 'Jared Buckley',
  email: 'jared.buckley@email.com',
  imageUrl: '/big-mouth_bucklemeshoe_avatar_2.png',
};

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', current: false },
  { name: 'Media Bank', href: '/admin/media', current: false },
];

const userNavigation = [
  { name: 'View Site', href: '/', target: '_blank' },
  { name: 'Sign out', href: '#' },
];

function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface EditFormData {
  title: string;
  contentType: 'thoughts' | 'case-studies';
  body: string;
  metaDescription: string;
  publishedDate: string;
  tags: string[];
  published: boolean;
  heroImage?: string;
  heroImageFit?: 'fit' | 'fill';
}

export default function EditPost() {
  const params = useParams();
  const postId = params?.id as string;
  
  const [formData, setFormData] = useState<EditFormData>({
    title: '',
    contentType: 'thoughts',
    body: '',
    metaDescription: '',
    publishedDate: new Date().toISOString().split('T')[0],
    tags: [],
    published: true,
    heroImage: '',
    heroImageFit: 'fill',
  });

  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [postFound, setPostFound] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isMediaBankOpen, setIsMediaBankOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning';
    isVisible: boolean;
  }>({ message: '', type: 'success', isVisible: false });


  useEffect(() => {
    // Check authentication on component mount
    if (!AuthService.isAuthenticated()) {
      window.location.href = '/admin';
      return;
    }
    setIsAuthenticating(false);

    // Load post data
    const thoughtPost = blogPostsData.find(post => post.id === postId);
    const caseStudyPost = caseStudiesData.find(post => post.id === postId);
    
    if (thoughtPost) {
      setFormData({
        title: thoughtPost.title,
        contentType: 'thoughts',
        body: thoughtPost.content,
        metaDescription: thoughtPost.excerpt || '',
        publishedDate: thoughtPost.date || new Date().toISOString().split('T')[0],
        tags: thoughtPost.tags || [],
        published: true,
      });
      setPostFound(true);
    } else if (caseStudyPost) {
      // Extract content from case study
      const contentText = Object.values(caseStudyPost.content || {})
        .map((section: { text?: string }) => section.text || '')
        .join('\n\n');
      
      // Get the first image as hero image
      const heroImage = caseStudyPost.images && caseStudyPost.images.length > 0 
        ? caseStudyPost.images[0].src 
        : '';
      
      setFormData({
        title: caseStudyPost.title,
        contentType: 'case-studies',
        body: contentText,
        metaDescription: caseStudyPost.meta_description || '',
        publishedDate: caseStudyPost.publishedDate || new Date().toISOString().split('T')[0],
        tags: [],
        published: true,
        heroImage: heroImage,
      });
      
      // Set image preview if hero image exists
      if (heroImage) {
        setImagePreview(heroImage);
      }
      
      setPostFound(true);
    }
  }, [postId]);

  const handleInputChange = (field: keyof EditFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        handleInputChange('heroImage', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ message, type, isVisible: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Show appropriate toast message
    if (formData.published) {
      showToast('Saved & Published successfully!', 'success');
    } else {
      showToast('Changes saved as draft!', 'success');
    }
    
    setIsLoading(false);
  };

  const handleUnpublish = async () => {
    setIsLoading(true);
    
    // Update to unpublished status
    handleInputChange('published', false);
    
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    showToast('Post unpublished successfully!', 'success');
    
    setIsLoading(false);
  };

  const handleSignOut = () => {
    AuthService.logout();
    window.location.href = '/admin';
  };

  const handleBodyChange = (value: string) => {
    // Check if user typed "/" to trigger media bank
    if (value.endsWith('/') && !formData.body.endsWith('/')) {
      setIsMediaBankOpen(true);
    }
    handleInputChange('body', value);
  };

  const handleMediaSelect = (markdown: string) => {
    // Remove the "/" and insert the markdown
    const newBody = formData.body.slice(0, -1) + markdown;
    handleInputChange('body', newBody);
  };



  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (!postFound) {
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
        
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-8">The post you&apos;re looking for doesn&apos;t exist.</p>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
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
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit Post</h1>
            </div>
          </div>
        </header>
        <main className="bg-white">
          <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">

                      <form onSubmit={handleSubmit} className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base/7 font-semibold text-gray-900">Content Information</h2>
                <p className="mt-1 text-sm/6 text-gray-600">
                  Edit the basic information about your post.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="col-span-full">
                    <label htmlFor="hero-image" className="block text-sm/6 font-medium text-gray-900">
                      Hero Image
                    </label>
                    <div className="mt-2">
                      <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                        <div className="space-y-1 text-center">
                          {imagePreview ? (
                            <div className="relative">
                              <Image
                                src={imagePreview}
                                alt="Preview"
                                width={128}
                                height={128}
                                className={`mx-auto h-32 w-auto rounded-lg ${formData.heroImageFit === 'fill' ? 'object-cover' : 'object-contain'}`}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setImagePreview(null);
                                  handleInputChange('heroImage', '');
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="flex text-sm text-gray-600">
                                <label
                                  htmlFor="file-upload"
                                  className="relative cursor-pointer rounded-md bg-white font-medium text-zinc-900 hover:text-zinc-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-pink-500 focus-within:ring-offset-2"
                                >
                                  <span>Upload a file</span>
                                  <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    className="sr-only"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Image Fit Option */}
                    {imagePreview && (
                      <div className="mt-4">
                        <label className="block text-sm/6 font-medium text-gray-900 mb-2">
                          Image Display
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="heroImageFit"
                              value="fill"
                              checked={formData.heroImageFit === 'fill'}
                              onChange={(e) => handleInputChange('heroImageFit', e.target.value)}
                              className="mr-2 text-pink-600 focus:ring-pink-500"
                            />
                            <span className="text-sm text-gray-700">Fill (crop to fit)</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="heroImageFit"
                              value="fit"
                              checked={formData.heroImageFit === 'fit'}
                              onChange={(e) => handleInputChange('heroImageFit', e.target.value)}
                              className="mr-2 text-pink-600 focus:ring-pink-500"
                            />
                            <span className="text-sm text-gray-700">Fit (show full image)</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                <div className="col-span-full">
                  <label htmlFor="title" className="block text-sm/6 font-medium text-gray-900">
                    Title *
                  </label>
                  <div className="mt-2">
                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-pink-600 sm:text-sm/6"
                      placeholder="Enter post title..."
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="content-type" className="block text-sm/6 font-medium text-gray-900">
                    Content Type
                  </label>
                  <div className="mt-2 grid grid-cols-1">
                    <select
                      id="content-type"
                      name="content-type"
                      value={formData.contentType}
                      onChange={(e) => handleInputChange('contentType', e.target.value as 'thoughts' | 'case-studies')}
                      className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-pink-600 sm:text-sm/6"
                    >
                      <option value="thoughts">Thoughts</option>
                      <option value="case-studies">Case Studies</option>
                    </select>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="published-date" className="block text-sm/6 font-medium text-gray-900">
                    Published Date
                  </label>
                  <div className="mt-2">
                    <input
                      id="published-date"
                      name="published-date"
                      type="date"
                      value={formData.publishedDate}
                      onChange={(e) => handleInputChange('publishedDate', e.target.value)}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-pink-600 sm:text-sm/6"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-900/10 pb-12">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base/7 font-semibold text-gray-900">Content Body</h2>
                  <p className="mt-1 text-sm/6 text-gray-600">
                    Edit your content here. You can use markdown formatting.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4 mr-1 inline" />
                  {previewMode ? 'Edit' : 'Preview'}
                </button>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-full">
                  <label htmlFor="content" className="block text-sm/6 font-medium text-gray-900">
                    Content *
                  </label>
                  <div className="mt-2">
                    {previewMode ? (
                      <div className="block w-full rounded-md bg-gray-50 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 min-h-[500px]">
                        <div className="prose prose-gray max-w-none">
                          <h1>{formData.title || 'Your Title Here'}</h1>
                          <div 
                            dangerouslySetInnerHTML={{ 
                              __html: formData.body.replace(/\n/g, '<br/>') || 'Your content will appear here...' 
                            }} 
                          />
                        </div>
                      </div>
                    ) : (
                      <textarea
                        id="content"
                        name="content"
                        rows={20}
                        value={formData.body}
                        onChange={(e) => handleBodyChange(e.target.value)}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-pink-600 sm:text-sm/6 font-mono"
                        placeholder="Write your content here... Type '/' to insert images from Media Bank"
                        required
                      />
                    )}
                  </div>
                  <p className="mt-3 text-sm/6 text-gray-600">
                    Supports markdown formatting. Use **bold**, *italic*, # headings, etc.
                  </p>
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800 font-medium mb-1">📸 Adding Images:</p>
                    <p className="text-xs text-blue-700">
                      Type <code className="bg-blue-100 px-1 rounded">/</code> to open Media Bank, or use markdown syntax: <code className="bg-blue-100 px-1 rounded">![Alt text](/images/path/to/image.jpg)</code>
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Example: <code className="bg-blue-100 px-1 rounded">![E-commerce interface](/images/case-studies/Ecom_Retailer_X_main_image.jpg)</code>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base/7 font-semibold text-gray-900">Meta Information</h2>
              <p className="mt-1 text-sm/6 text-gray-600">
                Information for search engines and social media sharing.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-full">
                  <label htmlFor="meta-description" className="block text-sm/6 font-medium text-gray-900">
                    Meta Description *
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="meta-description"
                      name="meta-description"
                      rows={3}
                      value={formData.metaDescription}
                      onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-pink-600 sm:text-sm/6"
                      placeholder="Brief description for search engines and social media (max 160 characters)"
                      maxLength={160}
                      required
                    />
                  </div>
                  <p className="mt-3 text-sm/6 text-gray-600">
                    {formData.metaDescription.length}/160 characters
                  </p>
                </div>

                {formData.contentType === 'thoughts' && (
                  <div className="col-span-full">
                    <label htmlFor="tags" className="block text-sm/6 font-medium text-gray-900">
                      Tags
                    </label>
                    <div className="mt-2">
                      <div className="flex gap-2 mb-3">
                        <input
                          id="tags"
                          name="tags"
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-pink-600 sm:text-sm/6"
                          placeholder="Add a tag and press Enter"
                        />
                        <button
                          type="button"
                          onClick={handleAddTag}
                          className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="text-pink-600 hover:text-pink-800"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="mt-3 text-sm/6 text-gray-600">
                      Add tags to help categorize and organize your content.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <Link 
                href="/admin/dashboard"
                className="text-sm/6 font-semibold text-gray-900"
              >
                Cancel
              </Link>
              
              {/* Show Unpublish button if post is currently published */}
              {formData.published && (
                <button
                  type="button"
                  onClick={handleUnpublish}
                  disabled={isLoading}
                  className="rounded-md bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 shadow-xs ring-1 ring-red-300 ring-inset hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <EyeOff className="h-4 w-4 mr-1 inline" />
                  {isLoading ? 'Unpublishing...' : 'Unpublish'}
                </button>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4 mr-1 inline" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
          </div>
        </main>
      </div>
      
      {/* Media Bank Popup */}
      <MediaBankPopup
        isOpen={isMediaBankOpen}
        onClose={() => setIsMediaBankOpen(false)}
        onSelect={handleMediaSelect}
      />
      
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
}