import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AppCard, SkeletonAppCard } from '../components/AppCard';
import { Search, X, Clock } from 'lucide-react';
import { useAppStore } from '../store';
import { AppItem } from '../types';
import { translations } from '../translations';

export const SearchView = () => {
  const { history, addHistory, clearHistory, searchQuery: query, setSearchQuery: setQuery, searchResults: results, setSearchResults: setResults, isSearching, setIsSearching, homeData, language } = useAppStore();
  const t = translations[language];

  const [localResults, setLocalResults] = useState<any[]>([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        search(query);
      } else {
        setResults([]);
        setLocalResults([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const search = async (term: string) => {
    // Local search first
    const lTerm = term.toLowerCase();
    const allApps = [...homeData.games, ...homeData.apps, ...homeData.popular, ...homeData.modded];
    const uniqueApps = Array.from(new Map(allApps.map(a => [a.id, a])).values());
    const matched = uniqueApps.filter(a => 
      (a.title || a.name || '').toLowerCase().includes(lTerm) || 
      (a.category || '').toLowerCase().includes(lTerm)
    );
    setLocalResults(matched.slice(0, 10)); // Top 10 local matches

    setIsSearching(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.results);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (term: string) => {
    setQuery(term);
    if (term.trim()) {
      addHistory(term);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="flex flex-col min-h-screen"
    >
      <div className="px-4 py-4 flex-1 mb-20">
        {!query && history.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-24 text-center px-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="relative w-48 h-48 mb-8"
            >
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
                <circle cx="100" cy="100" r="80" className="fill-ikyro-blue/10" />
                <circle cx="100" cy="100" r="55" className="fill-ikyro-blue/20" />
                <g className="text-ikyro-blue drop-shadow-md">
                  <path d="M120 120L150 150" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
                  <circle cx="95" cy="95" r="40" stroke="currentColor" strokeWidth="14" />
                </g>
                <path d="M80 95C80 86.7157 86.7157 80 95 80" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-white dark:text-[#1E1E1E]" />
                
                <rect x="30" y="45" width="28" height="28" rx="8" fill="#FF4B4B" className="animate-pulse" />
                <rect x="145" y="55" width="20" height="20" rx="6" fill="#12C99B" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                <rect x="45" y="145" width="16" height="16" rx="5" fill="#FFC107" className="animate-pulse" style={{ animationDelay: '1s' }} />
              </svg>
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">{t.searchForAnythingNew}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium max-w-[260px] leading-relaxed">
              {t.exploreThousandsOfApps}
            </p>
          </div>
        )}

        {!query && history.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white tracking-tight">{t.recentSearches}</h3>
              <button onClick={clearHistory} className="text-xs text-red-500 font-bold">{t.clearHistory}</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {history.map((term, i) => (
                <button
                  key={i}
                  onClick={() => handleSearch(term)}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-white/5 shadow-sm rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  <Clock className="w-3 h-3 text-gray-400" />
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {query && isSearching && (
          <div className="flex flex-col gap-4 pt-4">
            {localResults.length > 0 && (
              <>
                <h3 className="font-bold text-gray-900 dark:text-white tracking-tight mb-2">{t.quickResults}</h3>
                {localResults.map(app => (
                  <AppCard key={app.id} app={app} />
                ))}
              </>
            )}
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2 mt-4" />
            {[...Array(4)].map((_, i) => (
              <SkeletonAppCard key={i} />
            ))}
          </div>
        )}

        {query && !isSearching && (results.length > 0 || localResults.length > 0) && (
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-gray-900 dark:text-white tracking-tight mb-2">{t.searchResults}</h3>
            {Array.from(new Map([...localResults, ...results].map(a => [a.id, a])).values()).map(app => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        )}

        {query && !isSearching && results.length === 0 && localResults.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-24 text-gray-500 dark:text-gray-400">
            <div className="w-20 h-20 bg-gray-100 dark:bg-[#1E1E1E] rounded-full flex items-center justify-center mb-6">
              <Search className="w-8 h-8 opacity-50" />
            </div>
            <p className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">{t.noResultsFound}</p>
            <p className="text-sm font-medium mt-2">{t.tryOtherKeywords}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
