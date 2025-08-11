
import React, { useState, useEffect, useCallback } from 'react';
import { Exercise } from '../../types';
import { useDocuments } from '../../hooks/useDocuments';
import { useSettings } from '../../hooks/useSettings';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import StarRating from '../ui/StarRating';
import { Save, X, Edit, Eye } from 'lucide-react';
import MathRenderer from '../ui/MathRenderer';

interface ExerciseEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  docId: string;
  exerciseToEdit?: Exercise;
}

const TabButton: React.FC<{ isActive: boolean; onClick: () => void; children: React.ReactNode }> = ({ isActive, onClick, children }) => {
    return (
        <button
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={onClick}
            className={`flex items-center px-4 py-2.5 text-sm font-medium border-b-2 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 rounded-t-lg ${
                isActive
                    ? 'border-blue-600 text-blue-600 dark:text-blue-500'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
        >
            {children}
        </button>
    );
};


const ExerciseEditorModal: React.FC<ExerciseEditorModalProps> = ({ isOpen, onClose, docId, exerciseToEdit }) => {
  const { addExercise, updateExercise } = useDocuments();
  const { t } = useSettings();

  const getInitialState = useCallback(() => ({
    title: exerciseToEdit?.title || '',
    difficulty: exerciseToEdit?.difficulty || 3,
    keywords: exerciseToEdit?.keywords?.join(', ') || '',
    content: exerciseToEdit?.content || '',
  }), [exerciseToEdit]);

  const [formState, setFormState] = useState(getInitialState());
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const isEditing = !!exerciseToEdit;

  useEffect(() => {
    if (isOpen) {
      setFormState(getInitialState());
      setActiveTab('edit');
    }
  }, [isOpen, getInitialState]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleRatingChange = useCallback((newRating: number) => {
    setFormState(prev => ({...prev, difficulty: newRating}));
  }, []);

  const handleSave = useCallback(() => {
    const exerciseData = {
      ...formState,
      difficulty: Number(formState.difficulty),
      keywords: formState.keywords.split(',').map(k => k.trim()).filter(Boolean),
    };

    if (isEditing && exerciseToEdit) {
      updateExercise(docId, exerciseToEdit.id, exerciseData);
    } else {
      addExercise(docId, exerciseData);
    }
    onClose();
  }, [addExercise, docId, exerciseToEdit, formState, isEditing, onClose, updateExercise]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? t('modals.editExercise.editTitle') : t('modals.editExercise.createTitle')}
      size="2xl"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <Input
                label={t('modals.editExercise.titleLabel')}
                name="title"
                value={formState.title}
                onChange={handleChange}
                containerClassName="col-span-2 sm:col-span-1"
            />
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('modals.editExercise.difficultyLabel')}</label>
                <StarRating rating={formState.difficulty} onRatingChange={handleRatingChange} isEditable size={24}/>
            </div>
        </div>
        <Input
            label={t('modals.editExercise.keywordsLabel')}
            name="keywords"
            value={formState.keywords}
            onChange={handleChange}
        />
        <div>
          <div className="border-b border-slate-200 dark:border-slate-800 mb-[-1px]">
            <div className="flex items-center gap-2">
                <TabButton
                  isActive={activeTab === 'edit'}
                  onClick={() => setActiveTab('edit')}
                >
                  <Edit size={14} className="mr-2"/>
                  {t('actions.edit')}
                </TabButton>
                <TabButton
                  isActive={activeTab === 'preview'}
                  onClick={() => setActiveTab('preview')}
                >
                  <Eye size={14} className="mr-2"/>
                  {t('modals.editExercise.preview')}
                </TabButton>
            </div>
          </div>
          <div className="pt-0">
             {activeTab === 'edit' ? (
                <textarea
                  id="content"
                  name="content"
                  value={formState.content}
                  onChange={handleChange}
                  rows={12}
                  className="w-full p-2 border border-slate-300 rounded-lg dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 custom-scrollbar font-mono text-sm min-h-[300px] rounded-t-none border-t-0"
                  placeholder={t('modals.editExercise.contentLabel')}
                />
              ) : (
                <div className="border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-800/50 custom-scrollbar overflow-y-auto min-h-[300px] rounded-t-none border-t-0">
                    <MathRenderer 
                        content={formState.content}
                        className="prose prose-sm prose-slate dark:prose-invert max-w-none"
                    />
                </div>
              )}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
        <Button type="button" variant="secondary" onClick={onClose}>
            <X size={16} className="mr-2" />
            {t('actions.cancel')}
        </Button>
        <Button type="button" onClick={handleSave}>
            <Save size={16} className="mr-2" />
            {t('modals.editExercise.save')}
        </Button>
      </div>
    </Modal>
  );
};

export default ExerciseEditorModal;
