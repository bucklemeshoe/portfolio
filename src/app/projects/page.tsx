'use client'
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Container } from "@/components/Container";
import { Navigation } from "@/components/Navigation";
import { ReferencesModal } from "@/components/ReferencesModal";
import { Footer } from "@/components/Footer";
import projects from "@/data/projects.json";
import { useState } from "react";

interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  githubUrl?: string;
  icon: string;
  iconType: 'emoji' | 'image';
  image?: string;
  color: string;
  category: 'projects' | 'tools';
  year?: number;
  type?: 'concept' | 'product';
}

// Tool Card Component (original design)
function ToolCard({ project }: { project: Project }) {
  return (
    <div className="group relative flex flex-col items-start">
      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 group-hover:shadow-lg group-hover:shadow-zinc-800/10 transition-all duration-200">
        {project.iconType === 'image' ? (
          <Image
            src={project.icon}
            alt={project.title}
            width={24}
            height={24}
            className="rounded"
          />
        ) : (
          <div className={`text-2xl bg-gradient-to-br ${project.color} bg-clip-text text-transparent`}>
            {project.icon}
          </div>
        )}
      </div>
      <h3 className="mt-6 text-base font-semibold text-zinc-800 truncate">
        <Link href={project.url} className="absolute inset-0" target="_blank" rel="noopener noreferrer" />
        {project.title}
      </h3>
      <p className="mt-2 text-sm text-zinc-600 relative z-10">{project.description}</p>
      <div className="mt-4 flex items-center text-sm text-zinc-500 relative z-10">
        <ExternalLink className="h-4 w-4 mr-1" />
        <Link href={project.url} className="hover:text-zinc-700 transition-colors" target="_blank" rel="noopener noreferrer">
          Open site
        </Link>
      </div>
    </div>
  );
}

// Project Card Component (new visual design)
function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={project.image!}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        {/* Year pill */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-zinc-800 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
          {project.year}
        </div>
      </div>
      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-lg font-semibold text-zinc-800 mb-2 truncate">
          {(project.id === 'intergate-immigration' || 
            project.id === 'intergate-emigration' || 
            project.id === 'notnormal-friday-five') && (
            <Link href={project.url} className="absolute inset-0" target="_blank" rel="noopener noreferrer" />
          )}
          {project.title}
        </h3>
        <p className="text-sm text-zinc-600 flex-1 relative z-10">{project.description}</p>
        <div className="mt-4 flex items-center justify-between text-sm text-zinc-500 relative z-10">
          <div className="flex items-center">
            <span>#{project.type}</span>
          </div>
          {(project.id === 'intergate-immigration' || 
            project.id === 'intergate-emigration' || 
            project.id === 'notnormal-friday-five') && (
            <Link 
              href={project.url} 
              className="flex items-center hover:text-zinc-700 transition-colors"
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              <span>View Live</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// Empty Tool Card Component (placeholder)
function EmptyToolCard() {
  return (
    <div className="group relative flex flex-col items-start p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 border-dashed rounded-lg hover:from-gray-100 hover:to-gray-200 hover:border-gray-300 transition-all duration-200">
      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 group-hover:shadow-md transition-all duration-200">
        <div className="text-2xl">🛠️</div>
      </div>
      <h3 className="mt-6 text-base font-semibold text-zinc-800">
        <Link href="/contact" className="absolute inset-0" />
        Want me to build something?
      </h3>
      <p className="mt-2 text-sm text-zinc-600 relative z-10">Got a project in mind? Let&apos;s chat about creating custom tools and solutions!</p>
      <div className="mt-4 flex items-center text-sm relative z-10">
        <Link
          href="/contact"
          className="inline-flex items-center px-3 py-1 bg-zinc-800 text-white rounded-md hover:bg-zinc-700 transition-colors font-medium"
        >
          Contact me →
        </Link>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState<'tools' | 'projects'>('projects');
  const [showTooltip, setShowTooltip] = useState(false);

  const filteredProjects = (projects as Project[])
    .filter(project => project.category === activeTab)
    .sort((a, b) => {
      // Sort by year in descending order (latest to oldest)
      if (activeTab === 'projects') {
        return (b.year || 0) - (a.year || 0);
      }
      return 0; // No sorting for tools
    });

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
                Things I&apos;ve built - for others, by my own{' '}
                <span 
                  className="relative inline-block cursor-help border-b border-dotted border-zinc-400"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  volition
                  {showTooltip && (
                    <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 px-3 py-2 bg-zinc-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-50">
                      the faculty or power of using one&apos;s will
                      <span className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-zinc-900"></span>
                    </span>
                  )}
                </span>.
              </h1>
              <p className="mt-6 text-base text-zinc-600">
                Over the years, I&apos;ve poured my energy into bringing other people&apos;s visions to life. These are some of the projects I&apos;m most proud of - crafted with care, shared with pride.
              </p>
              <p className="mt-4 text-base text-zinc-600">
                But now, I&apos;m shifting gears. Watch this space <em>- because it&apos;s time to build my own dreams.</em>
              </p>
            </div>
          </div>
        </Container>

        {/* Tabbed Navigation */}
        <Container className="pb-8">
          <div className="border border-gray-100 border-dashed rounded-lg p-6">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 w-fit">
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'projects'
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => setActiveTab('tools')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'tools'
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Tools
              </button>
            </div>
          </div>
        </Container>

        {/* Projects Grid */}
        <Container className="pb-24">
          <div className="border border-gray-100 border-dashed rounded-lg p-6">
            <div className={`grid gap-8 ${
              activeTab === 'projects' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}>
              {filteredProjects.map((project) => (
                activeTab === 'projects' ? (
                  <ProjectCard key={project.id} project={project} />
                ) : (
                  <ToolCard key={project.id} project={project} />
                )
              ))}
              {activeTab === 'tools' && (
                <EmptyToolCard />
              )}
            </div>
            {filteredProjects.length === 0 && activeTab === 'projects' && (
              <div className="text-center py-12">
                <p className="text-zinc-500">No projects found.</p>
              </div>
            )}
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