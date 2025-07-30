// components/tailor/ComparisonView.tsx
import React, { useState } from 'react';

interface ResumeVersion {
  id: string;
  name: string;
  type: 'original' | 'tailored';
  sections: {
    summary: string;
    skills: string[];
    experience: string[];
    keywords: string[];
  };
  matchScore: number;
  lastModified: string;
}

interface ComparisonViewProps {
  className?: string;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ className }) => {
  const [selectedVersions, setSelectedVersions] = useState<[string, string]>(['original', 'tailored-v1']);

  const resumeVersions: ResumeVersion[] = [
    {
      id: 'original',
      name: 'Original Resume',
      type: 'original',
      sections: {
        summary: 'Experienced software developer with 5+ years in web development...',
        skills: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL'],
        experience: [
          'Developed web applications using React and Node.js',
          'Collaborated with cross-functional teams',
          'Implemented RESTful APIs'
        ],
        keywords: ['JavaScript', 'React', 'Node.js', 'API', 'Database']
      },
      matchScore: 65,
      lastModified: '2024-01-15'
    },
    {
      id: 'tailored-v1',
      name: 'Tailored for Frontend Developer',
      type: 'tailored',
      sections: {
        summary: 'Frontend-focused software developer with 5+ years specializing in React and modern JavaScript...',
        skills: ['React', 'JavaScript', 'TypeScript', 'CSS3', 'HTML5', 'Redux'],
        experience: [
          'Led frontend development using React and TypeScript',
          'Optimized application performance resulting in 40% faster load times',
          'Implemented responsive design principles'
        ],
        keywords: ['React', 'JavaScript', 'TypeScript', 'Frontend', 'Performance', 'Responsive']
      },
      matchScore: 89,
      lastModified: '2024-01-20'
    }
  ];

  const getVersionById = (id: string) => resumeVersions.find(v => v.id === id);

  const version1 = getVersionById(selectedVersions[0]);
  const version2 = getVersionById(selectedVersions[1]);

  const ComparisonSection = ({ title, content1, content2, type = 'text' }: {
    title: string;
    content1: string | string[];
    content2: string | string[];
    type?: 'text' | 'list';
  }) => (
    <div className="mb-6">
      <h4 className="font-semibold text-gray-700 mb-3">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h5 className="font-medium text-sm text-gray-600 mb-2">{version1?.name}</h5>
          {type === 'text' ? (
            <p className="text-sm text-gray-800">{content1}</p>
          ) : (
            <div className="flex flex-wrap gap-1">
              {(content1 as string[]).map((item, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h5 className="font-medium text-sm text-gray-600 mb-2">{version2?.name}</h5>
          {type === 'text' ? (
            <p className="text-sm text-gray-800">{content2}</p>
          ) : (
            <div className="flex flex-wrap gap-1">
              {(content2 as string[]).map((item, index) => (
                <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Resume Comparison</h2>
      
      {/* Version Selector */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Version 1</label>
            <select
              value={selectedVersions[0]}
              onChange={(e) => setSelectedVersions([e.target.value, selectedVersions[1]])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {resumeVersions.map(version => (
                <option key={version.id} value={version.id}>{version.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Version 2</label>
            <select
              value={selectedVersions[1]}
              onChange={(e) => setSelectedVersions([selectedVersions[0], e.target.value])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {resumeVersions.map(version => (
                <option key={version.id} value={version.id}>{version.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Match Score Comparison */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-controlling=50 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-3">Job Match Score</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{version1?.matchScore}%</div>
            <div className="text-sm text-gray-600">{version1?.name}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{version2?.matchScore}%</div>
            <div className="text-sm text-gray-600">{version2?.name}</div>
            {version2?.matchScore && version1?.matchScore && version2.matchScore > version1.matchScore && (
              <div className="text-xs text-green-600 font-medium">
                +{version2.matchScore - version1.matchScore}% improvement
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section-by-Section Comparison */}
      {version1 && version2 && (
        <div>
          <ComparisonSection
            title="Professional Summary"
            content1={version1.sections.summary}
            content2={version2.sections.summary}
          />
          
          <ComparisonSection
            title="Skills"
            content1={version1.sections.skills}
            content2={version2.sections.skills}
            type="list"
          />
          
          <ComparisonSection
            title="Key Experience Points"
            content1={version1.sections.experience}
            content2={version2.sections.experience}
            type="list"
          />
          
          <ComparisonSection
            title="Keywords"
            content1={version1.sections.keywords}
            content2={version2.sections.keywords}
            type="list"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6 pt-6 border-t">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Use Version 2
        </button>
        <button className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors">
          Create Hybrid Version
        </button>
        <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors">
          Export Comparison
        </button>
      </div>
    </div>
  );
};

export default ComparisonView;