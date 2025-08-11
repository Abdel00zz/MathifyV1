
import React, { useState } from 'react';
import { Exercise } from '../../types';
import { useDocuments } from '../../hooks/useDocuments';
import { useSettings } from '../../hooks/useSettings';
import ExerciseItem from './ExerciseItem';

interface ExerciseListProps {
  docId: string;
  exercises: Exercise[];
}

const ExerciseList: React.FC<ExerciseListProps> = ({ docId, exercises }) => {
  const { reorderExercises } = useDocuments();
  const { t } = useSettings();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnter = (index: number) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      setDropTargetIndex(index);
    }
  };
  
  const handleDragLeave = () => {
    setDropTargetIndex(null);
  }

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    reorderExercises(docId, draggedIndex, index);
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };
  
  const handleDragEnd = () => {
      setDraggedIndex(null);
      setDropTargetIndex(null);
  }

  if (exercises.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
        <h2 className="text-xl font-semibold font-display text-slate-700 dark:text-slate-300">{t('documentEditor.noExercises')}</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">{t('documentEditor.addFirstExercise')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
       <p className="text-sm text-slate-500 dark:text-slate-400 text-center">{t('documentEditor.dragAndDrop')}</p>
      {exercises.map((exercise, index) => (
        <div
          key={exercise.id}
          onDragEnter={() => handleDragEnter(index)}
          onDragLeave={handleDragLeave}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(index)}
          onDragEnd={handleDragEnd}
          className={`rounded-2xl transition-all duration-200 ${dropTargetIndex === index ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500' : ''}`}
        >
          <ExerciseItem
            docId={docId}
            exercise={exercise}
            index={index}
            onDragStart={() => handleDragStart(index)}
            isDragging={draggedIndex === index}
          />
        </div>
      ))}
    </div>
  );
};

export default ExerciseList;