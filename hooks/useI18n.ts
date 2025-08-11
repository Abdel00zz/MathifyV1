
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
  const [rawLocale, setRawLocale] = useState<any>(() => translationCache[language] || null);

  const flatLocale = useMemo(() => {
    return rawLocale ? flattenObject(rawLocale) : null;
  }, [rawLocale]);

  useEffect(() => {
    const loadTranslations = async () => {
      if (translationCache[language]) {
        if (rawLocale !== translationCache[language]) {
          setRawLocale(translationCache[language]);
        }
        return;
      }
      try {
        const response = await fetch(`./locales/${language}.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        translationCache[language] = data;
        setRawLocale(data);
      } catch (error) {
        console.error(`Could not load translation file for language: ${language}`, error);
      }
    };
    loadTranslations();
  }, [language, rawLocale]);

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

  return { t };
}
