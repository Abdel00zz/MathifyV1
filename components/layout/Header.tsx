
import React, { useState } from 'react';
import { Settings, HelpCircle, FunctionSquare } from 'lucide-react';
import Button from '../ui/Button';
import SettingsModal from '../modals/SettingsModal';
import HelpModal from '../modals/HelpModal';
import Tooltip from '../ui/Tooltip';
import { useSettings } from '../../hooks/useSettings';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isHelpOpen, setHelpOpen] = useState(false);
  const { t } = useSettings();

  return (
    <>
      <header className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 text-xl font-display font-bold text-slate-900 dark:text-slate-50">
              <FunctionSquare size={28} className="text-blue-600 dark:text-blue-500" />
              <span className="hidden sm:inline">{t('appName')}</span>
            </Link>
            <div className="flex items-center gap-1">
              <Tooltip text={t('tooltips.settings')}>
                <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)}>
                  <Settings />
                </Button>
              </Tooltip>
              <Tooltip text={t('tooltips.help')}>
                <Button variant="ghost" size="icon" onClick={() => setHelpOpen(true)}>
                  <HelpCircle />
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </header>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
      <HelpModal isOpen={isHelpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
};

export default Header;