import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store';
import { GlassPanel } from '../components/UI';
import { ArrowRight, Check } from 'lucide-react';
import { translations } from '../translations';

export const LanguageView = () => {
  const { language, setLanguage, setCurrentView } = useAppStore();
  const t = translations[language];
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingLang, setPendingLang] = useState<'ar' | 'en' | 'ku' | null>(null);

  const languages = [
    { id: 'ar', label: 'العربية' },
    { id: 'en', label: 'English' },
    { id: 'ku', label: 'Kurdî (كوردى)' }
  ];

  const handleLangClick = (langId: string) => {
    if (language === langId) return;
    setPendingLang(langId as 'ar' | 'en' | 'ku');
    setShowConfirm(true);
  };

  const confirmChange = () => {
    if (pendingLang) {
      setLanguage(pendingLang);
    }
    setShowConfirm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="px-4 py-6 flex flex-col gap-6 mb-20"
    >
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => setCurrentView('settings')}
          className="p-2 -mr-2 text-gray-900 dark:text-white rounded-full bg-gray-100 dark:bg-gray-800"
        >
          <ArrowRight className="w-6 h-6 rtl:rotate-0 ltr:rotate-180" />
        </button>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{t.language}</h2>
      </div>

      <GlassPanel className="!p-0 overflow-hidden flex flex-col divide-y divide-gray-100 dark:divide-white/5">
        {languages.map((lang) => (
          <button
            key={lang.id}
            onClick={() => handleLangClick(lang.id)}
            className="flex items-center justify-between p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors w-full text-start"
          >
            <span className="font-bold tracking-tight text-gray-900 dark:text-white">{lang.label}</span>
            {language === lang.id && (
              <Check className="w-5 h-5 text-ikyro-blue" />
            )}
          </button>
        ))}
      </GlassPanel>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/40 flex items-center justify-center p-4"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-[270px] glass-panel !p-0 rounded-[24px] overflow-hidden flex flex-col text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="pt-5 px-4 pb-4 flex flex-col gap-1">
                <h3 className="text-[17px] font-semibold text-black dark:text-white leading-tight">{t.alert}</h3>
                <p className="text-[13px] text-black/70 dark:text-white/70 leading-snug">
                  {t.changeLanguageConfirm}
                </p>
              </div>
              <div className="w-full flex border-t border-[#3c3c43]/20 dark:border-white/20 divide-x divide-x-reverse divide-[#3c3c43]/20 dark:divide-white/20">
                <button 
                  className="flex-1 py-[11px] text-[17px] text-[#007AFF] font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors active:bg-black/10 dark:active:bg-white/10" 
                  onClick={() => setShowConfirm(false)}
                >
                  {t.cancel}
                </button>
                <button 
                  className="flex-1 py-[11px] text-[17px] text-[#007AFF] font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors active:bg-black/10 dark:active:bg-white/10" 
                  onClick={confirmChange}
                >
                  {t.yes}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
