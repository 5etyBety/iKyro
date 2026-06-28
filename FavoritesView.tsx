import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppItem } from './types';
import { playSound } from './audio';
import { translations } from './translations';

export interface ToastInfo {
  id: string;
  message: string;
  type: 'added' | 'removed' | 'info';
}

interface AppContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  favorites: AppItem[];
  toggleFavorite: (app: AppItem) => void;
  isFavorite: (id: string) => boolean;
  history: string[];
  addHistory: (term: string) => void;
  clearHistory: () => void;
  clearFavorites: () => void;
  clearDownloads: () => void;
  language: 'ar' | 'en' | 'ku';
  setLanguage: (lang: 'ar' | 'en' | 'ku') => void;
  currentView: 'home' | 'games' | 'apps' | 'modded' | 'search' | 'settings' | 'details' | 'about' | 'privacy' | 'terms' | 'favorites' | 'downloads' | 'language' | 'category';
  setCurrentView: (view: 'home' | 'games' | 'apps' | 'modded' | 'search' | 'settings' | 'details' | 'about' | 'privacy' | 'terms' | 'favorites' | 'downloads' | 'language' | 'category') => void;
  currentCategory: string | null;
  setCurrentCategory: (cat: string | null) => void;
  selectedApp: AppItem | null;
  setSelectedApp: (app: AppItem | null) => void;
  downloadHistory: AppItem[];
  addDownload: (app: AppItem) => void;
  removeDownload: (id: string) => void;
  homeData: { games: AppItem[], apps: AppItem[], popular: AppItem[], modded: AppItem[], aiApps: AppItem[], offlineGames: AppItem[], onlineGames: AppItem[] };
  setHomeData: React.Dispatch<React.SetStateAction<{ games: AppItem[], apps: AppItem[], popular: AppItem[], modded: AppItem[], aiApps: AppItem[], offlineGames: AppItem[], onlineGames: AppItem[] }>>;
  fetchHomeData: () => Promise<void>;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: AppItem[];
  setSearchResults: (results: AppItem[]) => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
  toast: ToastInfo | null;
  hideToast: () => void;
  showToast: (message: string, type?: 'added' | 'removed' | 'info') => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  showReportModal: boolean;
  setShowReportModal: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('ikyro_dark');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [favorites, setFavorites] = useState<AppItem[]>(() => {
    const saved = localStorage.getItem('ikyro_favs');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('ikyro_history');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [language, setLanguage] = useState<'ar' | 'en' | 'ku'>(() => {
    const saved = localStorage.getItem('ikyro_lang');
    return (saved as 'ar' | 'en' | 'ku') || 'ar';
  });

  const [downloadHistory, setDownloadHistory] = useState<AppItem[]>(() => {
    const saved = localStorage.getItem('ikyro_downloads');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentView, setCurrentView] = useState<'home' | 'games' | 'apps' | 'modded' | 'search' | 'settings' | 'details' | 'about' | 'privacy' | 'terms' | 'favorites' | 'downloads' | 'language' | 'category'>('home');
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  
  const [homeData, setHomeData] = useState<{ games: AppItem[], apps: AppItem[], popular: AppItem[], modded: AppItem[], aiApps: AppItem[], offlineGames: AppItem[], onlineGames: AppItem[] }>({ games: [], apps: [], popular: [], modded: [], aiApps: [], offlineGames: [], onlineGames: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AppItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [toast, setToast] = useState<ToastInfo | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    const saved = localStorage.getItem('ikyro_onboarding');
    return saved ? JSON.parse(saved) : false;
  });
  const [showReportModal, setShowReportModal] = useState(false);

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
    localStorage.setItem('ikyro_onboarding', 'true');
  };

  const hideToast = () => setToast(null);

  const showToast = (message: string, type: 'added' | 'removed' | 'info' = 'info') => {
    setToast({ id: Date.now().toString(), message, type });
  };

  const fetchHomeData = async () => {
    if (dataFetched) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/home');
      const data = await res.json();
      if (data.success) {
        setHomeData({ 
          games: data.games, 
          apps: data.apps, 
          popular: data.popular, 
          modded: data.modded || [],
          aiApps: data.aiApps || [],
          offlineGames: data.offlineGames || [],
          onlineGames: data.onlineGames || []
        });
        setDataFetched(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('ikyro_dark', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('ikyro_favs', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('ikyro_history', JSON.stringify(history));
  }, [history]);
  
  useEffect(() => {
    localStorage.setItem('ikyro_downloads', JSON.stringify(downloadHistory));
  }, [downloadHistory]);

  useEffect(() => {
    localStorage.setItem('ikyro_lang', language);
    document.documentElement.dir = language === 'en' ? 'ltr' : 'rtl';
    document.documentElement.lang = language;
  }, [language]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const toggleFavorite = (app: AppItem) => {
    setFavorites(prev => {
      const isFav = prev.some(f => f.id === app.id);
      const t = translations[language];
      
      const newToast: ToastInfo = {
        id: Date.now().toString(),
        message: isFav ? t.removedFromFavorites : t.addedToFavorites,
        type: isFav ? 'removed' : 'added'
      };
      setToast(newToast);
      
      playSound(isFav ? 'remove' : 'add');
      
      if (isFav) {
        return prev.filter(f => f.id !== app.id);
      } else {
        return [...prev, app];
      }
    });
  };

  const isFavorite = (id: string) => favorites.some(f => f.id === id);

  const addHistory = (term: string) => {
    if (!term.trim()) return;
    setHistory(prev => {
      const newHist = [term, ...prev.filter(t => t !== term)].slice(0, 10);
      return newHist;
    });
  };

  const clearHistory = () => setHistory([]);
  const clearFavorites = () => setFavorites([]);
  const clearDownloads = () => setDownloadHistory([]);
  
  const addDownload = (app: AppItem) => {
    setDownloadHistory(prev => {
      const newHist = [{ ...app, downloadDate: new Date().toISOString() }, ...prev.filter(a => a.id !== app.id)];
      return newHist;
    });
  };

  const removeDownload = (id: string) => {
    setDownloadHistory(prev => prev.filter(a => a.id !== id));
  };

  return (
    <AppContext.Provider value={{
      darkMode, toggleDarkMode,
      language, setLanguage,
      favorites, toggleFavorite, isFavorite, clearFavorites,
      history, addHistory, clearHistory,
      currentView, setCurrentView,
      currentCategory, setCurrentCategory,
      selectedApp, setSelectedApp,
      downloadHistory, addDownload, removeDownload, clearDownloads,
      homeData, setHomeData, fetchHomeData, isLoading,
      searchQuery, setSearchQuery,
      searchResults, setSearchResults,
      isSearching, setIsSearching,
      toast, hideToast, showToast,
      hasCompletedOnboarding, completeOnboarding,
      showReportModal, setShowReportModal
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppStore must be used within AppProvider');
  return context;
};
