"use client";
import React, { useState } from 'react';

interface PrivacyPreferences {
  profileVisibility: 'public' | 'private' | 'connections';
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
  allowSearchEngines: boolean;
  dataCollection: boolean;
  thirdPartySharing: boolean;
  analyticsTracking: boolean;
}

interface PrivacySettingsProps {
  className?: string;
}

export const PrivacySettings: React.FC<PrivacySettingsProps> = ({ className }) => {
  const [privacy, setPrivacy] = useState<PrivacyPreferences>({
    profileVisibility: 'connections',
    showEmail: false,
    showPhone: false,
    showLocation: true,
    allowSearchEngines: false,
    dataCollection: true,
    thirdPartySharing: false,
    analyticsTracking: true
  });

  const handleToggle = (key: keyof Omit<PrivacyPreferences, 'profileVisibility'>) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleVisibilityChange = (visibility: PrivacyPreferences['profileVisibility']) => {
    setPrivacy(prev => ({ ...prev, profileVisibility: visibility }));
  };

  const handleSave = () => {
    console.log('Privacy settings saved:', privacy);
    // Add your save logic here
  };

  const ToggleSwitch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      type="button"
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Privacy Settings</h2>
      
      <div className="space-y-6">
        {/* Profile Visibility */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Profile Visibility</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="visibility"
                checked={privacy.profileVisibility === 'public'}
                onChange={() => handleVisibilityChange('public')}
                className="mr-3 text-blue-600"
              />
              <div>
                <span className="font-medium">Public</span>
                <p className="text-sm text-gray-500">Anyone can see your profile</p>
              </div>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="visibility"
                checked={privacy.profileVisibility === 'connections'}
                onChange={() => handleVisibilityChange('connections')}
                className="mr-3 text-blue-600"
              />
              <div>
                <span className="font-medium">Connections Only</span>
                <p className="text-sm text-gray-500">Only your connections can see your profile</p>
              </div>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="visibility"
                checked={privacy.profileVisibility === 'private'}
                onChange={() => handleVisibilityChange('private')}
                className="mr-3 text-blue-600"
              />
              <div>
                <span className="font-medium">Private</span>
                <p className="text-sm text-gray-500">Only you can see your profile</p>
              </div>
            </label>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Contact Information Visibility</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">Show Email Address</label>
                <p className="text-sm text-gray-500">Allow others to see your email</p>
              </div>
              <ToggleSwitch
                enabled={privacy.showEmail}
                onToggle={() => handleToggle('showEmail')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">Show Phone Number</label>
                <p className="text-sm text-gray-500">Allow others to see your phone number</p>
              </div>
              <ToggleSwitch
                enabled={privacy.showPhone}
                onToggle={() => handleToggle('showPhone')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">Show Location</label>
                <p className="text-sm text-gray-500">Allow others to see your location</p>
              </div>
              <ToggleSwitch
                enabled={privacy.showLocation}
                onToggle={() => handleToggle('showLocation')}
              />
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Data & Privacy</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">Search Engine Indexing</label>
                <p className="text-sm text-gray-500">Allow search engines to index your profile</p>
              </div>
              <ToggleSwitch
                enabled={privacy.allowSearchEngines}
                onToggle={() => handleToggle('allowSearchEngines')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">Data Collection</label>
                <p className="text-sm text-gray-500">Allow collection of usage data for improvements</p>
              </div>
              <ToggleSwitch
                enabled={privacy.dataCollection}
                onToggle={() => handleToggle('dataCollection')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">Third-Party Sharing</label>
                <p className="text-sm text-gray-500">Allow sharing data with trusted partners</p>
              </div>
              <ToggleSwitch
                enabled={privacy.thirdPartySharing}
                onToggle={() => handleToggle('thirdPartySharing')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">Analytics Tracking</label>
                <p className="text-sm text-gray-500">Allow tracking for analytics purposes</p>
              </div>
              <ToggleSwitch
                enabled={privacy.analyticsTracking}
                onToggle={() => handleToggle('analyticsTracking')}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Privacy Settings
          </button>
        </div>
      </div>
    </div>
  );
};