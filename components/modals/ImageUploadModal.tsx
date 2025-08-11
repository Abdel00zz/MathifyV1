
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDocuments } from '../../hooks/useDocuments';
import { useSettings } from '../../hooks/useSettings';
import { analyzeImageWithGemini } from '../../services/geminiService';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';
import { GeminiExerciseResponse } from '../../types';
import { UploadCloud, CheckCircle2, AlertTriangle, X, Loader, Trash2, FileCheck2, FileX2 } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

// Helper to convert a file to a base64 string
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

type FileStatus = 'waiting' | 'analyzing' | 'success' | 'error';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  status: FileStatus;
  result?: GeminiExerciseResponse;
  error?: string;
}

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  docId: string;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({ isOpen, onClose, docId }) => {
  const { addExercise } = useDocuments();
  const { t } = useSettings();
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [reviseText, setReviseText] = useState(true);
  const [boldKeywords, setBoldKeywords] = useState(true);
  const { addToast } = useToast();

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      files.forEach(f => URL.revokeObjectURL(f.preview));
    };
  }, [files]);

  const resetState = useCallback(() => {
    setFiles([]);
    setReviseText(true);
    setBoldKeywords(true);
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: ImageFile[] = acceptedFiles.map(file => ({
      id: `file_${Date.now()}_${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      status: 'waiting',
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.gif', '.webp'] },
    multiple: true,
  });
  
  const handleRemoveFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const handleClearAll = useCallback(() => {
    setFiles([]);
  }, []);
  
  const handleAnalysis = useCallback(async () => {
    for (const imageFile of files) {
        if (imageFile.status === 'waiting') {
            setFiles(prev => prev.map(f => f.id === imageFile.id ? { ...f, status: 'analyzing' } : f));
            try {
                const base64Image = await fileToBase64(imageFile.file);
                const analysisResult = await analyzeImageWithGemini(base64Image, imageFile.file.type, { reviseText, boldKeywords });
                setFiles(prev => prev.map(f => f.id === imageFile.id ? { ...f, status: 'success', result: analysisResult } : f));
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : t('modals.imageUpload.error');
                addToast(errorMessage, 'error');
                setFiles(prev => prev.map(f => f.id === imageFile.id ? { ...f, status: 'error', error: errorMessage } : f));
            }
        }
    }
  }, [files, t, addToast, reviseText, boldKeywords]);

  const handleAddExercises = useCallback(() => {
    const successfulExercises = files.filter(f => f.status === 'success' && f.result).map(f => f.result!);
    successfulExercises.forEach(ex => addExercise(docId, ex));
    if(successfulExercises.length > 0) {
        addToast(t('toasts.exercisesAdded', { count: successfulExercises.length }), 'success');
        handleClose();
    }
  }, [files, addExercise, docId, handleClose, addToast, t]);

  const waitingCount = useMemo(() => files.filter(f => f.status === 'waiting').length, [files]);
  const successCount = useMemo(() => files.filter(f => f.status === 'success').length, [files]);
  const isAnalyzing = useMemo(() => files.some(f => f.status === 'analyzing'), [files]);

  const renderFooter = () => {
    if (files.length === 0) {
      return <Button variant="secondary" onClick={handleClose}>{t('actions.close')}</Button>;
    }
    
    const isDoneAnalyzing = !isAnalyzing && waitingCount === 0;

    return (
        <div className="flex w-full justify-between items-center">
            <Button variant="danger" size="sm" onClick={handleClearAll} disabled={isAnalyzing}>
                <Trash2 size={16} className="mr-2"/>
                {t('modals.imageUpload.clear_all')}
            </Button>
            <div className="flex gap-3">
                <Button variant="secondary" onClick={handleClose}>{t('actions.cancel')}</Button>
                {isDoneAnalyzing && successCount > 0 ? (
                    <Button variant="primary" onClick={handleAddExercises}>
                        <FileCheck2 size={16} className="mr-2"/>
                        {t('modals.imageUpload.addExercises', { count: successCount })}
                    </Button>
                ) : (
                    <Button variant="primary" onClick={handleAnalysis} disabled={isAnalyzing || waitingCount === 0}>
                        {isAnalyzing ? <Loader size={16} className="mr-2 animate-spin"/> : <FileX2 size={16} className="mr-2"/>}
                        {t('modals.imageUpload.analyze_count', { count: waitingCount })}
                    </Button>
                )}
            </div>
        </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('modals.imageUpload.title')} size="3xl" footer={renderFooter()}>
      <div className="min-h-[40vh] max-h-[70vh] flex flex-col space-y-4">
        {files.length > 0 && (
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 flex-shrink-0">
            <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">{t('modals.imageUpload.optionsTitle')}</h4>
            <div className="flex flex-col sm:flex-row gap-4">
              <Checkbox label={t('modals.imageUpload.reviseText')} name="reviseText" checked={reviseText} onChange={(e) => setReviseText(e.target.checked)} />
              <Checkbox label={t('modals.imageUpload.boldKeywords')} name="boldKeywords" checked={boldKeywords} onChange={(e) => setBoldKeywords(e.target.checked)} />
            </div>
          </div>
        )}
        {files.length === 0 ? (
           <div
              {...getRootProps()}
              className={`flex-grow p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors flex flex-col items-center justify-center ${
                isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-300 dark:border-slate-600 hover:border-slate-400'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
                <UploadCloud size={48} className="text-slate-400" />
                <p className="font-semibold">{t('modals.imageUpload.uploadArea')}</p>
              </div>
            </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pr-2 flex-grow">
            {files.map((imageFile) => (
              <div key={imageFile.id} className="relative aspect-square group">
                <img src={imageFile.preview} alt={imageFile.file.name} className="w-full h-full object-cover rounded-lg"/>
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleRemoveFile(imageFile.id)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-600">
                        <X size={16}/>
                    </button>
                    <div className="text-white text-center p-1">
                        <StatusIcon status={imageFile.status} />
                        <p className="text-xs font-semibold mt-1">
                            {t(`modals.imageUpload.queue_status_${imageFile.status}`)}
                        </p>
                    </div>
                </div>
                {imageFile.status !== 'waiting' && imageFile.status !== 'success' && (
                    <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                        <div className="text-white text-center p-1">
                            <StatusIcon status={imageFile.status} />
                            <p className="text-xs font-semibold mt-1">
                                {t(`modals.imageUpload.queue_status_${imageFile.status}`)}
                            </p>
                        </div>
                    </div>
                )}
                 {imageFile.status === 'success' && (
                     <div className="absolute inset-0 bg-green-900/80 rounded-lg flex items-center justify-center">
                        <div className="text-white text-center p-1">
                            <StatusIcon status={imageFile.status} />
                        </div>
                    </div>
                 )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

const StatusIcon: React.FC<{status: FileStatus}> = ({status}) => {
    switch (status) {
        case 'analyzing':
            return <Loader size={24} className="animate-spin text-white"/>;
        case 'success':
            return <CheckCircle2 size={32} className="text-white"/>;
        case 'error':
            return <AlertTriangle size={24} className="text-red-400"/>;
        default:
            return null;
    }
}


export default ImageUploadModal;
