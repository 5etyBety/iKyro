import React from 'react';
import { AppItem } from '../types';
import { useAppStore } from '../store';
import { GlassPanel } from './UI';
import { motion } from 'motion/react';
import { Star, Download, Heart } from 'lucide-react';
import { translations } from '../translations';

export const SkeletonAppCard = () => {
  return (
    <GlassPanel className="flex items-center gap-4 animate-pulse">
      <div className="shrink-0 w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-xl" />
      <div className="flex-1 min-w-0">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0" />
        <div className="w-16 h-8 rounded-xl bg-gray-200 dark:bg-gray-800" />
      </div>
    </GlassPanel>
  );
};

export const AppCard = ({ app }: { app: AppItem | any; key?: React.Key }) => {
  const { setCurrentView, setSelectedApp, toggleFavorite, isFavorite, language } = useAppStore();
  const t = translations[language];

  const handleOpen = () => {
    setSelectedApp(app);
    setCurrentView('details');
  };

  const name = app.title || app.name;
  const icon = app.image || app.icon;
  const isFav = isFavorite(app.id);

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={handleOpen}
      className="cursor-pointer"
    >
      <GlassPanel className="flex items-center gap-4 hover:bg-white/90 dark:hover:bg-[#1E1E1E]/90 transition-colors">
        <div className="relative shrink-0 flex items-center justify-center w-16 h-16 bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm p-1">
          <img src={icon} alt={name} className="max-w-full max-h-full rounded-lg object-contain bg-transparent" />
          {app.isPremium && (
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
              PRO
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-white truncate">{name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {app.developer && app.developer !== 'Unknown' ? `${app.developer} • ` : ''}{t.categoryNames?.[app.category] || app.category}
          </p>
          
          <div className="flex items-center gap-3 mt-2 text-[11px] font-medium text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              {app.downloads}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button 
            whileTap={{ scale: 0.8, rotate: -15 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(app);
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-400 shrink-0"
          >
            <Heart className={`w-4 h-4 transition-colors duration-300 ${isFav ? 'fill-red-500 text-red-500 scale-110' : ''}`} />
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="bg-gray-100 dark:bg-gray-800 text-ikyro-blue font-bold text-sm px-4 py-2 rounded-xl"
          >
            {t.download}
          </motion.button>
        </div>
      </GlassPanel>
    </motion.div>
  );
};
