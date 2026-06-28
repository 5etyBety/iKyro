import React from 'react';
import { motion } from 'motion/react';
import { categories } from '../data';
import { AppCard, SkeletonAppCard } from '../components/AppCard';
import { SectionTitle, GlassPanel } from '../components/UI';
import * as Icons from 'lucide-react';
import { Category, AppItem } from '../types';
import { useAppStore } from '../store';
import { translations } from '../translations';

const ModdedAppCard = ({ app }: { app: AppItem | any }) => {
  const { setCurrentView, setSelectedApp, language } = useAppStore();
  const t = translations[language];

  const handleOpen = () => {
    setSelectedApp(app);
    setCurrentView('details');
  };

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      onClick={handleOpen}
      className="cursor-pointer flex flex-col gap-3 w-[120px] shrink-0 snap-center"
    >
      <div className="relative w-full aspect-square rounded-[28px] bg-white dark:bg-gray-900 p-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.15)] overflow-hidden group border border-white/20 dark:border-black/20">
        <div className="absolute inset-0 bg-gradient-to-tr from-red-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <img src={app.icon || app.image} alt={app.title} className="w-full h-full object-contain rounded-[22px] bg-white dark:bg-gray-800 p-1" />
        <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-tl-xl rounded-br-[28px] shadow-md z-10 flex items-center gap-1">
          <Icons.Flame className="w-2.5 h-2.5" />
          {t.modded}
        </div>
      </div>
      <div className="text-center px-1">
        <h3 className="font-bold text-[13px] text-gray-900 dark:text-white truncate leading-tight">{app.title || app.name}</h3>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 font-medium">{t.categoryNames?.[app.category] || app.category}</p>
      </div>
    </motion.div>
  );
};

