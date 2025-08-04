import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, ExternalLink } from "lucide-react";
import { Container } from "@/components/Container";
import { Navigation } from "@/components/Navigation";
import { ReferencesModal } from "@/components/ReferencesModal";
import { Footer } from "@/components/Footer";
import blogPostsData from "@/data/blog-posts.json";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return blogPostsData.map((post) => ({
    slug: post.id,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPostsData.find((p) => p.id === slug);
  
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} - Jared Buckley`,
    description: post.excerpt || `Blog post: ${post.title}`,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPostsData.find((p) => p.id === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Container>
          <div className="max-w-3xl mx-auto py-16 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-8">The post you&apos;re looking for doesn&apos;t exist.</p>
            <Link 
              href="/" 
              className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return readTime;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative z-10">
        {/* Navigation */}
        <Navigation />

        {/* Page Header */}
        <Container className="pt-8 pb-4">
          <div className="border border-gray-100 border-dashed rounded-lg p-6">
            <div className="flex items-center gap-4">
              <Link 
                href="/writing" 
                className="inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Writing
              </Link>
            </div>
          </div>
        </Container>

        {/* Article */}
        <article className="py-16">
          <Container>
            <div className="max-w-4xl mx-auto border border-gray-100 border-dashed rounded-lg p-6">
              {/* Header */}
              <header className="mb-12">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center">
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
                    <span>Thoughts</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full" />
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{post.date ? formatDate(post.date) : 'No date available'}</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full" />
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{estimateReadTime(post.content || '')} min read</span>
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {post.title}
                </h1>
                
                {post.excerpt && (
                  <p className="text-xl text-gray-600 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
              </header>

              {/* Hero Image */}
              {post.heroImage && (
                <div className="mb-12">
                  <div className="relative w-full h-[calc(16rem+70px)] md:h-[calc(24rem+70px)] rounded-lg overflow-hidden">
                    <Image
                      src={post.heroImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    />
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                <div 
                  className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: (post.content || 'No content available for this post.')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600">$1</blockquote>')
                      .replace(/^• (.+)$/gm, '<div class="flex items-start leading-tight"><span class="mr-2">•</span><span class="leading-tight">$1</span></div>')
                      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<div class="my-8"><img src="$2" alt="$1" class="w-full h-auto rounded-lg shadow-md" /></div>')
                  }}
                />
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Original Post Link */}
              {post.url && (
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <Link
                    href={post.url}
                    className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read original post
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </Container>
        </article>

        {/* Navigation */}
        <section className="py-12 bg-gray-50">
          <Container>
            <div className="max-w-4xl mx-auto border border-gray-100 border-dashed rounded-lg p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Link
                  href="/writing"
                  className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Writing
                </Link>
                              <Link
                href="/contact"
                className="inline-flex items-center bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Get In Touch
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Footer */}
        <Footer />

        {/* References Modal */}
        <ReferencesModal />
      </div>
    </div>
  );
} 