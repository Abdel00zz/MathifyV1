
import React, { useState, useEffect, useCallback } from 'react';
import { AppSettings } from '../../types';
import { useSettings } from '../../hooks/useSettings';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Save, X, Sun, Moon, Laptop } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, t } = useSettings();
  const [localSettings, setLocalSettings] = useState<Omit<AppSettings, 'apiKey'>>(settings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const { ...rest } = settings;
      setLocalSettings(rest);
    }
  }, [isOpen, settings]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleThemeChange = useCallback((theme: 'light' | 'dark' | 'system') => {
    setLocalSettings(prev => ({ ...prev, theme }));
  }, []);

  const handleSave = useCallback(() => {
    setIsSaving(true);
    setTimeout(() => {
      updateSettings(localSettings);
      setIsSaving(false);
      onClose();
    }, 300);
  }, [localSettings, onClose, updateSettings]);

  const themeOptions = [
    { value: 'light', label: 'Light', icon: <Sun size={16} /> },
    { value: 'dark', label: 'Dark', icon: <Moon size={16} /> },
    { value: 'system', label: 'System', icon: <Laptop size={16} /> },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('modals.settings.title')} size="lg">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Theme</label>
          <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
            {themeOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleThemeChange(opt.value as any)}
                className={`flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  localSettings.theme === opt.value
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:bg-white/50 dark:text-slate-300 dark:hover:bg-slate-700/50'
                }`}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="text-sm p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
          The Google Gemini API Key is now configured securely via an environment variable and cannot be changed here.
        </div>
        <Input
          label={t('modals.settings.teacherName')}
          name="teacherName"
          value={localSettings.teacherName || ''}
          onChange={handleChange}
        />
        <Input
          label={t('modals.settings.schoolId')}
          name="schoolId"
          value={localSettings.schoolId || ''}
          onChange={handleChange}
        />
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('modals.settings.language')}</label>
          <select
            id="language"
            name="language"
            value={localSettings.language}
            onChange={handleChange}
            className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>
      </div>
      <div className="mt-8 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
            <X size={16} className="mr-2" />
            {t('actions.cancel')}
        </Button>
        <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
            <Save size={16} className="mr-2" />
            {t('modals.settings.save')}
        </Button>
      </div>
    </Modal>
  );
};

export default SettingsModal;