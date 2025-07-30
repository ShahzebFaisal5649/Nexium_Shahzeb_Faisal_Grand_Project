// components/tailor/ResumeSelector.tsx
import React from 'react';

interface ResumeSelectorProps {
  className?: string;
}

export const ResumeSelector: React.FC<ResumeSelectorProps> = ({ className }) => {
  return (
    <div className={className}>
      <h2>Resume Selector</h2>
      {/* Add your resume selector content here */}
    </div>
  );
};

export default ResumeSelector;