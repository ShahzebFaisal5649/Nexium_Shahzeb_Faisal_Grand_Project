// components/settings/SettingsForm.tsx
import React, { useState } from 'react';

interface SettingsData {
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  theme: 'light' | 'dark' | 'auto';
  autoSave: boolean;
  twoFactorAuth: boolean;
}

interface SettingsFormProps {
  className?: string;
}

export const SettingsForm: React.FC<SettingsFormProps> = ({ className }) => {
  const [settings, setSettings] = useState<SettingsData>({
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    theme: 'light',
    autoSave: true,
    twoFactorAuth: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (key: 'autoSave' | 'twoFactorAuth') => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    console.log('Settings saved:', settings);
    // Add your save logic here
  };

  const ToggleSwitch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">General Settings</h2>
      
      <div className="space-y-6">
        {/* Localization */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Localization</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                name="language"
                value={settings.language}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                name="timezone"
                value={settings.timezone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time</option>
                <option value="PST">Pacific Time</option>
                <option value="GMT">Greenwich Mean Time</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
              <select
                name="dateFormat"
                value={settings.dateFormat}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Appearance</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select
              name="theme"
              value={settings.theme}
              onChange={handleInputChange}
              className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Features</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">Auto Save</label>
                <p className="text-sm text-gray-500">Automatically save your work</p>
              </div>
              <ToggleSwitch
                enabled={settings.autoSave}
                onToggle={() => handleToggle('autoSave')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">Two-Factor Authentication</label>
                <p className="text-sm text-gray-500">Add extra security to your account</p>
              </div>
              <ToggleSwitch
                enabled={settings.twoFactorAuth}
                onToggle={() => handleToggle('twoFactorAuth')}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsForm;