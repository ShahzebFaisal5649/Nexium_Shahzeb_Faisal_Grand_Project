// components/tailor/ApplicationLinker.tsx
import React, { useState } from 'react';

interface JobApplication {
  id: string;
  company: string;
  position: string;
  status: 'applied' | 'interviewing' | 'offer' | 'rejected';
  appliedDate: string;
  resumeVersion: string;
  jobUrl?: string;
}

interface ApplicationLinkerProps {
  className?: string;
}

export const ApplicationLinker: React.FC<ApplicationLinkerProps> = ({ className }) => {
  const [applications, setApplications] = useState<JobApplication[]>([
    {
      id: '1',
      company: 'TechCorp Inc.',
      position: 'Frontend Developer',
      status: 'interviewing',
      appliedDate: '2024-01-20',
      resumeVersion: 'Frontend Tailored v1',
      jobUrl: 'https://example.com/job1'
    },
    {
      id: '2',
      company: 'StartupXYZ',
      position: 'Full Stack Developer',
      status: 'applied',
      appliedDate: '2024-01-18',
      resumeVersion: 'Full Stack Tailored v2'
    },
    {
      id: '3',
      company: 'Enterprise Solutions',
      position: 'Senior React Developer',
      status: 'offer',
      appliedDate: '2024-01-15',
      resumeVersion: 'React Specialist v1'
    }
  ]);

  const [newApplication, setNewApplication] = useState({
    company: '',
    position: '',
    jobUrl: '',
    resumeVersion: 'Original Resume'
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddApplication = () => {
    if (newApplication.company && newApplication.position) {
      const application: JobApplication = {
        id: Date.now().toString(),
        company: newApplication.company,
        position: newApplication.position,
        status: 'applied',
        appliedDate: new Date().toISOString().split('T')[0],
        resumeVersion: newApplication.resumeVersion,
        jobUrl: newApplication.jobUrl || undefined
      };
      
      setApplications(prev => [application, ...prev]);
      setNewApplication({ company: '', position: '', jobUrl: '', resumeVersion: 'Original Resume' });
      setShowAddForm(false);
    }
  };

  const updateApplicationStatus = (id: string, status: JobApplication['status']) => {
    setApplications(prev =>
      prev.map(app => app.id === id ? { ...app, status } : app)
    );
  };

  const getStatusColor = (status: JobApplication['status']) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'interviewing': return 'bg-yellow-100 text-yellow-800';
      case 'offer': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const resumeVersions = [
    'Original Resume',
    'Frontend Tailored v1',
    'Full Stack Tailored v2',
    'React Specialist v1',
    'Backend Focused v1'
  ];

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Application Tracker</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Link New Application
        </button>
      </div>

      {/* Add Application Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-4">Link New Application</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Company Name"
              value={newApplication.company}
              onChange={(e) => setNewApplication(prev => ({ ...prev, company: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Position Title"
              value={newApplication.position}
              onChange={(e) => setNewApplication(prev => ({ ...prev, position: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="url"
              placeholder="Job URL (optional)"
              value={newApplication.jobUrl}
              onChange={(e) => setNewApplication(prev => ({ ...prev, jobUrl: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={newApplication.resumeVersion}
              onChange={(e) => setNewApplication(prev => ({ ...prev, resumeVersion: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {resumeVersions.map(version => (
                <option key={version} value={version}>{version}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddApplication}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Add Application
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Applications List */}
      <div className="space-y-4">
        {applications.map(application => (
          <div key={application.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{application.position}</h3>
                <p className="text-gray-600">{application.company}</p>
                <p className="text-sm text-gray-500">Applied: {new Date(application.appliedDate).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(application.status)}`}>
                {application.status}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">Resume Used:</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  {application.resumeVersion}
                </span>
              </div>
              
              {application.jobUrl && (
                <a
                  href={application.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  View Job Posting
                </a>
              )}
            </div>
            
            <div className="flex gap-2 mt-4">
              <select
                value={application.status}
                onChange={(e) => updateApplicationStatus(application.id, e.target.value as JobApplication['status'])}
                className="text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
              
              <button className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition-colors">
                Add Note
              </button>
              
              <button className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition-colors">
                View Resume
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Statistics */}
      <div className="mt-6 pt-6 border-t">
        <h3 className="font-semibold text-gray-700 mb-3">Application Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {applications.filter(app => app.status === 'applied').length}
            </div>
            <div className="text-sm text-gray-600">Applied</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {applications.filter(app => app.status === 'interviewing').length}
            </div>
            <div className="text-sm text-gray-600">Interviewing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {applications.filter(app => app.status === 'offer').length}
            </div>
            <div className="text-sm text-gray-600">Offers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{applications.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationLinker;