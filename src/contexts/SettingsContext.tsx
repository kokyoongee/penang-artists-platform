'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { PlatformSettings, DEFAULT_SETTINGS } from '@/types';

interface SettingsContextType {
  settings: PlatformSettings;
  isLoading: boolean;
  error: string | null;
  updateSettings: (updates: Partial<PlatformSettings>) => Promise<boolean>;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();

      if (data.settings) {
        setSettings(data.settings);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to fetch settings:', err);
      setError('Failed to load settings');
      // Keep using default settings on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (updates: Partial<PlatformSettings>): Promise<boolean> => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update settings');
      }

      const data = await response.json();
      if (data.settings) {
        setSettings(data.settings);
      }
      setError(null);
      return true;
    } catch (err) {
      console.error('Failed to update settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to update settings');
      return false;
    }
  }, []);

  const refreshSettings = useCallback(async () => {
    setIsLoading(true);
    await fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        error,
        updateSettings,
        refreshSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

// Hook for checking specific settings
export function useSetting<K extends keyof PlatformSettings>(key: K): PlatformSettings[K] {
  const { settings } = useSettings();
  return settings[key];
}
