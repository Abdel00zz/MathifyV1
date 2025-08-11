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

export function useI18n(language: 'en' | 'fr') {
  const [rawLocale, setRawLocale] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const flatLocale = useMemo(() => {
    return rawLocale ? flattenObject(rawLocale) : null;
  }, [rawLocale]);

  useEffect(() => {
    let isMounted = true;
    const loadTranslations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (translationCache[language]) {
          if (isMounted) setRawLocale(translationCache[language]);
        } else {
          const response = await fetch(`/locales/${language}.json`);
          if (!response.ok) {
            throw new Error(`Failed to fetch translations: ${response.status} ${response.statusText}`);
          }
          const data = await response.json();
          if (isMounted) {
            translationCache[language] = data;
            setRawLocale(data);
          }
        }
      } catch (error) {
        console.error(`Could not load translation file for language: ${language}`, error);
        if (isMounted) setError(error as Error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadTranslations();

    return () => {
        isMounted = false;
    }
  }, [language]);

  const t = useCallback((path: string, replacements?: Record<string, string | number>): string => {
    if (!flatLocale) {
      return path;
    }
    
    let str = flatLocale[path] || path;

    if (replacements && typeof str === 'string') {
        for (const key in replacements) {
            str = str.replace(`{${key}}`, String(replacements[key]));
        }
    }
    
    return str;
  }, [flatLocale]);

  return { t, isLoading, error };
}