export const HomeView = ({ filter }: { filter?: string; key?: React.Key }) => {
  const { homeData, fetchHomeData, isLoading, setCurrentView, setCurrentCategory, setHomeData, language } = useAppStore();
  const t = translations[language];
  const [subCategory, setSubCategory] = React.useState<string | null>(null);
  
  const [page, setPage] = React.useState(1);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  
  const slugMap: Record<string, string> = {
    'أكشن': 'action', 'أركيد': 'arcade',
    'سباق': 'racing', 'محاكاة': 'simulation', 'رياضة': 'sports',
    'استراتيجية': 'strategy', 'تقمص أدوار': 'role-playing', 'ألغاز': 'puzzle',
    'ألعاب خفيفة': 'casual', 'مغامرة': 'adventure', 'لوحة': 'board',
    'ورق': 'card', 'كازينو': 'casino', 'تعليم': 'educational',
    'موسيقى': 'music', 'كلمات': 'word', 'أدوات': 'tools', 'تواصل': 'social',
    'تصوير': 'photography', 'فيديو': 'video-players',
    'إنتاجية': 'productivity', 'تخصيص': 'personalization', 'نمط حياة': 'lifestyle',
    'فن وتصميم': 'art-design', 'تصميم': 'design', 'أمن': 'security',
    'نظام': 'system', 'محاكيات': 'emulators', 'متصفحات': 'browsers', 'تخزين': 'storage',
    'أعمال': 'business', 'ترفيه': 'entertainment', 'مال': 'finance',
    'صحة ولياقة': 'health-fitness', 'طب': 'medical', 'أخبار': 'news-magazines',
    'تسوّق': 'shopping', 'سفر': 'travel-local', 'طقس': 'weather'
  };

  React.useEffect(() => {
    setPage(1);
    setHasMore(true);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [filter, subCategory]);

  React.useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchMore = async (pageNum: number = page + 1) => {
    if (loadingMore || (!hasMore && pageNum > 1)) return;
    
    setLoadingMore(true);
    try {
      const type = (filter === 'التطبيقات' || filter === 'apps') ? 'apps' : 'games';
      const subSlug = subCategory ? slugMap[subCategory] : '';
      let url = `/api/list?type=${type}&page=${pageNum}`;
      if (subSlug) url += `&subcategory=${subSlug}`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.success && data.items.length > 0) {
        setHomeData((prev: any) => {
          const typeKey = type === 'games' ? 'games' : 'apps';
          const existingIds = new Set(prev[typeKey].map((a: any) => a.id));
          const newItems = data.items.filter((a: any) => !existingIds.has(a.id)).map((a: any) => ({
             ...a,
             category: subCategory ? subCategory : a.category
          }));
          return {
            ...prev,
            [typeKey]: [...prev[typeKey], ...newItems]
          };
        });
        setPage(pageNum);
      } else {
        setHasMore(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMore(false);
    }
  };

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      const clientHeight = document.documentElement.clientHeight || window.innerHeight;
      
      if (scrollY + clientHeight >= scrollHeight - 500) {
        fetchMore();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, loadingMore, hasMore, filter, subCategory]);

  const allFetchedApps = [...homeData.games, ...homeData.apps, ...homeData.popular, ...homeData.modded];
  // Deduplicate by id
  const uniqueApps = Array.from(new Map([...allFetchedApps].map(item => [item.id, item])).values());

  const getFilteredApps = () => {
    let baseApps: any[] = [];
    if (!filter) {
      baseApps = homeData.popular.length > 0 ? homeData.popular : [];
    } else {
      switch (filter) {
        case 'الألعاب':
        case 'games':
          baseApps = homeData.games;
          break;
        case 'التطبيقات':
        case 'apps':
          baseApps = homeData.apps;
          break;
        case 'مهكرة':
        case 'modded':
          baseApps = uniqueApps.filter(a => a.category === 'مهكرة' || (a.title || a.name || '').toLowerCase().includes('mod') || homeData.modded.some(m => m.id === a.id));
          break;
        case 'الأكثر تثبيتاً':
        case 'top':
          baseApps = [...uniqueApps].sort((a, b) => {
            const parseDownloads = (d: string) => {
              if (!d) return 0;
              const num = parseFloat(d.replace(/[^\d.]/g, '')) || 0;
              if (d.toUpperCase().includes('M')) return num * 1000000;
              if (d.toUpperCase().includes('K')) return num * 1000;
              return num;
            };
            return parseDownloads(b.downloads) - parseDownloads(a.downloads);
          });
          break;
        case 'الأكثر شهرة':
        case 'trending':
          baseApps = uniqueApps.filter(a => homeData.popular.some(p => p.id === a.id));
          break;
        case 'الجديدة':
        case 'new':
          baseApps = [...uniqueApps].reverse();
          break;
        case 'المميزة':
        case 'featured':
          baseApps = [];
          break;
        case 'Premium':
        case 'premium':
          baseApps = uniqueApps.filter(a => a.isPremium);
          break;
        default:
          // match specific category like الذكاء الاصطناعي, الفيديو, etc.
          baseApps = uniqueApps.filter(a => 
            (a.category && a.category.includes(filter)) || 
            (a.title && a.title.includes(filter)) ||
            (a.description && a.description.includes(filter))
          );
          break;
      }
    }

    if (subCategory && (filter === 'الألعاب' || filter === 'التطبيقات')) {
      baseApps = baseApps.filter(a => a.category && a.category.includes(subCategory));
    }
    
    // Deduplicate to prevent key errors
    return Array.from(new Map(baseApps.map(item => [item.id, item])).values());
  };

  const apps = getFilteredApps();

  React.useEffect(() => {
    if (subCategory && apps.length < 5 && !loadingMore && hasMore) {
      fetchMore(1);
    }
  }, [subCategory, apps.length]);

  const handleCategoryClick = (cat: Category) => {
    setCurrentCategory(cat.name);
    setCurrentView('category');
  };

  const renderCategory = (cat: Category) => {
    // @ts-ignore
    const Icon = Icons[cat.icon] || Icons.Box;
    const catName = t.categoryNames?.[cat.name] || cat.name;

    return (
      <GlassPanel 
        key={cat.id} 
        onClick={() => handleCategoryClick(cat)}
        className="flex flex-col items-center justify-center min-w-[80px] h-[80px] gap-2 shrink-0 snap-center cursor-pointer hover:bg-white/90 dark:hover:bg-[#1E1E1E]/90 transition-colors"
      >
        <Icon className="w-6 h-6 text-ikyro-blue" />
        <span className="text-[10px] font-bold whitespace-nowrap">{catName}</span>
      </GlassPanel>
    );
  };

  const renderSubCategories = (forcedType?: 'الألعاب' | 'التطبيقات') => {
    const activeFilter = forcedType || filter;
    if (activeFilter !== 'الألعاب' && activeFilter !== 'التطبيقات') return null;
    
    const gameCats = ['أكشن', 'أركيد', 'سباق', 'محاكاة', 'رياضة', 'استراتيجية', 'تقمص أدوار', 'ألغاز', 'ألعاب خفيفة', 'مغامرة', 'لوحة', 'ورق', 'كازينو', 'موسيقى', 'كلمات'];
    const appCats = ['أدوات', 'تواصل', 'تصوير', 'فيديو', 'إنتاجية', 'تخصيص', 'نمط حياة', 'فن وتصميم', 'تصميم', 'أمن', 'نظام', 'محاكيات', 'متصفحات', 'تخزين', 'أعمال', 'ترفيه', 'مال', 'صحة ولياقة', 'طب', 'أخبار', 'طقس', 'تسوّق', 'سفر', 'تعليم'];
    
    const subCategories = activeFilter === 'الألعاب' ? gameCats : appCats;

    return (
      <div className="-mx-4 px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-4 snap-x hide-scrollbar">
          {!forcedType && (
            <div
              onClick={() => { setSubCategory(null); setPage(1); setHasMore(true); }}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap cursor-pointer transition-colors snap-center border shrink-0 ${
                subCategory === null 
                  ? 'bg-ikyro-blue text-white border-ikyro-blue' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {t.all}
            </div>
          )}
          {subCategories.map(cat => (
            <div
              key={cat}
              onClick={() => {
                if (forcedType) {
                  setCurrentCategory(forcedType);
                  setCurrentView('category');
                }
                setSubCategory(cat); setPage(1); setHasMore(true);
              }}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap cursor-pointer transition-colors snap-center border shrink-0 ${
                (!forcedType && subCategory === cat)
                  ? 'bg-ikyro-blue text-white border-ikyro-blue' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {t.subcats?.[cat] || cat}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading && apps.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="px-4 py-6 flex flex-col gap-4 overflow-hidden pb-24"
      >
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
        {[...Array(6)].map((_, i) => (
          <SkeletonAppCard key={i} />
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="px-4 py-6 flex flex-col gap-8 overflow-hidden pb-24"
    >
      {/* Banner */}
      {!filter && (
        <motion.div 
          whileTap={{ scale: 0.98 }}
          className="w-full h-48 rounded-3xl ikyro-gradient ikyro-glow relative overflow-hidden flex items-center justify-between p-6"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-white max-w-[60%]">
            <h2 className="text-2xl font-bold mb-2 tracking-tight">{t.discover}<br/>{t.appsAndGames}</h2>
            <p className="text-sm opacity-90 font-medium">{t.carefullySelected}</p>
          </div>
          <Icons.Sparkles className="w-24 h-24 text-white/30 relative z-10" />
        </motion.div>
      )}

      {/* Categories */}
      {!filter && (
        <div className="-mx-4 px-4">
          <SectionTitle title={t.categoriesTitle} />
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
            <div 
              onClick={() => setCurrentView('modded')}
              className="flex flex-col items-center justify-center min-w-[80px] h-[80px] gap-2 shrink-0 snap-center cursor-pointer rounded-3xl ikyro-gradient shadow-[0_8px_20px_rgba(52,197,239,0.3)] hover:scale-105 transition-transform"
            >
              <Icons.Flame className="w-6 h-6 text-white drop-shadow-md" />
              <span className="text-[10px] font-bold whitespace-nowrap text-white">{t.modded}</span>
            </div>
            {categories.map(renderCategory)}
          </div>
        </div>
      )}

      {/* Main Home Sections */}
      {!filter ? (
        <div className="flex flex-col gap-2 pb-16">
          <SectionTitle title={t.recommended} />
          <div className="flex flex-col gap-4 mb-4">
            {uniqueApps.slice(0, 5).map((app: any) => <AppCard key={`rec-${app.id}`} app={app} />)}
          </div>

          <SectionTitle title={t.topApps} />
          <div className="flex flex-col gap-4 mb-4">
            {homeData.apps.slice(0, 5).map((app: any) => <AppCard key={`app-${app.id}`} app={app} />)}
          </div>
          
          <SectionTitle title={t.featuredGames} />
          <div className="flex flex-col gap-4 mb-4">
            {homeData.games.slice(0, 5).map((app: any) => <AppCard key={`game-${app.id}`} app={app} />)}
          </div>

          {homeData.popular.length > 0 && (
            <>
              <SectionTitle title={t.trending} />
              <div className="flex flex-col gap-4 mb-4">
                {homeData.popular.slice(0, 5).map((app: any) => <AppCard key={`pop-${app.id}`} app={app} />)}
              </div>
            </>
          )}

          {homeData.modded.length > 0 && (
            <>
              <SectionTitle title={t.moddedGames} />
              <div className="flex flex-col gap-4 mb-4">
                {homeData.modded.slice(0, 5).map((app: any) => <AppCard key={`mod-${app.id}`} app={app} />)}
              </div>
            </>
          )}

          {homeData.aiApps?.length > 0 && (
            <>
              <SectionTitle title={t.aiApps} />
              <div className="flex flex-col gap-4 mb-4">
                {homeData.aiApps.slice(0, 5).map((app: any) => <AppCard key={`ai-${app.id}`} app={app} />)}
              </div>
            </>
          )}

          {homeData.offlineGames?.length > 0 && (
            <>
              <SectionTitle title={t.offlineGames} />
              <div className="flex flex-col gap-4 mb-4">
                {homeData.offlineGames.slice(0, 5).map((app: any) => <AppCard key={`off-${app.id}`} app={app} />)}
              </div>
            </>
          )}

          {homeData.onlineGames?.length > 0 && (
            <>
              <SectionTitle title={t.onlineGames} />
              <div className="flex flex-col gap-4 mb-4">
                {homeData.onlineGames.slice(0, 5).map((app: any) => <AppCard key={`on-${app.id}`} app={app} />)}
              </div>
            </>
          )}
        </div>
      ) : (
        <div>
          {renderSubCategories()}
          <SectionTitle title={t.categoryNames?.[filter] || filter} />
          {apps.length > 0 ? (
            <div className="flex flex-col gap-4">
              {apps.map((app: any) => (
                <AppCard key={app.id} app={app} />
              ))}
              {loadingMore && (
                <>
                  {[...Array(3)].map((_, i) => (
                    <SkeletonAppCard key={`skeleton-${i}`} />
                  ))}
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Icons.Inbox className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t.noAppsFound}</h3>
              <p className="text-sm text-gray-500">{t.noAppsDesc}</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
