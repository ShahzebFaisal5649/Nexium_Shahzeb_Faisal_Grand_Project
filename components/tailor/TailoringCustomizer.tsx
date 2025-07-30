"use client";
// components/tailor/TailoringCustomizer.tsx
import React, { useState } from 'react';

interface CustomizationOptions {
  keywords: string[];
  skills: string[];
  experience: string[];
  tone: 'professional' | 'casual' | 'technical';
  format: 'chronological' | 'functional' | 'hybrid';
  sections: {
    summary: boolean;
    skills: boolean;
    experience: boolean;
    education: boolean;
    projects: boolean;
    certifications: boolean;
  };
}

interface TailoringCustomizerProps {
  className?: string;
  jobDescription?: string;
}

export const TailoringCustomizer: React.FC<TailoringCustomizerProps> = ({ className, jobDescription }) => {
  const [customization, setCustomization] = useState<CustomizationOptions>({
    keywords: ['JavaScript', 'React', 'Node.js'],
    skills: ['Frontend Development', 'API Integration', 'Database Design'],
    experience: ['Led development team', 'Improved performance by 40%', 'Implemented CI/CD'],
    tone: 'professional',
    format: 'chronological',
    sections: {
      summary: true,
      skills: true,
      experience: true,
      education: true,
      projects: true,
      certifications: false
    }
  });

  const [newKeyword, setNewKeyword] = useState('');
  const [newSkill, setNewSkill] = useState('');

  const addKeyword = () => {
    if (newKeyword.trim()) {
      setCustomization(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    setCustomization(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setCustomization(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setCustomization(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const toggleSection = (section: keyof CustomizationOptions['sections']) => {
    setCustomization(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: !prev.sections[section]
      }
    }));
  };

  const handleToneChange = (tone: CustomizationOptions['tone']) => {
    setCustomization(prev => ({ ...prev, tone }));
  };

  const handleFormatChange = (format: CustomizationOptions['format']) => {
    setCustomization(prev => ({ ...prev, format }));
  };

  const handleApplyCustomization = () => {
    console.log('Applying customization:', customization);
    // Add your customization logic here
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Resume Tailoring Customizer</h2>
      
      <div className="space-y-6">
        {/* Keywords Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Target Keywords</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {customization.keywords.map((keyword, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
              >
                {keyword}
                <button
                  onClick={() => removeKeyword(index)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="Add keyword..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
            />
            <button
              onClick={addKeyword}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Skills Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Emphasized Skills</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {customization.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center"
              >
                {skill}
                <button
                  onClick={() => removeSkill(index)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add skill..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
            <button
              onClick={addSkill}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Tone & Format */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Resume Tone</h3>
            <div className="space-y-2">
              {(['professional', 'casual', 'technical'] as const).map((tone) => (
                <label key={tone} className="flex items-center">
                  <input
                    type="radio"
                    name="tone"
                    checked={customization.tone === tone}
                    onChange={() => handleToneChange(tone)}
                    className="mr-2 text-blue-600"
                  />
                  <span className="capitalize">{tone}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Resume Format</h3>
            <div className="space-y-2">
              {(['chronological', 'functional', 'hybrid'] as const).map((format) => (
                <label key={format} className="flex items-center">
                  <input
                    type="radio"
                    name="format"
                    checked={customization.format === format}
                    onChange={() => handleFormatChange(format)}
                    className="mr-2 text-blue-600"
                  />
                  <span className="capitalize">{format}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Sections */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Include Sections</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(customization.sections).map(([section, enabled]) => (
              <label key={section} className="flex items-center">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => toggleSection(section as keyof CustomizationOptions['sections'])}
                  className="mr-2 text-blue-600"
                />
                <span className="capitalize">{section}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Job Description Analysis */}
        {jobDescription && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Job Description Insights</h3>
            <p className="text-sm text-gray-600 mb-3">
              Based on the job description, we recommend emphasizing these areas:
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">React.js</span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">Team Leadership</span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">Agile Development</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleApplyCustomization}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Apply Customization
          </button>
          <button className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors">
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
};

export default TailoringCustomizer;