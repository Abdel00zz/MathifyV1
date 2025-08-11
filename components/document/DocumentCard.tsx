
import React, { useState, useRef } from 'react';
import { Document } from '../../types';
import { useDocuments } from '../../hooks/useDocuments';
import { useSettings } from '../../hooks/useSettings';
import Button from '../ui/Button';
import ConfirmModal from '../modals/ConfirmModal';
import NewDocumentModal from '../modals/NewDocumentModal';
import ExportModal from '../modals/ExportModal';
import { useNavigate, Link } from 'react-router-dom';
import Tooltip from '../ui/Tooltip';
import { MoreVertical, Pencil, Copy, FileOutput, Trash2, CheckCircle2 } from 'lucide-react';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

interface DocumentCardProps {
  document: Document;
  isRecent?: boolean;
}

const DocumentCardAction: React.FC<{onClick: (e: React.MouseEvent) => void, icon: React.ReactNode, label: string, className?: string}> = ({ onClick, icon, label, className }) => (
    <button onClick={onClick} className={`flex items-center gap-3 w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors ${className}`}>
        {icon}
        <span>{label}</span>
    </button>
);


const DocumentCard: React.FC<DocumentCardProps> = ({ document, isRecent = false }) => {
  const navigate = useNavigate();
  const { deleteDocument, duplicateDocument } = useDocuments();
  const { t, settings } = useSettings();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isExportModalOpen, setExportModalOpen] = useState(false);
  const [isActionsOpen, setActionsOpen] = useState(false);
  
  const actionsRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(actionsRef, () => setActionsOpen(false));


  const handleDelete = () => {
    deleteDocument(document.id);
    setDeleteModalOpen(false);
  };
  
  const lastModified = document.lastModified ? new Date(document.lastModified) : new Date(document.date);
  const isDirty = !document.lastSaved || (!!document.lastModified && document.lastModified > document.lastSaved);

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
    setActionsOpen(false);
  };
  
  const highlightClass = isRecent ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-950 shadow-xl' : 'hover:shadow-xl';

  return (
    <>
      <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col group relative shadow-md ${highlightClass}`}>
        <div className="p-6 flex-grow">
          <div className="flex justify-between items-start mb-2">
             <h3 className="font-display font-bold text-xl text-slate-800 dark:text-slate-100 pr-4">
                <Link to={`/document/${document.id}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors stretched-link">
                    {document.title}
                </Link>
             </h3>
            <div ref={actionsRef} className="relative z-10 flex-shrink-0" onClick={e => e.stopPropagation()}>
              <Tooltip text={t('tooltips.actions')}>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2" onClick={() => setActionsOpen(c => !c)}>
                      <MoreVertical size={20} />
                  </Button>
              </Tooltip>
              {isActionsOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg z-10 border border-slate-200 dark:border-slate-800 p-2 space-y-1 animate-scale-in origin-top-right">
                  <DocumentCardAction onClick={(e) => handleAction(e, () => setEditModalOpen(true))} icon={<Pencil size={16} />} label={t('actions.edit')} />
                  <DocumentCardAction onClick={(e) => handleAction(e, () => duplicateDocument(document.id))} icon={<Copy size={16} />} label={t('actions.duplicate')} />
                  <DocumentCardAction onClick={(e) => handleAction(e, () => setExportModalOpen(true))} icon={<FileOutput size={16} />} label={t('actions.export')} />
                  <div className="my-1 h-px bg-slate-200 dark:bg-slate-700" />
                  <DocumentCardAction onClick={(e) => handleAction(e, () => setDeleteModalOpen(true))} icon={<Trash2 size={16} />} label={t('actions.delete')} className="text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-400" />
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {document.className} &bull; {document.schoolYear}
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center text-sm rounded-b-2xl">
           <p className="text-slate-600 dark:text-slate-300 font-medium">
            {document.exercises.length} {t('dashboard.documentCard.exercises')}
          </p>
           <div className="flex items-center gap-2 text-xs">
             {isDirty ? (
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                    <span>{t('dashboard.documentCard.unsaved')}</span>
                </div>
             ) : (
                <div className="flex items-center gap-1.5 text-green-600 dark:text-green-500 font-semibold">
                    <CheckCircle2 size={14} />
                    <span>{t('dashboard.documentCard.saved')}</span>
                </div>
             )}
            <span className="text-slate-400 dark:text-slate-500">&bull;</span>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {lastModified.toLocaleDateString(settings.language)}
            </p>
          </div>
        </div>
      </div>

      <NewDocumentModal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} documentToEdit={document} />
      <ExportModal isOpen={isExportModalOpen} onClose={() => setExportModalOpen(false)} document={document} />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title={`${t('actions.delete')} Document`}
      >
        <h3 className="text-base font-semibold leading-6 text-slate-900 dark:text-slate-100">
          {`${t('actions.delete')} "${document.title}"?`}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          {t('modals.confirm.text')}
        </p>
      </ConfirmModal>
    </>
  );
};

export default React.memo(DocumentCard);