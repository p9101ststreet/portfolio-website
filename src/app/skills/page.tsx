'use client';

import { useEffect, useState } from 'react';
import { getSkills } from '@/lib/supabase';
import { Database } from '@/types/database';

type Skill = Database['public']['Tables']['skills']['Row'];

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getSkills();
        setSkills(data);
      } catch (err) {
        setError('Failed to load skills');
        console.error('Error fetching skills:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const categories = ['Frontend', 'Backend', 'Database', 'Backend-as-a-Service', 'Styling', 'Version Control', 'Cloud', 'DevOps', 'AI', 'Mobile', 'Project Management'];

  const getProficiencyColor = (level: number) => {
    if (level >= 5) return 'bg-green-500';
    if (level >= 4) return 'bg-blue-500';
    if (level >= 3) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getProficiencyLabel = (level: number) => {
    if (level >= 5) return 'Expert';
    if (level >= 4) return 'Advanced';
    if (level >= 3) return 'Intermediate';
    return 'Beginner';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Technical Skills
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive expertise across modern web development technologies and methodologies
          </p>
        </div>

        {/* Skills by Category */}
        {categories.map((category) => {
          const categorySkills = skills.filter(skill => skill.category === category);

          return (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                {category}
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.name}
                    className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {skill.name}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium text-white rounded ${getProficiencyColor(skill.proficiency_level)}`}>
                        {getProficiencyLabel(skill.proficiency_level)}
                      </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      {skill.name} - {skill.category} expertise
                    </p>

                    {/* Proficiency Bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProficiencyColor(skill.proficiency_level)}`}
                        style={{ width: `${(skill.proficiency_level / 5) * 100}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>Proficiency</span>
                      <span>{skill.proficiency_level}/5</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Summary Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Skills Overview
          </h2>

          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {skills.filter(s => s.proficiency_level >= 5).length}
              </div>
              <div className="text-gray-600 dark:text-gray-300">Expert Level</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {skills.filter(s => s.proficiency_level >= 4).length}
              </div>
              <div className="text-gray-600 dark:text-gray-300">Advanced Level</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {categories.length}
              </div>
              <div className="text-gray-600 dark:text-gray-300">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {skills.length}
              </div>
              <div className="text-gray-600 dark:text-gray-300">Total Skills</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Work Together?
            </h2>
            <p className="text-blue-100 mb-6">
              Let's leverage these skills to bring your project vision to life.
            </p>
            <a
              href="/contact"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Start a Project
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
