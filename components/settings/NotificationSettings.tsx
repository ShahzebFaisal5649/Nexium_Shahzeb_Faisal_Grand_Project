"use client";
import React, { useState } from 'react';
interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  applicationUpdates: boolean;
  jobRecommendations: boolean;
  marketingEmails: boolean;
  weeklyDigest: boolean;
  interviewReminders: boolean;
}

interface NotificationSettingsProps {
  className?: string;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ className }) => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    applicationUpdates: true,
    jobRecommendations: true,
    marketingEmails: false,
    weeklyDigest: true,
    interviewReminders: true
  });

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    console.log('Notification preferences saved:', preferences);
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Notification Settings</h2>
      
      <div className="space-y-6">
        {/* Communication Methods */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Communication Methods</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">Email Notifications</label>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
              <ToggleSwitch
                enabled={preferences.emailNotifications}
                onToggle={() => handleToggle('emailNotifications')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">Push Notifications</label>
                <p className="text-sm text-gray-500">Receive push notifications in browser</p>
              </div>
              <ToggleSwitch
                enabled={preferences.pushNotifications}
                onToggle={() => handleToggle('pushNotifications')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">SMS Notifications</label>
                <p className="text-sm text-gray-500">Receive notifications via text message</p>
              </div>
              <ToggleSwitch
                enabled={preferences.smsNotifications}
                onToggle={() => handleToggle('smsNotifications')}
              />
            </div>
          </div>
        </div>

        {/* Content Preferences */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Content Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">Application Updates</label>
                <p className="text-sm text-gray-500">Get notified about application status changes</p>
              </div>
              <ToggleSwitch
                enabled={preferences.applicationUpdates}
                onToggle={() => handleToggle('applicationUpdates')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">Job Recommendations</label>
                <p className="text-sm text-gray-500">Receive personalized job recommendations</p>
              </div>
              <ToggleSwitch
                enabled={preferences.jobRecommendations}
                onToggle={() => handleToggle('jobRecommendations')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">Interview Reminders</label>
                <p className="text-sm text-gray-500">Get reminders for upcoming interviews</p>
              </div>
              <ToggleSwitch
                enabled={preferences.interviewReminders}
                onToggle={() => handleToggle('interviewReminders')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">Weekly Digest</label>
                <p className="text-sm text-gray-500">Receive weekly summary of your activities</p>
              </div>
              <ToggleSwitch
                enabled={preferences.weeklyDigest}
                onToggle={() => handleToggle('weeklyDigest')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">Marketing Emails</label>
                <p className="text-sm text-gray-500">Receive promotional content and updates</p>
              </div>
              <ToggleSwitch
                enabled={preferences.marketingEmails}
                onToggle={() => handleToggle('marketingEmails')}
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
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;