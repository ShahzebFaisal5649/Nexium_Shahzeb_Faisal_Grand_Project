"use client";
// components/tailor/KeywordAnalysis.tsx
import React, { useState } from 'react';

interface KeywordData {
  keyword: string;
  frequency: number;
  importance: 'high' | 'medium' | 'low';
  present: boolean;
  category: 'technical' | 'soft' | 'industry' | 'role';
}

interface KeywordAnalysisProps {
  className?: string;
  jobDescription?: string;
}

export const KeywordAnalysis: React.FC<KeywordAnalysisProps> = ({ className }) => {
  const [analysisData] = useState<KeywordData[]>([
    { keyword: 'React', frequency: 8, importance: 'high', present: true, category: 'technical' },
    { keyword: 'JavaScript', frequency: 12, importance: 'high', present: true, category: 'technical' },
    { keyword: 'TypeScript', frequency: 5, importance: 'high', present: false, category: 'technical' },
    { keyword: 'Node.js', frequency: 4, importance: 'medium', present: true, category: 'technical' },
    { keyword: 'Leadership', frequency: 3, importance: 'medium', present: false, category: 'soft' },
    { keyword: 'Agile', frequency: 6, importance: 'medium', present: true, category: 'industry' },
    { keyword: 'Team Collaboration', frequency: 4, importance: 'medium', present: true, category: 'soft' },
    { keyword: 'Problem Solving', frequency: 2, importance: 'low', present: true, category: 'soft' }
  ]);

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showMissing, setShowMissing] = useState(false);

  const filteredKeywords = analysisData.filter(keyword => {
    const categoryMatch = filterCategory === 'all' || keyword.category === filterCategory;
    const presenceMatch = !showMissing || !keyword.present;
    return categoryMatch && presenceMatch;
  });

  const getImportanceColor = (importance: KeywordData['importance']) => {
    switch (importance) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getCategoryColor = (category: KeywordData['category']) => {
    switch (category) {
      case 'technical': return 'bg-blue-100 text-blue-800';
      case 'soft': return 'bg-purple-100 text-purple-800';
      case 'industry': return 'bg-orange-100 text-orange-800';
      case 'role': return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: analysisData.length,
    present: analysisData.filter(k => k.present).length,
    missing: analysisData.filter(k => !k.present).length,
    highImportance: analysisData.filter(k => k.importance === 'high').length
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Keyword Analysis</h2>
      
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-blue-800">Total Keywords</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{stats.present}</div>
          <div className="text-sm text-green-800">Present</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-600">{stats.missing}</div>
          <div className="text-sm text-red-800">Missing</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.highImportance}</div>
          <div className="text-sm text-purple-800">High Priority</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          <option value="technical">Technical</option>
          <option value="soft">Soft Skills</option>
          <option value="industry">Industry</option>
          <option value="role">Role-specific</option>
        </select>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showMissing}
            onChange={(e) => setShowMissing(e.target.checked)}
            className="mr-2 text-blue-600"
          />
          Show only missing keywords
        </label>
      </div>

      {/* Keywords List */}
      <div className="space-y-3">
        {filteredKeywords.map((keyword, index) => (
          <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-800">{keyword.keyword}</span>
                <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(keyword.category)}`}>
                  {keyword.category}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Frequency: {keyword.frequency}x
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getImportanceColor(keyword.importance)}`}>
                {keyword.importance} priority
              </span>
              <div className={`w-3 h-3 rounded-full ${keyword.present ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`text-sm font-medium ${keyword.present ? 'text-green-600' : 'text-red-600'}`}>
                {keyword.present ? 'Present' : 'Missing'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">Recommendations</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Add "TypeScript" to your skills section - it appears 5 times in the job description</li>
          <li>• Include "Leadership" experience in your work history</li>
          <li>• Consider adding specific examples of problem-solving achievements</li>
        </ul>
      </div>
    </div>
  );
};

export default KeywordAnalysis;