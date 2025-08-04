'use client'
import Image from "next/image";
import Link from "next/link";
import { Linkedin, Copy, Check } from "lucide-react";
import { Container } from "@/components/Container";
import { Navigation } from "@/components/Navigation";
import { ReferencesModal } from "@/components/ReferencesModal";
import { Footer } from "@/components/Footer";
import clsx from "clsx";
import { useState } from "react";

// Import the data
import blogPosts from "@/data/blog-posts.json";
import caseStudies from "@/data/case-studies.json";


function UpworkIcon({ className }: { className?: string }) {
  return (
    <svg 
      fill="currentColor" 
      viewBox="0 0 32 32" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M24.75 17.542c-1.469 0-2.849-0.62-4.099-1.635l0.302-1.432 0.010-0.057c0.276-1.521 1.13-4.078 3.786-4.078 1.99 0 3.604 1.615 3.604 3.604 0 1.984-1.615 3.599-3.604 3.599zM24.75 6.693c-3.385 0-6.016 2.198-7.083 5.818-1.625-2.443-2.865-5.38-3.583-7.854h-3.646v9.484c-0.005 1.875-1.521 3.391-3.396 3.396-1.875-0.005-3.391-1.526-3.396-3.396v-9.484h-3.646v9.484c0 3.885 3.161 7.068 7.042 7.068 3.885 0 7.042-3.182 7.042-7.068v-1.589c0.708 1.474 1.578 2.974 2.635 4.297l-2.234 10.495h3.729l1.62-7.615c1.417 0.906 3.047 1.479 4.917 1.479 4 0 7.25-3.271 7.25-7.266 0-4-3.25-7.25-7.25-7.25z"/>
    </svg>
  );
}

