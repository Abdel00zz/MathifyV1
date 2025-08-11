
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Dashboard from './components/document/Dashboard';
import DocumentEditor from './components/document/DocumentEditor';
import { useSettings } from './hooks/useSettings';
import Spinner from './components/ui/Spinner';
import { AlertTriangle } from 'lucide-react';

function App() {
  const { settings, isI18nLoading, isI18nError } = useSettings();

  React.useEffect(() => {
    document.documentElement.lang = settings.language;
  }, [settings.language]);
  
  React.useEffect(() => {
    const root = window.document.documentElement;
    const isDark =
      settings.theme === 'dark' ||
      (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.classList.toggle('dark', isDark);
  }, [settings.theme]);

  if (isI18nLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950">
        <Spinner size="lg" text="Loading application..." />
      </div>
    );
  }
  
  if (isI18nError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950 p-4 text-center">
        <AlertTriangle size={48} className="text-red-500" />
        <h1 className="mt-4 text-2xl font-bold text-slate-800 dark:text-slate-100">Failed to Load Application</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Could not load language files. Please check your network connection and try refreshing the page.</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/document/:id" element={<DocumentEditor />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
