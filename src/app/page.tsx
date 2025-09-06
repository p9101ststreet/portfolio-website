'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getFeaturedProjects } from '@/lib/supabase';
import { Database } from '@/types/database';
import AIChat from '@/components/AIChat';

type Project = Database['public']['Tables']['projects']['Row'];

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const data = await getFeaturedProjects();
        setFeaturedProjects(data.slice(0, 3)); // Show only first 3 featured projects
      } catch (err) {
        console.error('Error fetching featured projects:', err);
      }
    };

    fetchFeaturedProjects();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              WOODY SOFTWARE
              <span className="block text-blue-600 dark:text-blue-400">
                DEVELOPMENT SERVICES
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Professional software development specializing in web applications, mobile apps, and AI-powered solutions.
              Expert in modern technologies and agile development practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/projects"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                View My Work
              </Link>
              <Link
                href="/contact"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Showcasing my expertise in modern web development
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <div
                key={project.id}
                className={`bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow ${
                  index === 2 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className="w-12 h-12 bg-blue-600 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {project.name.split(' ')[0].charAt(0)}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {project.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech_stack?.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech_stack && project.tech_stack.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded">
                      +{project.tech_stack.length - 3} more
                    </span>
                  )}
                </div>
                <Link
                  href="/projects"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Learn More →
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/projects"
              className="bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* AI Assistant CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ask My AI Assistant
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Have questions about my projects, tech stack, or experience? Chat with my AI assistant powered by advanced language models.
          </p>
          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Conversation
          </button>
        </div>
      </section>

      {/* AI Chat Modal */}
      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
