import React, { useState, useCallback } from 'react';
import { Exercise } from '../../types';
import { useDocuments } from '../../hooks/useDocuments';
import { useSettings } from '../../hooks/useSettings';
import Button from '../ui/Button';
import ExerciseEditorModal from '../modals/ExerciseEditorModal';
import ConfirmModal from '../modals/ConfirmModal';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import StarRating from '../ui/StarRating';
import MathRenderer from '../ui/MathRenderer';

interface ExerciseItemProps {
  docId: string;
  exercise: Exercise;
  index: number;
  onDragStart: () => void;
  isDragging: boolean;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ docId, exercise, index, onDragStart, isDragging }) => {
  const { deleteExercise } = useDocuments();
  const { t } = useSettings();
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  const handleDelete = useCallback(() => {
    deleteExercise(docId, exercise.id);
    setDeleteOpen(false);
  }, [deleteExercise, docId, exercise.id]);
  
  const opacityClass = isDragging ? 'opacity-30' : 'opacity-100';

  return (
    <>
      <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col group transition-shadow hover:shadow-lg ${opacityClass}`}>
        <div className="flex gap-4 p-6">
            <div 
                draggable
                onDragStart={onDragStart}
                className="cursor-grab text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 pt-1"
                aria-label="Drag to reorder"
            >
                <GripVertical size={24} />
            </div>
            <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider">EXERCICE {index + 1}</span>
                    <h4 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100">
                        <MathRenderer content={exercise.title} inline />
                    </h4>
                    </div>
                    <StarRating rating={exercise.difficulty} size={16} />
                </div>

                {exercise.keywords && exercise.keywords.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                    {exercise.keywords.map(kw => (
                        <span key={kw} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md">{kw}</span>
                    ))}
                    </div>
                )}
                
                <MathRenderer 
                    content={exercise.content} 
                    className="prose prose-sm prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200"
                />
            </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-end gap-2">
             <Button variant="secondary" size="sm" onClick={() => setEditorOpen(true)}>
                <Pencil size={14} className="mr-2" />
                {t('actions.edit')}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setDeleteOpen(true)}>
                <Trash2 size={14} className="mr-2" />
                {t('actions.delete')}
            </Button>
        </div>
      </div>
      <ExerciseEditorModal
        isOpen={isEditorOpen}
        onClose={() => setEditorOpen(false)}
        docId={docId}
        exerciseToEdit={exercise}
      />
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title={`${t('actions.delete')} Exercise`}
      >
        <h3 className="text-base font-semibold leading-6 text-slate-900 dark:text-slate-100">
          {`${t('actions.delete')} "${exercise.title || `Exercice ${index + 1}`}"?`}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          {t('modals.confirm.text')}
        </p>
      </ConfirmModal>
    </>
  );
};

export default React.memo(ExerciseItem);