function SocialLink({
  icon: Icon,
  href,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link> & {
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Link className="group -m-1 p-1" href={href} {...props}>
      <Icon className="h-6 w-6 text-zinc-500 transition group-hover:text-zinc-600" />
    </Link>
  )
}

function Photos() {
  const rotations = [
    'rotate-2',
    '-rotate-2',
    'rotate-2',
    'rotate-2',
    '-rotate-2',
  ]

  const images = [
    '/images/travel/IMG_1112.jpg',
    '/images/travel/IMG_3339.jpg',
    '/images/travel/IMG_2044.JPG.jpg',
    '/images/travel/IMG_1563.JPG.jpg',
    '/images/travel/IMG_2051.JPG.jpg',
  ]

  return (
    <div className="mt-16 sm:mt-20">
      <div className="-my-4 flex justify-center gap-5 overflow-hidden py-4 sm:gap-8">
        {images.map((image, imageIndex) => (
          <div
            key={image}
            className={clsx(
              'relative aspect-[9/10] w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 sm:w-72 sm:rounded-2xl',
              rotations[imageIndex % rotations.length]
            )}
          >
            <Image
              src={image}
              alt=""
              sizes="(min-width: 640px) 18rem, 11rem"
              className="absolute inset-0 h-full w-full object-cover"
              fill
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('thoughts');
  const [isCopied, setIsCopied] = useState(false);
  const [showAllJourney, setShowAllJourney] = useState(false);

  // Copy email to clipboard
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('jared@makefriendly.co.za');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email: ', err);
    }
  };

  // Helper function to format dates
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
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <Container className="mt-9">
        <div className="max-w-2xl border border-gray-100 border-dashed rounded-lg p-6">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl">
            Product designer, entrepreneur, and digital explorer.
          </h1>
          <p className="mt-6 text-base text-zinc-600">
            I&apos;m Jared, a digital product designer and entrepreneur based in Cape Town. I help companies and founders create digital products that people love to use. I care about great design, business impact, and making things that matter.
          </p>
          <div className="mt-6 flex gap-6">
            <SocialLink href="https://www.linkedin.com/in/jared-buckley-3a432733" aria-label="Follow on LinkedIn" icon={Linkedin} />
            <SocialLink href="https://www.upwork.com/freelancers/~01f0ea0ce42725cd71?companyReference=1392775927669170177&mp_source=share" aria-label="Hire on Upwork" icon={UpworkIcon} />
          </div>
        </div>
      </Container>

      {/* Photos Gallery */}
      <div className="border border-gray-100 border-dashed rounded-lg mx-6 my-8">
        <Photos />
      </div>

      {/* Main Content */}
      <Container className="mt-24 md:mt-28">
        <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2 border border-gray-100 border-dashed rounded-lg p-6">
          {/* Left Column - About */}
          <div className="flex flex-col gap-16 border-r border-gray-100 border-dashed pr-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-800 sm:text-3xl">
                About Me
              </h2>
              <p className="mt-6 text-base text-zinc-600">
                I love creating solutions that solve real problems and make people&apos;s lives easier. With over 15 years of experience, I&apos;ve worked with startups and established companies to design digital experiences that users love.
              </p>
              <p className="mt-4 text-base text-zinc-600">
                I believe great design happens when you truly understand your users (internal and external), their goals, and the problems they&apos;re trying to solve. That&apos;s why I spend time researching, testing, and iterating to create solutions that not only look good but actually work.
              </p>
              <p className="mt-4 text-base text-zinc-600">
                When I&apos;m not consulting to clients, you&apos;ll find me exploring new tech, playing padel, or working on my <Link href="https://tabboard.app" target="_blank" rel="noopener noreferrer" className="text-zinc-800 hover:text-zinc-900 underline decoration-zinc-300 hover:decoration-zinc-500 transition-colors">latest side project</Link>.
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 border-dashed -my-6"></div>
            
            {/* My Journey Timeline */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-800 sm:text-3xl mb-6">
                My Journey
              </h2>
                             <p className="text-base text-zinc-600 mb-8">
                 What a beautiful journey it&apos;s been to date. From humble beginnings in IT to building my own startups, working with international clients, and helping companies across the globe create meaningful digital experiences.
               </p>
              
                             <div className="space-y-4">
                <div className="bg-gradient-to-br from-pink-50 to-fuchsia-50 rounded-lg p-4 border border-pink-100">
                  <div className="flex items-start gap-3">
                    <Image src="/images/work/1 - makefriendly.jpg" alt="MakeFriendly" width={20} height={20} className="w-5 h-5 rounded-sm mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">MakeFriendly</h4>
                      <h5 className="text-sm font-medium text-gray-800 mt-1">Product Designer / Product Strategist</h5>
                      <p className="text-xs text-gray-500 mt-1">Nov 2019 - Present · 5 yrs 10 mos · Self-employed</p>
                      <p className="text-xs text-gray-500 mt-1">Cape Town & Global</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-fuchsia-50 rounded-lg p-4 border border-pink-100">
                  <div className="flex items-start gap-3">
                    <Image src="/images/work/2 - webtonic_solutions_logo.jpg" alt="Webtonic Solutions" width={20} height={20} className="w-5 h-5 rounded-sm mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Webtonic Solutions</h4>
                      <h5 className="text-sm font-medium text-gray-800 mt-1">Senior Product Designer</h5>
                      <p className="text-xs text-gray-500 mt-1">Oct 2021 - Jan 2024 · 2 yrs 4 mos · Contract</p>
                      <p className="text-xs text-gray-500 mt-1">Cape Town & Joburg</p>
                    </div>
                  </div>
                </div>

                <div className={`bg-gradient-to-br from-pink-50 to-fuchsia-50 rounded-lg p-4 border border-pink-100 ${!showAllJourney ? 'overflow-hidden' : ''}`} style={!showAllJourney ? { maxHeight: '120px' } : {}}>
                  <div className="flex items-start gap-3">
                    <Image src="/images/work/3 - epam_systems_logo.jpg" alt="EPAM Systems" width={20} height={20} className="w-5 h-5 rounded-sm mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">EPAM Systems (Burberry)</h4>
                      <h5 className="text-sm font-medium text-gray-800 mt-1">Senior UX/UI Designer</h5>
                      <p className="text-xs text-gray-500 mt-1">Jan 2023 - Sep 2023 · 9 mos · Contract</p>
                      <p className="text-xs text-gray-500 mt-1">Cape Town & Remote London</p>
                    </div>
                  </div>
                </div>

                {showAllJourney && (
                  <>
                    <div className="bg-gradient-to-br from-pink-50 to-fuchsia-50 rounded-lg p-4 border border-pink-100">
                      <div className="flex items-start gap-3">
                        <Image src="/images/work/4 - partnerpage_logo.jpg" alt="PartnerPage" width={20} height={20} className="w-5 h-5 rounded-sm mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">PartnerPage (Funded Startup SF, California)</h4>
                          <h5 className="text-sm font-medium text-gray-800 mt-1">Product Designer</h5>
                          <p className="text-xs text-gray-500 mt-1">Mar 2020 - Nov 2020 · 9 mos · Full-time</p>
                          <p className="text-xs text-gray-500 mt-1">Remote San Fran</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-pink-50 to-fuchsia-50 rounded-lg p-4 border border-pink-100">
                      <div className="flex items-start gap-3">
                        <Image src="/images/work/5 - voyya-logo.png" alt="Voyya" width={20} height={20} className="w-5 h-5 rounded-sm mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Voyya</h4>
                          <h5 className="text-sm font-medium text-gray-800 mt-1">UX/UI Designer</h5>
                          <p className="text-xs text-gray-500 mt-1">Jul 2017 - Apr 2019 · 1 yr 10 mos</p>
                          <p className="text-xs text-gray-500 mt-1">Mauritius</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-pink-50 to-fuchsia-50 rounded-lg p-4 border border-pink-100">
                      <div className="flex items-start gap-3">
                        <Image src="/images/work/6 - wetu_tourism_solutions_logo.jpg" alt="Wetu Travel Technology" width={20} height={20} className="w-5 h-5 rounded-sm mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Wetu Travel Technology</h4>
                          <h5 className="text-sm font-medium text-gray-800 mt-1">Head of Design</h5>
                          <p className="text-xs text-gray-500 mt-1">Sep 2015 - Dec 2016 · 1 yr 4 mos</p>
                          <p className="text-xs text-gray-500 mt-1">Claremont, Cape Town</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-pink-50 to-fuchsia-50 rounded-lg p-4 border border-pink-100">
                      <div className="flex items-start gap-3">
                        <Image src="/images/work/8 - pricecheck_logo.jpg" alt="PriceCheck" width={20} height={20} className="w-5 h-5 rounded-sm mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">PriceCheck</h4>
                          <h5 className="text-sm font-medium text-gray-800 mt-1">Interaction Designer</h5>
                          <p className="text-xs text-gray-500 mt-1">Sep 2013 - Aug 2015 · 2 yrs</p>
                          <p className="text-xs text-gray-500 mt-1">Adderly Str Cape Town</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {!showAllJourney && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setShowAllJourney(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-zinc-600 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors"
                  >
                    See All
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Right Column - Writing */}
          <div className="space-y-10 lg:pl-16 xl:pl-20">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-800 sm:text-3xl">
                Writing
              </h2>
              <p className="mt-6 text-base text-zinc-600">
                I&apos;ll write about crooked experiences (that could have been better), things I wish existed, and other stuff. Here are few of my older thoughts and case studies.
              </p>

                              {/* Filter Buttons */}
                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => setActiveFilter('thoughts')}
                    className={clsx(
                      'px-4 py-2 rounded-full text-sm font-medium transition',
                      activeFilter === 'thoughts'
                        ? 'bg-zinc-800 text-white'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    )}
                  >
                    Thoughts
                  </button>
                  <button
                    onClick={() => setActiveFilter('case-studies')}
                    className={clsx(
                      'px-4 py-2 rounded-full text-sm font-medium transition',
                      activeFilter === 'case-studies'
                        ? 'bg-zinc-800 text-white'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    )}
                  >
                    Case Studies
                  </button>
                </div>

                              {/* Content */}
                <div className="mt-6 space-y-6">
                  {activeFilter === 'thoughts' && (
                    <>
                      {blogPosts.slice(0, 3).map((post) => (
                        <article key={post.id} className="group relative flex flex-col items-start">
                          <div className="relative z-10 flex items-center text-xs text-zinc-400 mb-2">
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
                          <h3 className="mt-2 text-base font-semibold text-zinc-800">
                            <Link href={`/thoughts/${post.id}`}>
                              <span className="absolute -inset-y-6 -inset-x-4 z-20 sm:-inset-x-6 sm:rounded-2xl" />
                              {truncateTitle(post.title === "Portfolio of Jared Buckley" 
                                ? post.content?.split('\n')[0] || post.title
                                : post.title)}
                            </Link>
                          </h3>
                          <p className="relative z-10 mt-2 text-sm text-zinc-600">
                            {extractExcerpt(post.content || '')}
                          </p>
                        </article>
                      ))}
                      {blogPosts.length > 3 && (
                        <div className="mt-8 text-center">
                          <Link 
                            href="/writing"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-zinc-600 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors"
                          >
                            View all thoughts ({blogPosts.length})
                          </Link>
                        </div>
                      )}
                    </>
                  )}

                  {activeFilter === 'case-studies' && (
                    <>
                      {caseStudies.slice(0, 3).map((study) => (
                        <article key={study.id} className="group relative flex flex-col items-start">
                          <div className="relative z-10 flex items-center text-xs text-zinc-400 mb-2">
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
                          <h3 className="mt-6 text-base font-semibold text-zinc-800">
                            <Link href={`/case-studies/${study.id}`}>
                              <span className="absolute -inset-y-6 -inset-x-4 z-20 sm:-inset-x-6 sm:rounded-2xl" />
                              {truncateTitle(study.title === "Portfolio of Jared Buckley" 
                                ? study.content?.main_content?.text?.split('\n')[0] || study.title
                                : study.title)}
                            </Link>
                          </h3>
                          <p className="relative z-10 mt-2 text-sm text-zinc-600">
                            {extractExcerpt(study.content?.main_content?.text || '')}
                          </p>
                          <time className="relative z-10 mt-2 text-xs text-zinc-500">
                            {study.publishedDate ? formatDate(study.publishedDate) : 'No date available'}
                          </time>
                        </article>
                      ))}
                      {caseStudies.length > 3 && (
                        <div className="mt-8 text-center">
                          <Link 
                            href="/writing?filter=case-studies"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-zinc-600 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors"
                          >
                            View all case studies ({caseStudies.length})
                          </Link>
                        </div>
                      )}
                    </>
                  )}
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 border-dashed my-8"></div>

            {/* Get in Touch Card */}
            <div id="contact" className="rounded-2xl border border-zinc-100 p-6">
              <h2 className="flex text-sm font-semibold text-zinc-900">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6 flex-none">
                  <path d="M2.5 7.5L12 2l9.5 5.5v11L12 24l-9.5-5.5z" className="fill-zinc-100 stroke-zinc-400" />
                  <path d="M12 2v22" className="stroke-zinc-400" />
                  <path d="M2.5 7.5L12 13l9.5-5.5" className="stroke-zinc-400" />
                </svg>
                <span className="ml-3">Get in Touch</span>
              </h2>
              <p className="mt-2 text-sm text-zinc-600">
                I&apos;m always excited to work on new projects and collaborate with interesting people. Whether you need help with UX design, product strategy, or just want to chat about digital products, I&apos;d love to hear from you.
              </p>
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <a href="mailto:jared@makefriendly.co.za" className="text-sm font-medium text-zinc-900 hover:text-zinc-700 transition">
                    jared@makefriendly.co.za
                  </a>
                  <button
                    onClick={copyEmail}
                    className="group p-2 text-zinc-500 hover:text-zinc-700 transition-colors"
                    title="Copy email address"
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-3 py-1.5 bg-zinc-800 text-white text-sm font-medium rounded-md hover:bg-zinc-700 transition-colors w-full sm:w-auto"
                >
                  Contact me →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Footer */}
      <Footer />

      {/* References Modal */}
      <ReferencesModal />
    </div>
  );
}
