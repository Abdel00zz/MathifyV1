
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDocuments } from '../../hooks/useDocuments';
import { useSettings } from '../../hooks/useSettings';
import ExerciseList from '../exercise/ExerciseList';
import Button from '../ui/Button';
import ExportModal from '../modals/ExportModal';
import ExerciseEditorModal from '../modals/ExerciseEditorModal';
import ImageUploadModal from '../modals/ImageUploadModal';
import { ChevronLeft, Plus, Image, Printer, Check, Edit } from 'lucide-react';

const DocumentEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { documents, updateDocument } = useDocuments();
  const { t } = useSettings();
  const [isExportOpen, setExportOpen] = useState(false);
  const [isAddExerciseOpen, setAddExerciseOpen] = useState(false);
  const [isAddFromImageOpen, setAddFromImageOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  
  const document = documents.find(doc => doc.id === id);
  const [title, setTitle] = useState(document?.title || '');
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (document) {
      setTitle(document.title);
    }
  }, [document]);

  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditingTitle]);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  const saveTitle = useCallback(() => {
    if (document && title.trim() !== '' && title !== document.title) {
      updateDocument(document.id, { title });
    }
    setIsEditingTitle(false);
  }, [document, title, updateDocument]);
  
  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveTitle();
    } else if (e.key === 'Escape') {
      setTitle(document?.title || '');
      setIsEditingTitle(false);
    }
  };

  if (!document) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold font-display">Document not found</h2>
        <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
          <ChevronLeft size={20} />
          {t('documentEditor.backToDashboard')}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1 space-y-4 md:sticky md:top-24 h-fit bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
          <Button variant="secondary" onClick={() => setAddExerciseOpen(true)} className="w-full justify-start">
            <Plus size={16} className="mr-2"/>
            {t('documentEditor.addExercise')}
          </Button>
          <Button variant="secondary" onClick={() => setAddFromImageOpen(true)} className="w-full justify-start">
            <Image size={16} className="mr-2"/>
            {t('documentEditor.addFromImage')}
          </Button>
          <Button variant="primary" onClick={() => setExportOpen(true)} className="w-full justify-start">
            <Printer size={16} className="mr-2"/>
            {t('documentEditor.export')}
          </Button>
        </aside>
        
        <main className="md:col-span-3">
          <div className="text-center mb-8">
            <div className="relative group inline-flex flex-col items-center">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                   <input
                    ref={titleInputRef}
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    onBlur={saveTitle}
                    onKeyDown={handleTitleKeyDown}
                    className="text-3xl font-display font-bold tracking-tight bg-transparent text-center focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-800 rounded-lg px-2"
                  />
                  <Button size="icon" className="h-8 w-8 flex-shrink-0" onClick={saveTitle}>
                    <Check size={16}/>
                  </Button>
                </div>
              ) : (
                <h1 className="text-3xl font-display font-bold tracking-tight flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setIsEditingTitle(true)}>
                  {document.title}
                  <Edit size={16} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h1>
              )}
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {document.className} - {document.schoolYear}
            </p>
          </div>
          <ExerciseList key={document.lastModified || document.id} docId={document.id} exercises={document.exercises} />
        </main>
      </div>
      
      <ExportModal isOpen={isExportOpen} onClose={() => setExportOpen(false)} document={document} />
      <ExerciseEditorModal isOpen={isAddExerciseOpen} onClose={() => setAddExerciseOpen(false)} docId={document.id} />
      <ImageUploadModal isOpen={isAddFromImageOpen} onClose={() => setAddFromImageOpen(false)} docId={document.id} />
    </div>
  );
};

export default DocumentEditor;
