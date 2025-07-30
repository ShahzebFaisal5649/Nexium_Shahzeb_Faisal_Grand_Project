'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

import { 
  Download, 
  FileText, 
  Image, 
  Mail,
  Share2,
  Settings,
  Palette,
  Layout
} from 'lucide-react';

interface DownloadOptionsProps {
  onDownload: (options: DownloadConfig) => void;
  isLoading?: boolean;
  resumeData: any;
}

interface DownloadConfig {
  format: 'pdf' | 'docx' | 'txt' | 'html';
  template: string;
  colorScheme: string;
  includePhoto: boolean;
  fontSize: number;
  margins: 'narrow' | 'normal' | 'wide';
  customizations: {
    watermark: boolean;
    pageNumbers: boolean;
    qrCode: boolean;
  };
}

const formatOptions = [
  { value: 'pdf', label: 'PDF', description: 'Best for applying to jobs', icon: FileText },
  { value: 'docx', label: 'Word Document', description: 'Editable format', icon: FileText },
  { value: 'txt', label: 'Plain Text', description: 'ATS-friendly format', icon: FileText },
  { value: 'html', label: 'Web Page', description: 'For online portfolios', icon: Image },
];

const templateOptions = [
  { value: 'professional', label: 'Professional', preview: '/templates/professional.jpg' },
  { value: 'modern', label: 'Modern', preview: '/templates/modern.jpg' },
  { value: 'creative', label: 'Creative', preview: '/templates/creative.jpg' },
  { value: 'minimal', label: 'Minimal', preview: '/templates/minimal.jpg' },
  { value: 'ats-optimized', label: 'ATS Optimized', preview: '/templates/ats.jpg' },
];

const colorSchemes = [
  { value: 'blue', label: 'Professional Blue', color: 'bg-blue-600' },
  { value: 'green', label: 'Fresh Green', color: 'bg-green-600' },
  { value: 'purple', label: 'Creative Purple', color: 'bg-purple-600' },
  { value: 'gray', label: 'Classic Gray', color: 'bg-gray-600' },
  { value: 'red', label: 'Bold Red', color: 'bg-red-600' },
  { value: 'black', label: 'Elegant Black', color: 'bg-black' },
];

export function DownloadOptions({ onDownload, isLoading = false }: DownloadOptionsProps) {
  const [config, setConfig] = useState<DownloadConfig>({
    format: 'pdf',
    template: 'professional',
    colorScheme: 'blue',
    includePhoto: false,
    fontSize: 11,
    margins: 'normal',
    customizations: {
      watermark: false,
      pageNumbers: true,
      qrCode: false,
    },
  });

  const handleDownload = () => {
    onDownload(config);
  };

  const handleCustomizationToggle = (key: keyof DownloadConfig['customizations']) => {
    setConfig(prev => ({
      ...prev,
      customizations: {
        ...prev.customizations,
        [key]: !prev.customizations[key]
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Format Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Download Format
          </CardTitle>
          <CardDescription>
            Choose the format that best suits your needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={config.format}
            onValueChange={(value: any) => setConfig(prev => ({ ...prev, format: value as any }))}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {formatOptions.map((format) => {
              const Icon = format.icon;
              return (
                <div key={format.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={format.value} id={format.value} />
                  <Label htmlFor={format.value} className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                      <Icon className="h-5 w-5" />
                      <div>
                        <div className="font-medium">{format.label}</div>
                        <div className="text-sm text-gray-500">{format.description}</div>
                      </div>
                    </div>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Resume Template
          </CardTitle>
          <CardDescription>
            Select a template that matches your industry and style
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {templateOptions.map((template) => (
              <div
                key={template.value}
                onClick={() => setConfig(prev => ({ ...prev, template: template.value }))}
                className={`
                  relative cursor-pointer rounded-lg border-2 overflow-hidden transition-all
                  ${config.template === template.value 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center">
                  <Layout className="h-8 w-8 text-gray-400" />
                </div>
                <div className="p-2 text-center">
                  <div className="text-sm font-medium">{template.label}</div>
                </div>
                {config.template === template.value && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-primary text-primary-foreground rounded-full p-1">
                      <Download className="h-3 w-3" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Design Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Design Customization
          </CardTitle>
          <CardDescription>
            Customize the appearance of your resume
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Color Scheme */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Color Scheme</Label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {colorSchemes.map((scheme) => (
                <div
                  key={scheme.value}
                  onClick={() => setConfig(prev => ({ ...prev, colorScheme: scheme.value }))}
                  className={`
                    flex flex-col items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all
                    ${config.colorScheme === scheme.value 
                      ? 'border-primary ring-2 ring-primary/20' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className={`w-6 h-6 rounded-full ${scheme.color}`} />
                  <span className="text-xs text-center">{scheme.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Font Size: {config.fontSize}pt</Label>
            <input
              type="range"
              min="9"
              max="14"
              value={config.fontSize}
              onChange={(e) => setConfig(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Small (9pt)</span>
              <span>Medium (11pt)</span>
              <span>Large (14pt)</span>
            </div>
          </div>

          {/* Margins */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Page Margins</Label>
            <Select value={config.margins} onValueChange={(value: any) => setConfig(prev => ({ ...prev, margins: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="narrow">Narrow (0.5 inch)</SelectItem>
                <SelectItem value="normal">Normal (1 inch)</SelectItem>
                <SelectItem value="wide">Wide (1.5 inch)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Additional Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Additional Options
          </CardTitle>
          <CardDescription>
            Extra features and customizations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-photo"
              checked={config.includePhoto}
              onCheckedChange={(checked: any) => 
                setConfig(prev => ({ ...prev, includePhoto: !!checked }))
              }
            />
            <Label htmlFor="include-photo" className="text-sm">
              Include profile photo (if available)
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="page-numbers"
              checked={config.customizations.pageNumbers}
              onCheckedChange={() => handleCustomizationToggle('pageNumbers')}
            />
            <Label htmlFor="page-numbers" className="text-sm">
              Include page numbers
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="watermark"
              checked={config.customizations.watermark}
              onCheckedChange={() => handleCustomizationToggle('watermark')}
            />
            <Label htmlFor="watermark" className="text-sm">
              Add "Nexium Resume Tailor" watermark
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="qr-code"
              checked={config.customizations.qrCode}
              onCheckedChange={() => handleCustomizationToggle('qrCode')}
            />
            <Label htmlFor="qr-code" className="text-sm">
              Include QR code linking to online portfolio
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Preview Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Download Summary</CardTitle>
          <CardDescription>
            Review your selections before downloading
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Format:</span>
              <Badge variant="secondary">
                {formatOptions.find(f => f.value === config.format)?.label}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Template:</span>
              <Badge variant="secondary">
                {templateOptions.find(t => t.value === config.template)?.label}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Color:</span>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${colorSchemes.find(c => c.value === config.colorScheme)?.color}`} />
                <span className="text-sm">
                  {colorSchemes.find(c => c.value === config.colorScheme)?.label}
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Font Size:</span>
              <span className="text-sm">{config.fontSize}pt</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button variant="outline" className="flex-1 max-w-xs">
          <Share2 className="h-4 w-4 mr-2" />
          Share Link
        </Button>
        <Button 
          onClick={handleDownload}
          disabled={isLoading}
          className="flex-1 max-w-xs"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Download Resume
            </>
          )}
        </Button>
      </div>

      {/* Email Option */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Resume
          </CardTitle>
          <CardDescription>
            Send the resume directly to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Add this at the end of your file, replacing the existing export
export default DownloadOptions;