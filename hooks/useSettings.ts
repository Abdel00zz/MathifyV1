
import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

export const useSettings = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useSettings must be used within an AppProvider');
  }
  return {
    settings: context.settings,
    updateSettings: context.updateSettings,
    t: context.t,
    isI18nLoading: context.isI18nLoading,
    isMobile: context.isMobile,
    isApiKeyValid: context.isApiKeyValid,
    verifyApiKey: context.verifyApiKey,
  };
};
