import React from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../store';
import { GlassPanel } from '../components/UI';
import { Star, Download, Heart, ArrowRight } from 'lucide-react';
import { AppItem } from '../types';
import { translations } from '../translations';

export const FavoritesView = () => {
  const { favorites, toggleFavorite, setCurrentView, setSelectedApp, language } = useAppStore();
  const t = translations[language];

  const handleOpen = (app: AppItem) => {
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
        <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
          <Heart className="w-5 h-5 fill-red-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{t.favorites}</h2>
          <p className="text-sm text-gray-500 mt-1">{t.yourFavoriteApps}</p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 opacity-60">
          <Heart className="w-16 h-16 mb-4 text-gray-400" />
          <p className="font-medium text-gray-500">{t.noFavoritesYet}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {favorites.map((app) => (
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
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{app.developer}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] font-medium text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {app.downloads}
                    </span>
                  </div>
                </div>

                <motion.button 
                  whileTap={{ scale: 0.8 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(app);
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-red-50 dark:bg-red-500/10 text-red-500 shrink-0"
                >
                  <Heart className="w-5 h-5 fill-red-500" />
                </motion.button>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
