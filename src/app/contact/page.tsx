'use client'
import { useState } from 'react';
import { Mail, MapPin, Clock, Calendar, Copy, Check, Linkedin } from 'lucide-react';
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

export default function ContactPage() {
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
      <div className="relative z-10">
        {/* Navigation */}
        <Navigation />

        {/* Header */}
        <Container className="pt-16 pb-12">
          <div className="border border-gray-100 border-dashed rounded-lg p-6">
            

            
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl">
                Howsit.
              </h1>
              <p className="mt-6 text-base text-zinc-600">
                I&apos;m always excited to connect with creative thinkers, practitioners, and entrepreneurs. Whether you have a project in mind, want to collaborate, or just want to chat about design and technology, (foooood) - I&apos;d love to hear from you.
              </p>
            </div>
          </div>
        </Container>

        {/* Contact Info */}
        <Container className="pb-24">
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Get in Touch */}
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

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-800">Response Time</h3>
                    <p className="text-zinc-600">Usually within 24 hours</p>
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

            {/* What I can help with */}
            <div className="border border-gray-100 border-dashed rounded-lg p-6">
              <h2 className="text-2xl font-bold text-zinc-800 mb-6">What I can help you with:</h2>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li>• Product Strategy / Design</li>
                <li>• Digital Business Strategy</li>
                <li>• Vibe Coding Workshops</li>
                <li>• Speaking engagements (Careers, Your Future)</li>
                <li>• Collaboration on interesting problems</li>
                <li>• Coffee chats (virtual or in-person)</li>
              </ul>
            </div>
          </div>
        </Container>

        {/* Footer */}
        <Footer />

        {/* Book An Appointment Button */}
        <a
          href="https://calendar.app.google/Tsy87Yfh5syUnHX4A"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-400 to-cyan-500 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium z-40"
        >
          <Calendar className="h-5 w-5" />
          <span className="hidden sm:inline">Book An Appointment</span>
        </a>
      </div>
    </div>
  );
} 