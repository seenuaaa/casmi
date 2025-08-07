import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  UserIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon,
  EyeIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const ResumeBuilder = () => {
  const { templateId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [currentSection, setCurrentSection] = useState('personal');
  const [resumeData, setResumeData] = useState({
    personal: {
      fullName: '',
      email: currentUser?.email || '',
      phone: '',
      location: '',
      linkedin: '',
      website: ''
    },
    summary: '',
    experience: [
      {
        id: 1,
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }
    ],
    education: [
      {
        id: 1,
        institution: '',
        degree: '',
        field: '',
        location: '',
        graduationDate: '',
        gpa: ''
      }
    ],
    skills: [],
    projects: [
      {
        id: 1,
        name: '',
        description: '',
        technologies: '',
        link: ''
      }
    ]
  });

  const [newSkill, setNewSkill] = useState('');

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: UserIcon },
    { id: 'summary', name: 'Summary', icon: DocumentTextIcon },
    { id: 'experience', name: 'Experience', icon: BriefcaseIcon },
    { id: 'education', name: 'Education', icon: AcademicCapIcon },
    { id: 'skills', name: 'Skills', icon: WrenchScrewdriverIcon },
    { id: 'projects', name: 'Projects', icon: DocumentTextIcon }
  ];

  const updatePersonalInfo = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  const updateSummary = (value) => {
    setResumeData(prev => ({ ...prev, summary: value }));
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const updateExperience = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now(),
      institution: '',
      degree: '',
      field: '',
      location: '',
      graduationDate: '',
      gpa: ''
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const updateEducation = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addProject = () => {
    const newProject = {
      id: Date.now(),
      name: '',
      description: '',
      technologies: '',
      link: ''
    };
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  const updateProject = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(project =>
        project.id === id ? { ...project, [field]: value } : project
      )
    }));
  };

  const removeProject = (id) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }));
  };

  const generateResume = async () => {
    // This would integrate with Firebase Functions to generate PDF
    alert('Resume generation feature will be implemented with Firebase Functions');
    navigate('/resume/review/sample-resume-id');
  };

  const renderPersonalSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Full Name *</label>
          <input
            type="text"
            value={resumeData.personal.fullName}
            onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
            className="input-field"
            required
          />
        </div>
        
        <div>
          <label className="label">Email *</label>
          <input
            type="email"
            value={resumeData.personal.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            className="input-field"
            required
          />
        </div>
        
        <div>
          <label className="label">Phone Number</label>
          <input
            type="tel"
            value={resumeData.personal.phone}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            className="input-field"
          />
        </div>
        
        <div>
          <label className="label">Location</label>
          <input
            type="text"
            value={resumeData.personal.location}
            onChange={(e) => updatePersonalInfo('location', e.target.value)}
            className="input-field"
            placeholder="City, State"
          />
        </div>
        
        <div>
          <label className="label">LinkedIn Profile</label>
          <input
            type="url"
            value={resumeData.personal.linkedin}
            onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
            className="input-field"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>
        
        <div>
          <label className="label">Website/Portfolio</label>
          <input
            type="url"
            value={resumeData.personal.website}
            onChange={(e) => updatePersonalInfo('website', e.target.value)}
            className="input-field"
            placeholder="https://yourwebsite.com"
          />
        </div>
      </div>
    </div>
  );

  const renderSummarySection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Professional Summary</h2>
      <div>
        <label className="label">Summary</label>
        <textarea
          value={resumeData.summary}
          onChange={(e) => updateSummary(e.target.value)}
          className="input-field resize-none"
          rows={6}
          placeholder="Write a brief professional summary highlighting your key skills and experience..."
        />
        <p className="text-xs text-gray-500 mt-1">2-4 sentences recommended</p>
      </div>
    </div>
  );

  const renderExperienceSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Work Experience</h2>
        <button onClick={addExperience} className="btn-primary">
          <PlusIcon className="w-5 h-5" />
          <span>Add Experience</span>
        </button>
      </div>
      
      {resumeData.experience.map((exp, index) => (
        <div key={exp.id} className="card p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Experience {index + 1}</h3>
            {resumeData.experience.length > 1 && (
              <button
                onClick={() => removeExperience(exp.id)}
                className="text-red-400 hover:text-red-300"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Company *</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="label">Position *</label>
              <input
                type="text"
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="label">Location</label>
              <input
                type="text"
                value={exp.location}
                onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="label">Start Date</label>
              <input
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="label">End Date</label>
              <input
                type="month"
                value={exp.endDate}
                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                className="input-field"
                disabled={exp.current}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={exp.current}
                onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
              />
              <label className="text-gray-300">Current Position</label>
            </div>
          </div>
          
          <div>
            <label className="label">Job Description</label>
            <textarea
              value={exp.description}
              onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
              className="input-field resize-none"
              rows={4}
              placeholder="Describe your responsibilities and achievements..."
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderSkillsSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Skills</h2>
      
      <div className="flex space-x-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
          className="input-field flex-1"
          placeholder="Add a skill (e.g., JavaScript, Python, etc.)"
        />
        <button onClick={addSkill} className="btn-primary">
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {resumeData.skills.map((skill, index) => (
          <div key={index} className="flex items-center space-x-2 bg-indigo-600 text-white px-3 py-1 rounded-lg">
            <span>{skill}</span>
            <button
              onClick={() => removeSkill(index)}
              className="text-white hover:text-red-300"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'personal':
        return renderPersonalSection();
      case 'summary':
        return renderSummarySection();
      case 'experience':
        return renderExperienceSection();
      case 'education':
        return renderEducationSection();
      case 'skills':
        return renderSkillsSection();
      case 'projects':
        return renderProjectsSection();
      default:
        return renderPersonalSection();
    }
  };

  const renderEducationSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Education</h2>
        <button onClick={addEducation} className="btn-primary">
          <PlusIcon className="w-5 h-5" />
          <span>Add Education</span>
        </button>
      </div>
      
      {resumeData.education.map((edu, index) => (
        <div key={edu.id} className="card p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Education {index + 1}</h3>
            {resumeData.education.length > 1 && (
              <button
                onClick={() => removeEducation(edu.id)}
                className="text-red-400 hover:text-red-300"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Institution *</label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="label">Degree *</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                className="input-field"
                placeholder="e.g., Bachelor of Science"
                required
              />
            </div>
            
            <div>
              <label className="label">Field of Study</label>
              <input
                type="text"
                value={edu.field}
                onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                className="input-field"
                placeholder="e.g., Computer Science"
              />
            </div>
            
            <div>
              <label className="label">Graduation Date</label>
              <input
                type="month"
                value={edu.graduationDate}
                onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderProjectsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Projects</h2>
        <button onClick={addProject} className="btn-primary">
          <PlusIcon className="w-5 h-5" />
          <span>Add Project</span>
        </button>
      </div>
      
      {resumeData.projects.map((project, index) => (
        <div key={project.id} className="card p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Project {index + 1}</h3>
            {resumeData.projects.length > 1 && (
              <button
                onClick={() => removeProject(project.id)}
                className="text-red-400 hover:text-red-300"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="label">Project Name *</label>
              <input
                type="text"
                value={project.name}
                onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="label">Technologies Used</label>
              <input
                type="text"
                value={project.technologies}
                onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                className="input-field"
                placeholder="e.g., React, Node.js, MongoDB"
              />
            </div>
            
            <div>
              <label className="label">Project Link</label>
              <input
                type="url"
                value={project.link}
                onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                className="input-field"
                placeholder="https://github.com/username/project"
              />
            </div>
            
            <div>
              <label className="label">Description</label>
              <textarea
                value={project.description}
                onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                className="input-field resize-none"
                rows={3}
                placeholder="Describe the project and your role..."
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Resume Builder</h1>
          <p className="text-gray-400 text-sm capitalize">{templateId.replace('-', ' ')} Template</p>
        </div>
        
        <nav className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setCurrentSection(section.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                currentSection === section.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <section.icon className="w-5 h-5" />
              <span>{section.name}</span>
            </button>
          ))}
        </nav>
        
        <div className="mt-8 pt-8 border-t border-gray-700 space-y-4">
          <button className="btn-secondary w-full">
            <EyeIcon className="w-5 h-5" />
            <span>Preview Resume</span>
          </button>
          
          <button onClick={generateResume} className="btn-primary w-full">
            <DocumentTextIcon className="w-5 h-5" />
            <span>Generate PDF</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {renderCurrentSection()}
      </div>
    </div>
  );
};

export default ResumeBuilder;