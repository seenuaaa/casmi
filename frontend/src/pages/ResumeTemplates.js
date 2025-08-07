import React from 'react';
import { Link } from 'react-router-dom';
import { DocumentTextIcon, StarIcon } from '@heroicons/react/24/outline';

const templates = [
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    description: 'Clean, professional design perfect for software developers and tech professionals',
    preview: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=300&h=400&fit=crop&crop=top',
    popular: true,
    features: ['ATS-friendly', 'Tech-focused sections', 'Skills showcase', 'Project highlights']
  },
  {
    id: 'classic-professional',
    name: 'Classic Professional',
    description: 'Traditional format that works well for all industries and experience levels',
    preview: 'https://images.unsplash.com/photo-1586281011021-8b0f0c1c3c55?w=300&h=400&fit=crop&crop=top',
    popular: false,
    features: ['Universal format', 'Experience-focused', 'Education section', 'References included']
  },
  {
    id: 'creative-designer',
    name: 'Creative Designer',
    description: 'Stylish template with visual elements, ideal for designers and creative roles',
    preview: 'https://images.unsplash.com/photo-1586281380923-9b9c4e0c4c4c?w=300&h=400&fit=crop&crop=top',
    popular: false,
    features: ['Visual portfolio section', 'Creative layout', 'Color accents', 'Skills visualization']
  },
  {
    id: 'minimal-elegant',
    name: 'Minimal Elegant',
    description: 'Simple, elegant design that lets your content shine through',
    preview: 'https://images.unsplash.com/photo-1586281380817-f7a8b3c3c3c3?w=300&h=400&fit=crop&crop=top',
    popular: true,
    features: ['Clean typography', 'Plenty of white space', 'Focus on content', 'Professional appearance']
  },
  {
    id: 'executive-premium',
    name: 'Executive Premium',
    description: 'Sophisticated template for senior-level and executive positions',
    preview: 'https://images.unsplash.com/photo-1586281380711-f2a2b4c4c4c4?w=300&h=400&fit=crop&crop=top',
    popular: false,
    features: ['Executive summary', 'Achievement highlights', 'Premium styling', 'Leadership focus']
  },
  {
    id: 'student-graduate',
    name: 'Student & Graduate',
    description: 'Perfect for students, recent graduates, and entry-level professionals',
    preview: 'https://images.unsplash.com/photo-1586281380605-f3a3b5c5c5c5?w=300&h=400&fit=crop&crop=top',
    popular: true,
    features: ['Education emphasis', 'Internship sections', 'Skills development', 'Fresh graduate friendly']
  }
];

const ResumeTemplates = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Resume Template</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Select from our professionally designed templates to create a standout resume that gets you noticed
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {templates.map((template) => (
            <div key={template.id} className="group">
              <div className="card p-6 hover:bg-gray-750 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
                {/* Template Preview */}
                <div className="relative mb-6 overflow-hidden rounded-xl">
                  <img
                    src={template.preview}
                    alt={`${template.name} template preview`}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {template.popular && (
                    <div className="absolute top-3 right-3 bg-yellow-500 text-gray-900 px-2 py-1 rounded-lg text-xs font-bold flex items-center space-x-1">
                      <StarIcon className="w-3 h-3" />
                      <span>Popular</span>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Template Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {template.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-300">Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {template.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-lg"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    to={`/resume/builder/${template.id}`}
                    className="btn-primary w-full text-center"
                  >
                    <DocumentTextIcon className="w-5 h-5" />
                    <span>Use This Template</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="card p-8 text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Why Choose Our Resume Builder?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto">
                <DocumentTextIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-white">Professional Templates</h3>
              <p className="text-gray-400 text-sm">Designed by HR experts and hiring managers</p>
            </div>
            
            <div className="space-y-2">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto">
                <StarIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-white">ATS Optimized</h3>
              <p className="text-gray-400 text-sm">Pass through applicant tracking systems</p>
            </div>
            
            <div className="space-y-2">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto">
                <DocumentTextIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-white">PDF Export</h3>
              <p className="text-gray-400 text-sm">Download high-quality PDF resumes instantly</p>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="card p-8">
          <h2 className="text-xl font-bold text-white mb-4">💡 Resume Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-indigo-400">Do's:</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Use action verbs (achieved, implemented, led)</li>
                <li>• Quantify your accomplishments with numbers</li>
                <li>• Tailor your resume to each job application</li>
                <li>• Keep it to 1-2 pages maximum</li>
                <li>• Use consistent formatting throughout</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-red-400">Don'ts:</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Use personal pronouns (I, me, my)</li>
                <li>• Include outdated or irrelevant information</li>
                <li>• Use fancy fonts or excessive colors</li>
                <li>• Include references (say "available upon request")</li>
                <li>• Submit without proofreading for errors</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeTemplates;