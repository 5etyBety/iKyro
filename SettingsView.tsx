import React from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../store';
import { GlassPanel } from '../components/UI';
import { Download, Trash2, HardDrive, ArrowRight } from 'lucide-react';
import { translations } from '../translations';

export const DownloadsView = () => {
  const { downloadHistory, removeDownload, setCurrentView, setSelectedApp, language } = useAppStore();
  const t = translations[language];

  const handleOpen = (app: any) => {
    setSelectedApp(app);
    setCurrentView('details');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
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
        <div className="w-10 h-10 rounded-full bg-ikyro-blue/10 flex items-center justify-center text-ikyro-blue">
          <Download className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{t.downloadHistory}</h2>
          <p className="text-sm text-gray-500 mt-1">{t.locallyDownloadedApps}</p>
        </div>
      </div>

      {downloadHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 opacity-60">
          <HardDrive className="w-16 h-16 mb-4 text-gray-400" />
          <p className="font-medium text-gray-500">{t.noDownloads}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {downloadHistory.map((app: any) => (
            <motion.div
              key={app.id}
              whileTap={{ scale: 0.97 }}
              className="cursor-pointer"
            >
              <GlassPanel className="flex items-center gap-4 !p-3">
                <div 
                  className="relative shrink-0 flex items-center justify-center w-14 h-14 bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm p-1"
                  onClick={() => handleOpen(app)}
                >
                  <img src={app.image || app.icon} alt={app.title || app.name} className="max-w-full max-h-full rounded-lg object-contain bg-transparent" />
                </div>
                
                <div className="flex-1 min-w-0" onClick={() => handleOpen(app)}>
                  <h3 className="font-bold text-gray-900 dark:text-white truncate text-sm">{app.title || app.name}</h3>
                  <div className="flex items-center gap-2 mt-1.5 text-[11px] font-medium text-gray-500 dark:text-gray-400">
                    <span>
                      {app.downloadDate ? new Date(app.downloadDate).toLocaleDateString(language === 'ar' ? 'ar-SA' : language === 'ku' ? 'ku-IQ' : 'en-US') : t.recently}
                    </span>
                  </div>
                </div>

                <motion.button 
                  whileTap={{ scale: 0.8 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeDownload(app.id);
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
