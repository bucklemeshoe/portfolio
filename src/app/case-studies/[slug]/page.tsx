import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Calendar, Clock } from "lucide-react";
import { Container } from "@/components/Container";
import { Navigation } from "@/components/Navigation";
import { ReferencesModal } from "@/components/ReferencesModal";
import { Footer } from "@/components/Footer";
import caseStudiesData from "@/data/case-studies.json";

interface CaseStudyData {
  id: string;
  title: string;
  url: string;
  publishedDate?: string;
  readingTime?: number;
  content?: {
    [key: string]: {
      text: string;
    };
  };
  images?: Array<{
    src: string;
    alt: string;
    title: string;
  }>;
  meta_description?: string;
}

interface CaseStudyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return caseStudiesData.map((caseStudy) => ({
    slug: caseStudy.id,
  }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = caseStudiesData.find((cs) => cs.id === slug);
  
  if (!caseStudy) {
    return {
      title: "Case Study Not Found",
    };
  }

  return {
    title: `${caseStudy.title} - Jared Buckley`,
    description: caseStudy.meta_description || `Case study: ${caseStudy.title}`,
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = caseStudiesData.find((cs) => cs.id === slug) as CaseStudyData | undefined;

  if (!caseStudy) {
    return (
      <div className="min-h-screen bg-white">
        <Container>
          <div className="max-w-3xl mx-auto py-16 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Case Study Not Found</h1>
            <p className="text-gray-600 mb-8">The case study you&apos;re looking for doesn&apos;t exist.</p>
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

  const getPublishedDate = () => {
    return caseStudy.publishedDate || 'No date available';
  };

  const getReadingTime = () => {
    if (caseStudy.readingTime) {
      return caseStudy.readingTime;
    }
    // Fallback to calculation if not provided
    const allContent = Object.values(caseStudy.content || {})
      .map((section) => section.text || '')
      .join(' ');
    const wordsPerMinute = 200;
    const wordCount = allContent.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
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
                    <span>Case Study</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full" />
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{getPublishedDate()}</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full" />
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{getReadingTime()} min read</span>
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {caseStudy.title}
                </h1>
                
                {caseStudy.meta_description && (
                  <p className="text-xl text-gray-600 leading-relaxed">
                    {caseStudy.meta_description}
                  </p>
                )}
              </header>

              {/* Main Image */}
              {caseStudy.images && caseStudy.images.length > 0 && (
                <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-12 bg-gray-50">
                  <Image
                    src={caseStudy.images[0].src}
                    alt={caseStudy.images[0].alt}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                {caseStudy.content && Object.entries(caseStudy.content).map(([key, value]) => (
                  <div key={key} className="mb-8">
                    {typeof value === 'object' && 'text' in value && (
                      <div>
                        {key !== 'main_content' && (
                          <h2 className="text-2xl font-bold mb-4 mt-8 capitalize text-zinc-900">
                            {key.replace(/_/g, ' ')}
                          </h2>
                        )}
                        <div 
                          className="text-gray-700 leading-relaxed whitespace-pre-wrap prose prose-gray max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: value.text
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\*(.*?)\*/g, '<em>$1</em>')
                              .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600">$1</blockquote>')
                              .replace(/^• (.+)$/gm, '<div class="flex items-start leading-tight"><span class="mr-2">•</span><span class="leading-tight">$1</span></div>')
                              .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<div class="my-8"><img src="$2" alt="$1" class="w-full h-auto rounded-lg shadow-md" /></div>')
                          }}
                        />
                        
                        {/* Contextual Images */}
                        {key === 'what_was_ecom_retailer_x' && caseStudy.images && caseStudy.images[1] && (
                          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mt-8 mb-8 bg-gray-50">
                            <Image
                              src={caseStudy.images[1].src}
                              alt={caseStudy.images[1].alt}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                        
                        {key === 'the_task' && caseStudy.images && caseStudy.images[2] && (
                          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mt-8 mb-8 bg-gray-50">
                            <Image
                              src={caseStudy.images[2].src}
                              alt={caseStudy.images[2].alt}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                        
                        {key === 'removing_every_engaging_thing' && caseStudy.images && caseStudy.images[3] && (
                          <div className="relative h-32 md:h-40 rounded-lg overflow-hidden mt-8 mb-8 bg-gray-50">
                            <Image
                              src={caseStudy.images[3].src}
                              alt={caseStudy.images[3].alt}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

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