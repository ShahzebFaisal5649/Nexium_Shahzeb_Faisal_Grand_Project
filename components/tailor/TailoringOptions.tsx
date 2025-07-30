'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from "@/components/ui/slider";
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Zap, 
  FileText, 
  Settings, 
  Briefcase,
  GraduationCap,
  Award,
  User
} from 'lucide-react';

interface TailoringOptionsProps {
  onTailor: (options: TailoringConfig) => void;
  isLoading?: boolean;
}

interface TailoringConfig {
  jobDescription: string;
  focusAreas: string[];
  optimizationLevel: number;
  includeKeywords: boolean;
  atsOptimization: boolean;
  customizations: {
    skills: boolean;
    experience: boolean;
    education: boolean;
    summary: boolean;
  };
}

const focusAreaOptions = [
  { id: 'technical-skills', label: 'Technical Skills', icon: Settings },
  { id: 'experience', label: 'Work Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'achievements', label: 'Achievements', icon: Award },
  { id: 'summary', label: 'Professional Summary', icon: User },
  { id: 'keywords', label: 'Industry Keywords', icon: Target },
];

export default function TailoringOptions({ onTailor, isLoading = false }: TailoringOptionsProps) {
  const [config, setConfig] = useState<TailoringConfig>({
    jobDescription: '',
    focusAreas: ['technical-skills', 'experience'],
    optimizationLevel: 7,
    includeKeywords: true,
    atsOptimization: true,
    customizations: {
      skills: true,
      experience: true,
      education: false,
      summary: true,
    },
  });

  const handleFocusAreaToggle = (areaId: string) => {
    setConfig(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(areaId)
        ? prev.focusAreas.filter(id => id !== areaId)
        : [...prev.focusAreas, areaId]
    }));
  };

  const handleCustomizationToggle = (key: keyof TailoringConfig['customizations']) => {
    setConfig(prev => ({
      ...prev,
      customizations: {
        ...prev.customizations,
        [key]: !prev.customizations[key]
      }
    }));
  };

  const handleTailor = () => {
    if (!config.jobDescription.trim()) {
      alert('Please provide a job description');
      return;
    }
    onTailor(config);
  };

  return (
    <div className="space-y-6">
      {/* Job Description Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Job Description
          </CardTitle>
          <CardDescription>
            Paste the job description you want to tailor your resume for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste the complete job description here..."
            value={config.jobDescription}
            onChange={(e) => setConfig(prev => ({ ...prev, jobDescription: e.target.value }))}
            className="min-h-[150px]"
          />
          <div className="mt-2 text-sm text-muted-foreground">
            {config.jobDescription.length} characters
          </div>
        </CardContent>
      </Card>

      {/* Focus Areas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Focus Areas
          </CardTitle>
          <CardDescription>
            Select which sections of your resume to prioritize for tailoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {focusAreaOptions.map((area) => {
              const Icon = area.icon;
              const isSelected = config.focusAreas.includes(area.id);
              return (
                <div
                  key={area.id}
                  onClick={() => handleFocusAreaToggle(area.id)}
                  className={`
                    flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all
                    ${isSelected 
                      ? 'border-primary bg-primary/5 text-primary' 
                      : 'border-border hover:border-primary/50'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{area.label}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Optimization Settings
          </CardTitle>
          <CardDescription>
            Configure how aggressively to tailor your resume
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Optimization Level */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Optimization Level: {config.optimizationLevel}/10
            </Label>
            <Slider
                value={config.optimizationLevel}
                onChange={(value: number) => setConfig(prev => ({ ...prev, optimizationLevel: value }))}
                max={10}
                min={1}
                className="w-full"
                {...{ className: "w-full" } as any}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Conservative</span>
              <span>Balanced</span>
              <span>Aggressive</span>
            </div>
          </div>

          {/* Boolean Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-keywords"
                checked={config.includeKeywords}
                onCheckedChange={(checked: any) => 
                  setConfig(prev => ({ ...prev, includeKeywords: !!checked }))
                }
              />
              <Label htmlFor="include-keywords" className="text-sm">
                Auto-include relevant keywords from job description
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="ats-optimization"
                checked={config.atsOptimization}
                onCheckedChange={(checked: any) => 
                  setConfig(prev => ({ ...prev, atsOptimization: !!checked }))
                }
              />
              <Label htmlFor="ats-optimization" className="text-sm">
                Optimize for Applicant Tracking Systems (ATS)
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customization Options */}
      <Card>
        <CardHeader>
          <CardTitle>Section Customizations</CardTitle>
          <CardDescription>
            Choose which sections to modify during tailoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="customize-skills"
                checked={config.customizations.skills}
                onCheckedChange={() => handleCustomizationToggle('skills')}
              />
              <Label htmlFor="customize-skills" className="text-sm">
                Skills Section
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="customize-experience"
                checked={config.customizations.experience}
                onCheckedChange={() => handleCustomizationToggle('experience')}
              />
              <Label htmlFor="customize-experience" className="text-sm">
                Work Experience
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="customize-education"
                checked={config.customizations.education}
                onCheckedChange={() => handleCustomizationToggle('education')}
              />
              <Label htmlFor="customize-education" className="text-sm">
                Education Section
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="customize-summary"
                checked={config.customizations.summary}
                onCheckedChange={() => handleCustomizationToggle('summary')}
              />
              <Label htmlFor="customize-summary" className="text-sm">
                Professional Summary
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleTailor}
          size="lg"
          disabled={isLoading || !config.jobDescription.trim()}
          className="w-full max-w-md"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Tailoring Resume...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Tailor My Resume
            </>
          )}
        </Button>
      </div>

      {/* Selected Options Summary */}
      {config.focusAreas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Selected Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {config.focusAreas.map(areaId => {
                const area = focusAreaOptions.find(a => a.id === areaId);
                return area ? (
                  <Badge key={areaId} variant="secondary">
                    {area.label}
                  </Badge>
                ) : null;
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}