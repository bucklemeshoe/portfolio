'use client'
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/Container';
import { Navigation } from '@/components/Navigation';
import { ReferencesModal } from '@/components/ReferencesModal';
import { Footer } from '@/components/Footer';
import clsx from 'clsx';

// Import the data
import blogPosts from '@/data/blog-posts.json';
import caseStudies from '@/data/case-studies.json';

function WritingContent() {
  const searchParams = useSearchParams();
  const filterParam = searchParams?.get('filter');
  const [activeFilter, setActiveFilter] = useState(filterParam === 'case-studies' ? 'case-studies' : 'thoughts');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const extractExcerpt = (text: string, maxLength: number = 120) => {
    if (!text || typeof text !== 'string') return 'No description available';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const truncateTitle = (title: string, maxLength: number = 60) => {
    if (!title || typeof title !== 'string') return 'Untitled';
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength).trim() + '...';
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative z-10">
        {/* Navigation */}
        <Navigation />

        {/* Header */}
        <Container className="pt-16 pb-12">
          <div className="border border-gray-100 border-dashed rounded-lg p-6">
            <div className="flex items-center gap-4 mb-8">
              <Link 
                href="/"
                className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </div>
            
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl">
                Writing
              </h1>
              <p className="mt-6 text-base text-zinc-600">
                I&apos;ll write about crooked experiences (that could have been better), things I wish existed, and other stuff. Here are few of my older thoughts and case studies.
              </p>
            </div>
          </div>
        </Container>

        {/* Main Content */}
        <Container className="pb-24">
          <div className="border border-gray-100 border-dashed rounded-lg p-6">
            {/* Filter Buttons */}
            <div className="flex gap-2 mb-12">
              <button
                onClick={() => setActiveFilter('thoughts')}
                className={clsx(
                  'px-6 py-3 rounded-full text-sm font-medium transition',
                  activeFilter === 'thoughts'
                    ? 'bg-zinc-800 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                )}
              >
                Thoughts ({blogPosts.length})
              </button>
              <button
                onClick={() => setActiveFilter('case-studies')}
                className={clsx(
                  'px-6 py-3 rounded-full text-sm font-medium transition',
                  activeFilter === 'case-studies'
                    ? 'bg-zinc-800 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                )}
              >
                Case Studies ({caseStudies.length})
              </button>
            </div>

            {/* Content */}
            <div className="space-y-12">
              {activeFilter === 'thoughts' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {blogPosts.map((post) => (
                    <article key={post.id} className="group relative flex flex-col items-start border-b border-gray-100 pb-8 md:border-b-0">
                      <div className="relative z-10 flex items-center text-sm text-zinc-400 mb-3">
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 mr-2">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
                                className="fill-gradient-to-r from-pink-400 to-fuchsia-500" 
                                fill="url(#gradient)" />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#f472b6" />
                              <stop offset="100%" stopColor="#d946ef" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <time>{post.date ? formatDate(post.date) : 'No date available'}</time>
                      </div>
                      <h3 className="mt-2 text-xl font-semibold text-zinc-800 group-hover:text-zinc-600 transition-colors">
                        <Link href={`/thoughts/${post.id}`}>
                          <span className="absolute -inset-y-6 -inset-x-4 z-20 sm:-inset-x-6 sm:rounded-2xl" />
                          {truncateTitle(post.title === "Portfolio of Jared Buckley" 
                            ? post.content?.split('\n')[0] || post.title
                            : post.title, 80)}
                        </Link>
                      </h3>
                      <p className="relative z-10 mt-3 text-base text-zinc-600 leading-relaxed">
                        {extractExcerpt(post.content || '', 200)}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-sm text-zinc-500">
                        <span>Read more →</span>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {activeFilter === 'case-studies' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {caseStudies.map((study) => (
                    <article key={study.id} className="group relative flex flex-col items-start border-b border-gray-100 pb-8 md:border-b-0">
                      <div className="relative z-10 flex items-center text-sm text-zinc-400 mb-3">
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 mr-2">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
                                className="fill-gradient-to-r from-pink-400 to-fuchsia-500" 
                                fill="url(#gradient)" />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#f472b6" />
                              <stop offset="100%" stopColor="#d946ef" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <time>{study.publishedDate ? formatDate(study.publishedDate) : 'No date available'}</time>
                      </div>
                      <h3 className="mt-2 text-xl font-semibold text-zinc-800 group-hover:text-zinc-600 transition-colors">
                        <Link href={`/case-studies/${study.id}`}>
                          <span className="absolute -inset-y-6 -inset-x-4 z-20 sm:-inset-x-6 sm:rounded-2xl" />
                          {truncateTitle(study.title === "Portfolio of Jared Buckley" 
                            ? study.content?.main_content?.text?.split('\n')[0] || study.title
                            : study.title, 80)}
                        </Link>
                      </h3>
                      <p className="relative z-10 mt-3 text-base text-zinc-600 leading-relaxed">
                        {extractExcerpt(study.content?.main_content?.text || '', 200)}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-sm text-zinc-500">
                        <span>Read more →</span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>

        {/* Footer */}
        <Footer />

        {/* References Modal */}
        <ReferencesModal />
      </div>
    </div>
  );
}

export default function WritingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WritingContent />
    </Suspense>
  );
} 