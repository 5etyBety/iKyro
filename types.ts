import React from 'react';
import { useAppStore } from '../store';
import { Home, Gamepad2, Smartphone, Search, Settings, Search as SearchIcon, Moon, Sun, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassPanel } from './UI';

import { translations } from '../translations';

export const Header = () => {
  const { darkMode, toggleDarkMode, currentView, setCurrentView, searchQuery, setSearchQuery, addHistory, language, homeData, setSelectedApp } = useAppStore();
  const t = translations[language];

  const [showSearchPopup, setShowSearchPopup] = React.useState(false);
  const [localSearchQuery, setLocalSearchQuery] = React.useState('');
  const [quickResults, setQuickResults] = React.useState<any[]>([]);

  const isDetails = currentView === 'details';
  const isSearch = currentView === 'search';
  const showSearchBar = ['home', 'games', 'apps', 'modded', 'category', 'search'].includes(currentView);

  React.useEffect(() => {
    if (!showSearchPopup) {
      setLocalSearchQuery('');
      setQuickResults([]);
      return;
    }
    
    if (!localSearchQuery.trim()) {
      setQuickResults([]);
      return;
    }
    
    const term = localSearchQuery.toLowerCase();
    
    // local filter first
    const allLocal = [...homeData.apps, ...homeData.games];
    const matched = allLocal.filter(a => 
      a.title?.toLowerCase().includes(term) || 
      a.name?.toLowerCase().includes(term) ||
      (a.developer && a.developer.toLowerCase().includes(term))
    );
    // keep top 3
    setQuickResults(matched.slice(0, 5));
    
    // server fetch for more
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(localSearchQuery)}`);
        const data = await res.json();
        if (data.success && data.results.length > 0) {
           setQuickResults(prev => {
              const ids = new Set(prev.map(p => p.id));
              const newItems = data.results.filter((r: any) => !ids.has(r.id)).slice(0, 3);
              return [...prev, ...newItems].slice(0, 5); // max 5
           });
        }
      } catch (e) {}
    }, 500);
    
    return () => clearTimeout(timer);
  }, [localSearchQuery, homeData, showSearchPopup]);

  const executeSearch = () => {
    if (localSearchQuery.trim()) {
      setSearchQuery(localSearchQuery);
      addHistory(localSearchQuery);
      setCurrentView('search');
      setShowSearchPopup(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      addHistory(searchQuery);
    }
  };

  if (currentView === 'settings') return null;

  return (
    <header className="sticky top-0 z-50 pt-safe bg-white/40 dark:bg-[#090909]/40 backdrop-blur-[64px] backdrop-saturate-[300%] border-b border-white/50 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
      <div className="px-4 py-4 flex items-center justify-between relative">
        <AnimatePresence mode="popLayout">
          {isDetails ? (
            <motion.button
              key="back"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={() => setCurrentView('home')} // Or previous view if we tracked it
              className="p-2 -mr-2 text-gray-900 dark:text-white rounded-full bg-gray-100 dark:bg-gray-800"
            >
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          ) : (
            <motion.div 
              key="logo"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <img 
                src="/logo.png" 
                alt="iKyro Logo" 
                className="w-10 h-10 rounded-xl object-contain ikyro-glow bg-white dark:bg-[#1E1E1E]" 
                onError={(e: any) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }} 
              />
              <div className="hidden w-10 h-10 rounded-xl ikyro-gradient ikyro-glow flex items-center justify-center text-white font-bold text-xl">
                iK
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isDetails && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            >
              <img src="/watermark.png" alt="Watermark" className="h-12 object-contain opacity-80 filter drop-shadow-md" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3">
          {isDetails && (
            <button 
              onClick={() => setShowSearchPopup(true)}
              className="p-2 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 rounded-full"
            >
              <SearchIcon className="w-5 h-5" />
            </button>
          )}
          <button 
            onClick={toggleDarkMode}
            className="p-2 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 rounded-full"
          >
            <motion.div
              key={darkMode ? 'moon' : 'sun'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.div>
          </button>
        </div>
      </div>
      
      {showSearchBar && (
        <div className="px-4 pb-4">
          <div className="relative shadow-[0_8px_24px_rgba(0,0,0,0.05)] rounded-2xl">
            <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => { if (!isSearch) setCurrentView('search'); }}
              placeholder={t.search + "..."}
              className="w-full bg-gray-100 dark:bg-[#1E1E1E] text-gray-900 dark:text-white h-12 rounded-2xl pr-12 pl-12 font-medium focus:outline-none focus:ring-2 focus:ring-ikyro-blue/50 border border-transparent dark:border-white/5 transition-all placeholder:font-medium placeholder:opacity-60"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-gray-200 dark:bg-gray-800 rounded-full text-gray-500 dark:text-gray-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      <AnimatePresence>
        {showSearchPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start pt-20 px-4"
            onClick={() => setShowSearchPopup(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full bg-white dark:bg-[#121212] rounded-3xl shadow-2xl overflow-hidden mt-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative p-4 border-b border-gray-100 dark:border-white/5">
                <SearchIcon className="absolute right-8 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  autoFocus
                  type="text"
                  value={localSearchQuery}
                  onChange={e => setLocalSearchQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') executeSearch();
                  }}
                  placeholder={t.search + "..."}
                  className="w-full bg-gray-100 dark:bg-[#1E1E1E] text-gray-900 dark:text-white h-12 rounded-2xl pr-12 pl-12 font-medium focus:outline-none focus:ring-2 focus:ring-ikyro-blue/50 border border-transparent dark:border-white/5 transition-all"
                />
                <button
                  onClick={() => setShowSearchPopup(false)}
                  className="absolute left-8 top-1/2 -translate-y-1/2 p-1.5 bg-gray-200 dark:bg-gray-800 rounded-full text-gray-500 dark:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {localSearchQuery.trim() && (
                <div className="p-2 max-h-[60vh] overflow-y-auto">
                  {quickResults.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {quickResults.map(app => (
                        <div
                          key={`quick-${app.id}`}
                          onClick={() => {
                            setSelectedApp(app);
                            setCurrentView('details');
                            setShowSearchPopup(false);
                          }}
                          className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                        >
                          <img src={app.icon} alt={app.title} className="w-12 h-12 rounded-xl object-cover" />
                          <div className="flex-1 min-w-0 text-right">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{app.title}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{app.developer}</p>
                          </div>
                        </div>
                      ))}
                      
                      <button
                        onClick={executeSearch}
                        className="mt-2 py-3 px-4 rounded-xl bg-ikyro-blue/10 text-ikyro-blue font-bold text-sm text-center hover:bg-ikyro-blue/20 transition-colors"
                      >
                        {t.viewAllResults} "{localSearchQuery}"
                      </button>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm font-medium">
                      {t.noQuickResults}
                      <button
                        onClick={executeSearch}
                        className="block mt-4 mx-auto py-2 px-6 rounded-full bg-ikyro-blue text-white font-bold text-sm shadow-md"
                      >
                        {t.comprehensiveSearch}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export const BottomNav = () => {
  const { currentView, setCurrentView, language, showReportModal } = useAppStore();
  const t = translations[language];
  
  if (currentView === 'details' || showReportModal) return null;

  const tabs = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'games', label: t.games, icon: Gamepad2 },
    { id: 'apps', label: t.apps, icon: Smartphone },
    { id: 'search', label: t.search, icon: Search },
    { id: 'settings', label: t.settings, icon: Settings },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe pt-2 mb-4">
      <div className="flex items-center justify-around py-3 px-2 rounded-[36px] glass-panel">
        {tabs.map(tab => {
          const isActive = currentView === tab.id;
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.85 }}
              onClick={() => setCurrentView(tab.id as any)}
              className="relative flex flex-col items-center gap-1 min-w-[64px]"
            >
              <motion.div 
                animate={{ scale: isActive ? 1.15 : 1, y: isActive ? -2 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-ikyro-blue' : 'text-gray-500 dark:text-gray-400'}`}
              >
                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
              <span className={`text-[10px] font-medium transition-colors duration-300 ${isActive ? 'text-ikyro-blue' : 'text-gray-500 dark:text-gray-400'}`}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 bg-ikyro-blue/10 dark:bg-ikyro-blue/20 rounded-2xl"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
