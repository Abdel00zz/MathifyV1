
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Document, ExportOptions } from '../../types';
import { useSettings } from '../../hooks/useSettings';
import { generateHtmlForExport } from '../../services/htmlGenerator';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';
import { Download, Printer } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document;
}

// A4 content height (29.7cm) minus margins (2cm * 2) = 25.7cm.
// 1cm ~= 37.8px, so 25.7cm * 37.8px/cm ~= 971px. We use 970 for a clean number.
const PAGE_BREAK_HEIGHT_PX = 970;

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, document }) => {
  const { settings, t } = useSettings();
  const { addToast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [options, setOptions] = useState<ExportOptions>({
    columns: 1,
    fontSize: 12,
    theme: 'default',
    includeSolutions: false,
    showDifficulty: true,
    showKeywords: true,
    showTitles: true,
  });
  const [isPrinting, setIsPrinting] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  
  const generatedHtml = useMemo(() => {
    if (!isOpen) return '';
    return generateHtmlForExport(document, settings, options);
  }, [isOpen, document, settings, options]);

  const updatePreview = useCallback(() => {
    const iframe = iframeRef.current;
    if (iframe) {
        setTimeout(() => {
            if (iframe.contentWindow && iframe.contentWindow.document.body) {
                const body = iframe.contentWindow.document.body;
                const html = iframe.contentWindow.document.documentElement;
                const height = Math.max(
                    body.scrollHeight, body.offsetHeight,
                    html.clientHeight, html.scrollHeight, html.offsetHeight
                );
                iframe.style.height = `${height}px`;
                setPageCount(Math.ceil(height / PAGE_BREAK_HEIGHT_PX));
            }
        }, 200); // Delay to allow MathJax to render
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
        updatePreview();
    }
  }, [generatedHtml, isOpen, updatePreview]);


  const handleOptionChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    setOptions(prev => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : Number.isNaN(Number(value)) ? value : Number(value),
    }));
  }, []);

  const handlePrint = useCallback(() => {
    setIsPrinting(true);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(generatedHtml);
      printWindow.document.close();
      
      const onPrintFinish = () => {
        setIsPrinting(false);
        try { printWindow.close(); } catch (e) { console.warn("Could not close print window", e); }
      };

      const checkMathJax = () => {
        const mathJax = (printWindow.window as any).MathJax;
        if (mathJax && mathJax.startup?.promise) {
          mathJax.startup.promise.then(() => {
            setTimeout(() => {
              printWindow.focus();
              printWindow.print();
              onPrintFinish();
            }, 500);
          });
        } else {
           setTimeout(() => {
              printWindow.focus();
              printWindow.print();
              onPrintFinish();
            }, 1500);
        }
      };
      
      if (printWindow.document.readyState === 'complete') {
        checkMathJax();
      } else {
        printWindow.onload = checkMathJax;
      }
    } else {
      setIsPrinting(false);
      addToast("Could not open print window. Check your browser's popup blocker.", 'error');
    }
  }, [generatedHtml, addToast]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([generatedHtml], { type: 'text/html' });
    const link = window.document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${document.title.replace(/\s/g, '_')}.html`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }, [document.title, generatedHtml]);

  const footer = (
    <div className="w-full flex justify-end items-center">
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleDownload}>
            <Download size={16} className="mr-2" />
            {t('modals.export.download')}
          </Button>
          <Button variant="primary" onClick={handlePrint} isLoading={isPrinting}>
            <Printer size={16} className="mr-2" />
            {t('modals.export.print')}
          </Button>
        </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('modals.export.title')} size="7xl" footer={footer}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8">
        {/* Options Panel */}
        <div className="lg:col-span-1 h-fit lg:sticky lg:top-0 space-y-6">
          <OptionSelect label={t('modals.export.columns')} name="columns" value={String(options.columns)} onChange={handleOptionChange}>
            <option value="1">{t('modals.export.one_column')}</option>
            <option value="2">{t('modals.export.two_columns')}</option>
          </OptionSelect>
          <OptionSelect label={t('modals.export.fontSize')} name="fontSize" value={String(options.fontSize)} onChange={handleOptionChange}>
            <option value="10">{t('modals.export.small')} (10pt)</option>
            <option value="12">{t('modals.export.medium')} (12pt)</option>
            <option value="14">{t('modals.export.large')} (14pt)</option>
          </OptionSelect>
          <OptionSelect label={t('modals.export.theme')} name="theme" value={options.theme} onChange={handleOptionChange}>
            <option value="default">{t('modals.export.default')}</option>
            <option value="ink-saver">{t('modals.export.inkSaver')}</option>
            <option value="high-contrast">{t('modals.export.highContrast')}</option>
          </OptionSelect>
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">{t('modals.export.display')}</h4>
            <Checkbox label={t('modals.export.showTitles')} name="showTitles" checked={options.showTitles} onChange={handleOptionChange} />
            <Checkbox label={t('modals.export.showDifficulty')} name="showDifficulty" checked={options.showDifficulty} onChange={handleOptionChange} />
            <Checkbox label={t('modals.export.showKeywords')} name="showKeywords" checked={options.showKeywords} onChange={handleOptionChange} />
          </div>
          <div className="text-center text-sm text-slate-500 dark:text-slate-400 font-medium py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {pageCount} page{pageCount > 1 ? 's' : ''}
          </div>
        </div>
        
        {/* Preview Panel */}
        <div className="lg:col-span-3 bg-slate-200 dark:bg-slate-900/70 rounded-lg p-4 sm:p-8 flex justify-center items-start mt-8 lg:mt-0">
          <div className="h-[70vh] overflow-y-auto w-full flex justify-center custom-scrollbar">
            <div className="relative w-full" style={{maxWidth: '21cm'}}>
              <iframe
                ref={iframeRef}
                srcDoc={generatedHtml}
                title="Export Preview"
                className="w-full border-0 transition-height duration-200 shadow-lg bg-white block"
                onLoad={updatePreview}
                sandbox="allow-scripts allow-same-origin"
                scrolling="no"
              />
              {/* Page break indicators */}
              {pageCount > 1 && Array.from({ length: pageCount - 1 }).map((_, i) => (
                <div 
                  key={`break-${i}`}
                  className="absolute z-10 w-full left-0 flex items-center pointer-events-none"
                  style={{ top: `${(i + 1) * PAGE_BREAK_HEIGHT_PX}px`}}
                >
                  <div className="flex-grow border-t border-dashed border-slate-400"></div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full -translate-y-1/2 whitespace-nowrap">
                      Page {i + 2}
                  </span>
                  <div className="flex-grow border-t border-dashed border-slate-400"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const OptionSelect: React.FC<{label:string, name:string, value: string, onChange: any, children: React.ReactNode}> = ({label, name, value, onChange, children}) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
        <select name={name} value={value} onChange={onChange} className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900">
            {children}
        </select>
    </div>
);

export default ExportModal;