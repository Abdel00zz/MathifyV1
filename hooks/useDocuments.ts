import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

export const useDocuments = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useDocuments must be used within an AppProvider');
  }
  return {
    documents: context.documents,
    addDocument: context.addDocument,
    updateDocument: context.updateDocument,
    deleteDocument: context.deleteDocument,
    duplicateDocument: context.duplicateDocument,
    addExercise: context.addExercise,
    updateExercise: context.updateExercise,
    deleteExercise: context.deleteExercise,
    reorderExercises: context.reorderExercises,
    importDocuments: context.importDocuments,
    saveDocument: context.saveDocument,
  };
};
