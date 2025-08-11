
import React, { useState } from 'react';
import { useDocuments } from '../../hooks/useDocuments';
import { useSettings } from '../../hooks/useSettings';
import DocumentCard from './DocumentCard';
import Button from '../ui/Button';
import NewDocumentModal from '../modals/NewDocumentModal';
import { Document } from '../../types';
import { Plus, Upload } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

const Dashboard: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { documents, importDocuments, recentlyDuplicatedId } = useDocuments();
  const { t } = useSettings();
  const { addToast } = useToast();


  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result;
          if (typeof content === 'string') {
            const importedData = JSON.parse(content);
            if(Array.isArray(importedData)) {
              importDocuments(importedData as Document[]);
            } else if (typeof importedData === 'object' && importedData !== null) {
              importDocuments([importedData as Document]);
            }
             addToast(t('toasts.importSuccess'), 'success');
          }
        } catch (error) {
          console.error("Failed to parse imported JSON", error);
          addToast(t('toasts.importError'), 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold font-display tracking-tight text-slate-900 dark:text-slate-100">{t('dashboard.title')}</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => document.getElementById('import-input')?.click()}>
            <Upload size={16} className="mr-2" />
            {t('dashboard.import')}
          </Button>
          <input type="file" id="import-input" accept=".json" className="hidden" onChange={handleImport} />
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            <Plus size={16} className="mr-2" />
            {t('dashboard.newDocument')}
          </Button>
        </div>
      </div>

      {documents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map(doc => (
            <DocumentCard key={doc.id} document={doc} isRecent={doc.id === recentlyDuplicatedId} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
          <h2 className="text-xl font-semibold font-display text-slate-700 dark:text-slate-300">{t('dashboard.noDocuments')}</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">{t('dashboard.createFirst')}</p>
          <Button variant="primary" onClick={() => setModalOpen(true)} className="mt-6">
            <Plus size={16} className="mr-2" />
            {t('dashboard.newDocument')}
          </Button>
        </div>
      )}
      <NewDocumentModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
