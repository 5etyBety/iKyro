import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store';
import { GlassPanel, IkyroButton, SectionTitle } from '../components/UI';
import { Star, Download, Share2, Heart, Flag, Shield, Info, Smartphone, FileBox, LayoutGrid } from 'lucide-react';
import { AppCard } from '../components/AppCard';
import { playSound } from '../audio';
import { translations } from '../translations';

export const AppDetailsView = () => {
  const { selectedApp, toggleFavorite, isFavorite, addDownload, homeData, language } = useAppStore();
  const t = translations[language];
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showTelegramAlert, setShowTelegramAlert] = useState(false);

  const recommendedApps = useMemo(() => {
    const all = [...homeData.games, ...homeData.apps].filter(a => a.id !== selectedApp?.id);
    return [...all].sort(() => 0.5 - Math.random()).slice(0, 5);
  }, [homeData, selectedApp]);

  useEffect(() => {
    if (selectedApp) {
      setLoading(true);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      fetch(`/api/details?url=${encodeURIComponent(selectedApp.link)}&lang=${language}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setDetails(data.data);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [selectedApp]);

  if (!selectedApp) return null;

  const isFav = isFavorite(selectedApp.id);

  const handleDownload = async () => {
    if (!details?.downloadPageLink) return;
    setDownloading(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 300);

    try {
      const res = await fetch(`/api/download?url=${encodeURIComponent(details.downloadPageLink)}`);
      const data = await res.json();
      
      clearInterval(progressInterval);
      setProgress(100);

      if (data.success && data.link) {
        if (data.link.includes('t.me') || data.link.includes('telegram')) {
          setDownloading(false);
          playSound('error');
          setShowTelegramAlert(true);
          return;
        }
        playSound('install');
        setTimeout(() => {
          addDownload(selectedApp);
          window.open(data.link, '_blank');
          setDownloading(false);
        }, 400);
      } else {
        setDownloading(false);
        alert(t.downloadLinkNotFound);
      }
    } catch (e) {
      clearInterval(progressInterval);
      setDownloading(false);
      alert(t.downloadError);
    }
  };


  const handleShare = () => {
    const shareText = t.shareAppText + '\n\n' + 'https://www.appcreator24.com/app4098419-806oyw';
    if (navigator.share) {
      navigator.share({
        title: 'iKyro App',
        text: shareText,
        url: 'https://www.appcreator24.com/app4098419-806oyw',
      }).catch((error) => console.log('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        alert(language === 'ar' ? 'تم نسخ الرابط!' : language === 'en' ? 'Link copied!' : 'بەستەر کۆپی کرا!');
      });
    }
  };

  const displayApp = details ? { ...selectedApp, ...details } : selectedApp;

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="pb-8"
    >
      <div className="relative h-64 w-full">
        {/* Header Image Background with Blur */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-110"
            style={{ backgroundImage: `url(${displayApp.image || displayApp.icon})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#090909] to-transparent" />
        </div>
        
        {/* App Icon Centered */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10">
          <motion.img 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            src={displayApp.image || displayApp.icon} 
            alt={displayApp.title || displayApp.name}
            className="w-32 h-auto max-h-32 rounded-2xl shadow-2xl object-cover bg-white dark:bg-[#1E1E1E]"
          />
        </div>
      </div>

      <div className="mt-20 px-4 flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{displayApp.title || displayApp.name}</h1>
        {displayApp.developer && displayApp.developer !== 'Unknown' && (
           <p className="text-ikyro-blue font-bold mt-1 text-sm">{displayApp.developer}</p>
        )}
        
        {/* Stats Row */}
        <div className="flex gap-6 mt-6 justify-center text-gray-500 dark:text-gray-400">
          {displayApp.size && (
            <>
              <div className="flex flex-col items-center">
                <span className="font-bold text-gray-900 dark:text-white">{displayApp.size.toUpperCase().replace(/\s+/g, '')}</span>
                <span className="text-[10px]">{t.size}</span>
              </div>
              <div className="w-px h-8 bg-gray-200 dark:bg-white/10" />
            </>
          )}
          <div className="flex flex-col items-center">
            <span className="font-bold text-gray-900 dark:text-white">{displayApp.downloads}</span>
            <span className="text-[10px]">{t.downloadsCount}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full mt-8">
          <IkyroButton className="flex-1 py-4 text-lg shadow-lg relative overflow-hidden" onClick={handleDownload} disabled={loading || downloading}>
            {downloading && (
              <div 
                className="absolute left-0 top-0 bottom-0 bg-white/20 transition-all duration-300" 
                style={{ width: `${progress}%` }} 
              />
            )}
            <div className="relative z-10 flex items-center justify-center gap-2">
              {downloading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{progress}%</span>
                </>
              ) : (
                <><Download className="w-5 h-5" /> {t.download}</>
              )}
            </div>
          </IkyroButton>
          <motion.button 
            whileTap={{ scale: 0.8, rotate: -15 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onClick={() => toggleFavorite(selectedApp)}
            className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white dark:bg-[#1E1E1E] text-gray-600 dark:text-gray-300 shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-gray-100 dark:border-white/5 shrink-0"
          >
            <Heart className={`w-6 h-6 transition-colors duration-300 ${isFav ? 'fill-red-500 text-red-500 scale-110' : ''}`} />
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white dark:bg-[#1E1E1E] text-gray-600 dark:text-gray-300 shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-gray-100 dark:border-white/5 shrink-0"
          >
            <Share2 className="w-6 h-6" />
          </motion.button>
        </div>
      </div>

      <div className="px-4 mt-8 flex flex-col gap-6">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-8 h-8 border-4 border-ikyro-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Screenshots */}
            {displayApp.screenshots && displayApp.screenshots.length > 0 && (
              <div>
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
                  {displayApp.screenshots.map((src: string, i: number) => (
                    <div key={i} className="relative shrink-0 snap-center">
                      <img 
                        src={src} 
                        alt="Screenshot" 
                        className="h-64 object-contain rounded-[24px] shadow-sm border border-black/5 dark:border-white/5 bg-gray-100 dark:bg-[#1E1E1E]"
                      />
                      <div className="absolute bottom-3 right-3 bg-white px-3 py-1 rounded-lg shadow-md z-10 flex items-center justify-center">
                        <img 
                          src="/watermark.png" 
                          alt="iKyro" 
                          className="h-8 object-contain hidden" 
                          onLoad={(e) => {
                            e.currentTarget.classList.remove('hidden');
                            e.currentTarget.nextElementSibling?.classList.add('hidden');
                          }}
                        />
                        <span className="text-black text-base font-bold font-sans">iKyro</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <GlassPanel>
              <h3 className="text-lg font-bold mb-2 tracking-tight">{t.description}</h3>
              <div 
                className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium opacity-90 [&>p]:mb-3 [&>b]:text-gray-900 dark:[&>b]:text-white [&>ul]:list-disc [&>ul]:mr-4 [&>ul]:mb-3 [&_br]:mb-2"
                dangerouslySetInnerHTML={{ __html: displayApp.description?.replace(/عرض المزيد|Show More|Read More/gi, '') || '' }}
              />
            </GlassPanel>

            {/* Publisher Apps */}
            {displayApp.developer && displayApp.developer !== 'Unknown' && homeData.games.concat(homeData.apps).filter(a => a.developer === displayApp.developer && a.id !== displayApp.id).length > 0 && (
              <div className="mt-2">
                <SectionTitle icon={<LayoutGrid className="w-5 h-5" />} title={t.moreFromPublisher} />
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar mt-4">
                  {homeData.games.concat(homeData.apps)
                    .filter(a => a.developer === displayApp.developer && a.id !== displayApp.id)
                    .map(app => (
                      <div key={app.id} className="w-[280px] shrink-0 snap-center">
                        <AppCard app={app} />
                      </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <GlassPanel className="flex flex-col gap-2 !p-4 justify-center items-center text-center">
                <Smartphone className="w-5 h-5 text-ikyro-blue mb-1"/>
                <span className="text-gray-500 dark:text-gray-400 text-xs">{t.requirements}</span>
                <span className="text-sm font-bold tracking-tight text-right dir-ltr">{displayApp.requirements || 'Android'}</span>
              </GlassPanel>
              <GlassPanel className="flex flex-col gap-2 !p-4 justify-center items-center text-center">
                <Info className="w-5 h-5 text-ikyro-blue mb-1"/>
                <span className="text-gray-500 dark:text-gray-400 text-xs">{t.version}</span>
                <span className="text-sm font-bold tracking-tight">{displayApp.version}</span>
              </GlassPanel>
              <GlassPanel className="flex flex-col gap-2 !p-4 justify-center items-center text-center">
                <FileBox className="w-5 h-5 text-ikyro-blue mb-1"/>
                <span className="text-gray-500 dark:text-gray-400 text-xs">{t.category}</span>
                <span className="text-sm font-bold tracking-tight">{t.categoryNames?.[displayApp.category] || displayApp.category}</span>
              </GlassPanel>
              <GlassPanel className="flex flex-col gap-2 !p-4 justify-center items-center text-center">
                <Shield className="w-5 h-5 text-ikyro-blue mb-1"/>
                <span className="text-gray-500 dark:text-gray-400 text-xs">{t.modification}</span>
                <span className="text-sm font-bold tracking-tight text-ikyro-blue">{displayApp.modLabel ? t.modded : t.official}</span>
              </GlassPanel>
            </div>
          </>
        )}

        {/* Recommended Apps */}
        {recommendedApps.length > 0 && (
          <div className="mt-6 mb-4">
            <SectionTitle icon={<Star className="w-5 h-5" />} title={t.recommendedForYou} />
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar mt-4">
              {recommendedApps.map(app => (
                <div key={app.id} className="w-[280px] shrink-0 snap-center">
                  <AppCard app={app} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showTelegramAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4"
            onClick={() => setShowTelegramAlert(false)}
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
                  {t.cannotInstall}
                </p>
              </div>
              <div className="w-full border-t border-[#3c3c43]/20 dark:border-white/20">
                <button 
                  className="w-full py-[11px] text-[17px] text-[#007AFF] font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors active:bg-black/10 dark:active:bg-white/10" 
                  onClick={() => setShowTelegramAlert(false)}
                >
                  {t.ok}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
