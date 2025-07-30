"use client";
// components/tailor/ImprovementSuggestions.tsx
import React, { useState } from 'react';

interface Suggestion {
  id: string;
  type: 'keyword' | 'skill' | 'experience' | 'format' | 'content';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  applied: boolean;
  suggestion: string;
}

interface ImprovementSuggestionsProps {
  className?: string;
}

export const ImprovementSuggestions: React.FC<ImprovementSuggestionsProps> = ({ className }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: '1',
      type: 'keyword',
      priority: 'high',
      title: 'Add Missing Keywords',
      description: 'Your resume is missing key terms from the job description',
      impact: '+15% match score',
      applied: false,
      suggestion: 'Include "TypeScript", "Microservices", and "Docker" in your skills section'
    },
    {
      id: '2',
      type: 'experience',
      priority: 'high',
      title: 'Quantify Achievements',
      description: 'Add specific metrics to your accomplishments',
      impact: '+20% impact',
      applied: false,
      suggestion: 'Replace "Improved performance" with "Improved application performance by 40%, reducing load time from 3s to 1.8s"'
    },
    {
      id: '3',
      type: 'skill',
      priority: 'medium',
      title: 'Reorder Skills',
      description: 'Put job-relevant skills first',
      impact: '+8% visibility',
      applied: true,
      suggestion: 'Move "React" and "JavaScript" to the top of your skills list'
    },
    {
      id: '4',
      type: 'content',
      priority: 'medium',
      title: 'Strengthen Summary',
      description: 'Your professional summary could be more targeted',
      impact: '+12% relevance',
      applied: false,
      suggestion: 'Focus on frontend development expertise and leadership experience in your summary'
    },
    {
      id: '5',
      type: 'format',
      priority: 'low',
      title: 'Improve Readability',
      description: 'Optimize formatting for ATS systems',
      impact: '+5% parsing',
      applied: false,
      suggestion: 'Use standard section headers and bullet points for better ATS compatibility'
    }
  ]);

  const applySuggestion = (id: string) => {
    setSuggestions(prev =>
      prev.map(suggestion =>
        suggestion.id === id ? { ...suggestion, applied: true } : suggestion
      )
    );
  };

  const dismissSuggestion = (id: string) => {
    setSuggestions(prev => prev.filter(suggestion => suggestion.id !== id));
  };

  const getPriorityColor = (priority: Suggestion['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getTypeIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'keyword': return '🔍';
      case 'skill': return '⚡';
      case 'experience': return '📈';
      case 'format': return '📄';
      case 'content': return '✏️';
      default: return '💡';
    }
  };

  const activeSuggestions = suggestions.filter(s => !s.applied);
  const appliedSuggestions = suggestions.filter(s => s.applied);

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Improvement Suggestions</h2>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{activeSuggestions.length}</div>
          <div className="text-sm text-blue-800">Active</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{appliedSuggestions.length}</div>
          <div className="text-sm text-green-800">Applied</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">
            {activeSuggestions.filter(s => s.priority === 'high').length}
          </div>
          <div className="text-sm text-purple-800">High Priority</div>
        </div>
      </div>

      {/* Active Suggestions */}
      {activeSuggestions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Pending Suggestions</h3>
          <div className="space-y-4">
            {activeSuggestions.map(suggestion => (
              <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getTypeIcon(suggestion.type)}</span>
                    <div>
                      <h4 className="font-semibold text-gray-800">{suggestion.title}</h4>
                      <p className="text-sm text-gray-600">{suggestion.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(suggestion.priority)}`}>
                      {suggestion.priority}
                    </span>
                    <span className="text-xs text-green-600 font-medium">{suggestion.impact}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md mb-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Suggestion:</span> {suggestion.suggestion}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => applySuggestion(suggestion.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => dismissSuggestion(suggestion.id)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors text-sm"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Applied Suggestions */}
      {appliedSuggestions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Applied Suggestions</h3>
          <div className="space-y-3">
            {appliedSuggestions.map(suggestion => (
              <div key={suggestion.id} className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">✅</span>
                    <div>
                      <h4 className="font-medium text-green-800">{suggestion.title}</h4>
                      <p className="text-sm text-green-600">{suggestion.description}</p>
                    </div>
                  </div>
                  <span className="text-xs text-green-600 font-medium">{suggestion.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6 pt-6 border-t">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Apply All High Priority
        </button>
        <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors">
          Generate New Suggestions
        </button>
      </div>
    </div>
  );
};

export default ImprovementSuggestions;