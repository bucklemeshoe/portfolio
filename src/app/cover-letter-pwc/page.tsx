'use client'
import { useState } from 'react';
import { Mail, MapPin, Copy, Check, Linkedin } from 'lucide-react';
import { Container } from '@/components/Container';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

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

export default function CoverLetterPWC() {
  const [isCopied, setIsCopied] = useState(false);

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

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <Container className="pt-16 pb-24">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Cover Letter Content */}
          <div className="border border-gray-100 border-dashed rounded-lg p-8 md:p-12">
            <div className="prose prose-zinc max-w-none">
              <div className="text-base text-zinc-700 leading-relaxed space-y-6">
                <p>Dear Hiring Team,</p>
                
                <p>
                  I&apos;m applying for the Senior Associate - Product Designer (Systems & Delivery) role because it sits right at the intersection of how I like to work: thoughtful systems, high craft, and designs that actually make it into production without losing their soul along the way.
                </p>
                
                <p>
                  Over the last several years, I&apos;ve spent most of my time designing inside complex, real-world systems - the kind where scale, consistency, and edge cases matter just as much as creativity. I&apos;ve worked on multi-stream marketplace platforms like Intengo, internal enterprise tooling for the FirstRand Group, and remote delivery projects for Burberry London, each requiring a strong systems mindset, close collaboration with engineers, and a deep respect for how design decisions play out downstream.
                </p>
                
                <p>
                  Alongside my design practice, I&apos;ve developed a strong ability to prototype and ship working solutions, not just concepts. In 2026, that often means moving fluidly between design and code - building high-fidelity prototypes, testing ideas in real environments, and in some cases shipping production-ready front-end code myself. This &quot;vibe coder&quot; approach allows me to validate ideas earlier and collaborate more effectively with engineers because I understand the practical trade-offs around performance, responsiveness, and implementation complexity.
                </p>
                
                <p>
                  What I enjoy most about systems-led work is turning complexity into something usable and repeatable. I care about design systems - not just how they look in Figma, but how they behave over time, how teams adopt them, and how reliably they support delivery. I&apos;m comfortable owning component libraries, documentation, and standards, and partnering closely with developers to ensure quality, accessibility, and consistency at scale.
                </p>
                
                <p>
                  I&apos;m detail-oriented, but not precious. I like shipping and solving the small, unglamorous problems that make products feel solid and trustworthy. I also enjoy stepping back to understand how a system fits into a wider business, how teams actually use it, and where structure can reduce friction rather than add process for its own sake.
                </p>
                
                <p>
                  The opportunity to work within SATIC while being closely integrated with the UK Design team genuinely excites me. I&apos;ve worked remotely across borders before and value shared rituals, critique, and collaboration as essential to maintaining quality and consistency. PwC&apos;s focus on human-led, technology-enabled work resonates strongly with me, and I&apos;d love to contribute to that mission.
                </p>
                
                <p>
                  For the past six years, I&apos;ve worked independently across a mix of short- and long-term engagements with agencies, product teams, and global clients. That path has given me broad exposure, strong delivery instincts, and a high level of ownership - but working within a large-scale consultancy like PwC has long been on my bucket list. I&apos;m excited by the opportunity to contribute my experience within a structured, multidisciplinary environment and deliver work at a scale and impact that only a firm like PwC can offer.
                </p>
                
                <p className="mt-8">
                  Kind regards,<br />
                  Jared
                </p>
              </div>
            </div>
          </div>

          {/* Contact Block */}
          <div className="border border-gray-100 border-dashed rounded-lg p-6">
            <h2 className="text-2xl font-bold text-zinc-800 mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-800">Email</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-zinc-600">jared@makefriendly.co.za</p>
                    <button
                      onClick={copyEmail}
                      className="group p-1 text-zinc-400 hover:text-zinc-600 transition-colors"
                      title="Copy email address"
                    >
                      {isCopied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-800">Location</h3>
                  <p className="text-zinc-600">Cape Town, South Africa</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100 border-dashed">
              <h3 className="font-semibold text-zinc-800 mb-4">Follow me</h3>
              <div className="flex gap-4">
                <SocialLink href="https://www.linkedin.com/in/jared-buckley-3a432733" aria-label="Follow on LinkedIn" icon={Linkedin} target="_blank" rel="noopener noreferrer" />
                <SocialLink href="https://www.upwork.com/freelancers/~01f0ea0ce42725cd71?companyReference=1392775927669170177&mp_source=share" aria-label="Hire on Upwork" icon={UpworkIcon} target="_blank" rel="noopener noreferrer" />
              </div>
            </div>
          </div>
        </div>
      </Container>
      
      <Footer />
    </div>
  );
}

