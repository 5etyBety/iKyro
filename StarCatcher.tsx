import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store';
import { translations } from '../translations';

export const ExitConfirmOverlay = () => {
  const [show, setShow] = useState(false);
  const { language } = useAppStore();
  const t = translations[language];

  useEffect(() => {
    // Push a state so that when user hits back, we stay on the page
    window.history.pushState({ noBackExitsApp: true }, '');

    const handlePopState = (event: PopStateEvent) => {
      setShow(true);
      // Push state again so we don't exit
      window.history.pushState({ noBackExitsApp: true }, '');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleConfirm = () => {
    setShow(false);
    // Go back two steps to exit
    window.history.go(-2);
    setTimeout(() => {
      window.close();
    }, 100);
  };

  const handleCancel = () => {
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleCancel}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="glass-panel w-full max-w-[270px] rounded-[24px] overflow-hidden shadow-2xl relative z-10 flex flex-col items-center !p-0"
          >
            <div className="p-5 text-center">
              <h3 className="text-[17px] font-semibold text-black dark:text-white mb-1 tracking-tight">
                {t.exitConfirmTitle || 'Exit App'}
              </h3>
              <p className="text-[13px] text-[#3C3C43] dark:text-[#EBEBF5]/60 leading-tight">
                {t.exitConfirmDesc || 'Are you sure you want to exit?'}
              </p>
            </div>
            <div className="flex flex-col w-full border-t border-[#3C3C43]/20 dark:border-[#545458]/40">
              <button
                onClick={handleConfirm}
                className="w-full py-[11px] text-[17px] text-[#FF3B30] font-normal active:bg-black/5 dark:active:bg-white/5 transition-colors border-b border-[#3C3C43]/20 dark:border-[#545458]/40"
              >
                {t.exitConfirmYes || 'Exit'}
              </button>
              <button
                onClick={handleCancel}
                className="w-full py-[11px] text-[17px] text-[#007AFF] font-semibold active:bg-black/5 dark:active:bg-white/5 transition-colors"
              >
                {t.exitConfirmNo || 'Cancel'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
