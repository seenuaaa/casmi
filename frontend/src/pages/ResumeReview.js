import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  DocumentArrowDownIcon,
  PencilIcon,
  ShareIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const ResumeReview = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Mock resume data - in real app, this would come from Firebase
  const resumeData = {
    id: resumeId,
    name: 'Software Developer Resume',
    template: 'modern-tech',
    createdAt: new Date(),
    updatedAt: new Date(),
    downloadUrl: 'https://example.com/resume.pdf' // This would be the Firebase Storage URL
  };

  const handleDownload = async () => {
    setLoading(true);
    
    // In real implementation, this would:
    // 1. Generate the PDF using Firebase Functions
    // 2. Upload to Firebase Storage
    // 3. Return download URL
    
    setTimeout(() => {
      // Mock download
      const link = document.createElement('a');
      link.href = resumeData.downloadUrl;
      link.download = `${resumeData.name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setLoading(false);
    }, 2000);
  };

  const handleEdit = () => {
    navigate(`/resume/builder/${resumeData.template}?resumeId=${resumeId}`);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: resumeData.name,
        url: window.location.href
      });
    } catch (error) {
      // Fallback to copying link
      navigator.clipboard.writeText(window.location.href);
      alert('Resume link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <Link 
              to="/resume/templates" 
              className="text-indigo-400 hover:text-indigo-300 text-sm mb-2 inline-block"
            >
              ← Back to Templates
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">{resumeData.name}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Created: {resumeData.createdAt.toLocaleDateString()}</span>
              <span>Updated: {resumeData.updatedAt.toLocaleDateString()}</span>
              <span className="capitalize">{resumeData.template.replace('-', ' ')} Template</span>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleEdit}
              className="btn-secondary"
            >
              <PencilIcon className="w-5 h-5" />
              <span>Edit</span>
            </button>
            
            <button
              onClick={handleShare}
              className="btn-secondary"
            >
              <ShareIcon className="w-5 h-5" />
              <span>Share</span>
            </button>
            
            <button
              onClick={handleDownload}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <DocumentArrowDownIcon className="w-5 h-5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* PDF Preview */}
        <div className="card p-8 mb-8">
          <div className="text-center space-y-6">
            {/* PDF Placeholder */}
            <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-[8.5/11] bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <EyeIcon className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Resume Preview</h3>
                  <p>Your resume PDF would be displayed here</p>
                  <div className="mt-6 space-y-2 text-sm">
                    <div className="h-4 bg-gray-300 rounded mx-auto w-48"></div>
                    <div className="h-4 bg-gray-300 rounded mx-auto w-32"></div>
                    <div className="h-4 bg-gray-300 rounded mx-auto w-56"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm">
              This is a preview of your resume. Click "Download PDF" to get the final version.
            </p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <PencilIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-white mb-2">Edit Resume</h3>
            <p className="text-gray-400 text-sm mb-4">Make changes to your resume content and formatting</p>
            <button onClick={handleEdit} className="btn-secondary w-full">
              Edit Now
            </button>
          </div>
          
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <DocumentArrowDownIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-white mb-2">Download PDF</h3>
            <p className="text-gray-400 text-sm mb-4">Get a high-quality PDF version ready for applications</p>
            <button onClick={handleDownload} disabled={loading} className="btn-primary w-full">
              {loading ? 'Generating...' : 'Download'}
            </button>
          </div>
          
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ShareIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-white mb-2">Share Resume</h3>
            <p className="text-gray-400 text-sm mb-4">Share your resume link with potential employers</p>
            <button onClick={handleShare} className="btn-secondary w-full">
              Share Link
            </button>
          </div>
        </div>

        {/* Resume Stats */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Resume Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-400 mb-1">12</div>
              <div className="text-gray-400 text-sm">Total Downloads</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">5</div>
              <div className="text-gray-400 text-sm">Times Shared</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">3</div>
              <div className="text-gray-400 text-sm">Revisions Made</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">85%</div>
              <div className="text-gray-400 text-sm">ATS Score</div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="card p-6 mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">💡 Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-indigo-400">Application Tips:</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Tailor your resume for each job application</li>
                <li>• Use keywords from the job description</li>
                <li>• Keep your resume updated with recent achievements</li>
                <li>• Save in multiple formats (PDF, Word)</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-green-400">Interview Preparation:</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Review your resume before interviews</li>
                <li>• Prepare examples for each skill mentioned</li>
                <li>• Practice explaining your experience clearly</li>
                <li>• Bring printed copies to interviews</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeReview;