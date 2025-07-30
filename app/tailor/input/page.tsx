// app/tailor/input/page.tsx
import { ResumeSelector } from '@/components/tailor/ResumeSelector';

export default function InputPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Resume Input</h1>
      <ResumeSelector />
    </div>
  );
}

// Make sure there are NO other exports in this file