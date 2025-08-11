
import { useState, useEffect, useCallback, useMemo } from 'react';

const translationCache: { [key: string]: any } = {};

const flattenObject = (obj: any, prefix: string = ''): Record<string, string> => {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {} as Record<string, string>);
};

type LoadState = 'loading' | 'success' | 'error';

export function useI18n(language: 'en' | 'fr') {
  const [rawLocale, setRawLocale] = useState<any | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('loading');

  const flatLocale = useMemo(() => {
    return rawLocale ? flattenObject(rawLocale) : null;
  }, [rawLocale]);

  useEffect(() => {
    let isMounted = true;
    const loadTranslations = async () => {
      if (!isMounted) return;
      setLoadState('loading');

      try {
        if (translationCache[language]) {
          if (isMounted) {
            setRawLocale(translationCache[language]);
            setLoadState('success');
          }
          return;
        }

        const response = await fetch(`./locales/${language}.json`);
        if (!response.ok) {
          throw new Error(`Failed to fetch translations: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        if (isMounted) {
          translationCache[language] = data;
          setRawLocale(data);
          setLoadState('success');
        }
      } catch (error) {
        console.error(`Could not load translation file for language: ${language}`, error);
        if (isMounted) {
          setLoadState('error');
        }
      }
    };
    loadTranslations();

    return () => {
      isMounted = false;
    }
  }, [language]);

  const t = useCallback((path: string, replacements?: Record<string, string | number>): string => {
    if (loadState !== 'success' || !flatLocale) {
      return path;
    }
    
    let str = flatLocale[path] || path;

    if (replacements && typeof str === 'string') {
        for (const key in replacements) {
            str = str.replace(`{${key}}`, String(replacements[key]));
        }
    }
    
    return str;
  }, [flatLocale, loadState]);

  return { 
    t, 
    isLoading: loadState === 'loading',
    isError: loadState === 'error',
  };
}
