'use client';

import { useState, useEffect } from 'react';
import { Bell, Shield, Globe, Palette, Save, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSettings } from '@/contexts/SettingsContext';
import { PlatformSettings } from '@/types';

// Toggle switch component
function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)] focus:ring-offset-2 ${
        checked ? 'bg-[var(--color-teal)]' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
    >
      <span
        className={`${
          checked ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  );
}

export default function AdminSettingsPage() {
  const { settings, isLoading, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState<PlatformSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Sync local state when settings load
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (field: keyof PlatformSettings, value: any) => {
    setLocalSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    const success = await updateSettings(localSettings);

    setIsSaving(false);
    setSaveStatus(success ? 'success' : 'error');

    // Reset status after 2 seconds
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-teal)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage platform configuration</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-100">
              <Globe className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">General</h2>
              <p className="text-sm text-gray-500">Basic platform settings</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={localSettings.site_name}
                  onChange={(e) => handleChange('site_name', e.target.value)}
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={localSettings.contact_email}
                  onChange={(e) => handleChange('contact_email', e.target.value)}
                  className="bg-gray-50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Input
                id="siteDescription"
                value={localSettings.site_description}
                onChange={(e) => handleChange('site_description', e.target.value)}
                className="bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Artist Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[var(--color-teal)]/10">
              <Palette className="w-4 h-4 text-[var(--color-teal)]" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Artist Profiles</h2>
              <p className="text-sm text-gray-500">Configure artist profile options</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-900">Auto-approve new artists</p>
                <p className="text-sm text-gray-500">Skip manual review for new registrations</p>
              </div>
              <Toggle
                checked={localSettings.auto_approve_artists}
                onChange={(checked) => handleChange('auto_approve_artists', checked)}
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-900">Allow portfolio uploads</p>
                <p className="text-sm text-gray-500">Let artists upload images to their portfolio</p>
              </div>
              <Toggle
                checked={localSettings.allow_portfolio_uploads}
                onChange={(checked) => handleChange('allow_portfolio_uploads', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxPortfolio">Max portfolio items per artist</Label>
              <Input
                id="maxPortfolio"
                type="number"
                value={localSettings.max_portfolio_items}
                onChange={(e) => handleChange('max_portfolio_items', parseInt(e.target.value) || 0)}
                className="bg-gray-50 w-32"
                min={1}
                max={100}
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100">
              <Bell className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-500">Email notification preferences</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-900">New artist registration</p>
                <p className="text-sm text-gray-500">Get notified when a new artist signs up</p>
              </div>
              <Toggle
                checked={localSettings.notify_new_registration}
                onChange={(checked) => handleChange('notify_new_registration', checked)}
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-900">New inquiry received</p>
                <p className="text-sm text-gray-500">Get notified when visitors contact artists</p>
              </div>
              <Toggle
                checked={localSettings.notify_new_inquiry}
                onChange={(checked) => handleChange('notify_new_inquiry', checked)}
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100">
              <Shield className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Security</h2>
              <p className="text-sm text-gray-500">Security and access settings</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-900">Require email verification</p>
                <p className="text-sm text-gray-500">Artists must verify email before profile goes live</p>
              </div>
              <Toggle
                checked={localSettings.require_email_verification}
                onChange={(checked) => handleChange('require_email_verification', checked)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className={`${
            saveStatus === 'success'
              ? 'bg-green-600 hover:bg-green-700'
              : saveStatus === 'error'
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-[var(--color-teal)] hover:bg-[var(--color-deep-teal)]'
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : saveStatus === 'success' ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Saved
            </>
          ) : saveStatus === 'error' ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Error - Try Again
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
