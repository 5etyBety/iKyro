import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store';
import { GlassPanel } from '../components/UI';
import { Moon, Sun, Trash2, Shield, FileText, Info, ChevronLeft, Globe, AlertTriangle, Share2, Bug, X, Send, Instagram } from 'lucide-react';

import { translations } from '../translations';

export const SettingsView = () => {
  const { darkMode, toggleDarkMode, clearHistory, clearFavorites, clearDownloads, favorites, downloadHistory, setCurrentView, language, setLanguage, showReportModal, setShowReportModal, showToast } = useAppStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'checking' | 'uptodate'>('idle');
  const t = translations[language];
  const [reportMessage, setReportMessage] = useState('');
  const [selectedProblemType, setSelectedProblemType] = useState<string>('appIssue');
  const [showProblemTypeSelector, setShowProblemTypeSelector] = useState(false);

  const handleClearData = () => {
    clearHistory();
    clearFavorites();
    clearDownloads();
    setShowConfirm(false);
  };

  const handleShareApp = () => {
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

  const handleSendReport = () => {
    const typeLabel = t.problemTypes[selectedProblemType as keyof typeof t.problemTypes];
    const description = (t.problemDescriptions as any)?.[selectedProblemType as keyof typeof t.problemTypes] || '';
    const subject = encodeURIComponent(`${t.reportProblem}: ${typeLabel}`);
    const fullMessage = `${description}\n\n${reportMessage}`;
    const body = encodeURIComponent(fullMessage);
    window.location.href = `mailto:5etyBety@gmail.com?subject=${subject}&body=${body}`;
    setShowReportModal(false);
    showToast(t.responseSent, 'info');
  };

  const handleCheckUpdate = () => {
    if (isCheckingUpdate) return;
    setIsCheckingUpdate(true);
    setUpdateStatus('checking');
    setTimeout(() => {
      setIsCheckingUpdate(false);
      setUpdateStatus('uptodate');
      setTimeout(() => setUpdateStatus('idle'), 3000);
    }, 1500);
  };

  const SettingRow = ({ icon: Icon, title, value, onClick, destructive, iconBg }: any) => (
    <motion.div 
      whileTap="tap"
      onClick={onClick}
      variants={{
        tap: { scale: 0.98 }
      }}
      className={`flex items-center justify-between p-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${destructive ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}
    >
      <div className="flex items-center gap-3">
        <motion.div 
          variants={{
            tap: { scale: 0.8, rotate: -15, borderRadius: "12px" }
          }}
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconBg || (destructive ? 'bg-red-500' : 'bg-gray-400')}`}
        >
          <Icon className="w-5 h-5 text-white" />
        </motion.div>
        <span className="font-bold tracking-tight">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm font-medium text-gray-500">{value}</span>}
        <ChevronLeft className="w-4 h-4 text-gray-400 rtl:rotate-0 ltr:rotate-180" />
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="px-4 py-6 pt-12 flex flex-col gap-6"
    >
      <div className="mb-2 px-2 flex items-center justify-between">
        <h1 className="text-[34px] font-bold tracking-tight text-black dark:text-white">{t.settings}</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div whileTap={{ scale: 0.95 }} onClick={() => setCurrentView('favorites')}>
          <GlassPanel className="flex flex-col items-center justify-center p-6 cursor-pointer">
            <span className="text-3xl font-bold tracking-tight text-ikyro-blue mb-1">{favorites.length}</span>
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{t.favorites}</span>
          </GlassPanel>
        </motion.div>
        <motion.div whileTap={{ scale: 0.95 }} onClick={() => setCurrentView('downloads')}>
          <GlassPanel className="flex flex-col items-center justify-center p-6 cursor-pointer">
            <span className="text-3xl font-bold tracking-tight text-ikyro-light mb-1">{downloadHistory.length}</span>
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{t.downloads}</span>
          </GlassPanel>
        </motion.div>
      </div>

      {/* Settings */}
      <div className="flex flex-col gap-4 mb-20">
        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 px-2 tracking-tight">{t.settings}</h3>
        <GlassPanel className="!p-0 overflow-hidden flex flex-col divide-y divide-gray-100 dark:divide-white/5">
          {/* Animated Dark Mode Toggle */}
          <motion.div 
            whileTap="tap"
            variants={{ tap: { scale: 0.98 } }}
            onClick={toggleDarkMode}
            className="flex items-center justify-between p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <motion.div
                variants={{ tap: { scale: 0.8, rotate: -15, borderRadius: "12px" } }}
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-slate-800 dark:bg-slate-700"
              >
                <motion.div
                  key={darkMode ? 'moon' : 'sun'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                >
                  {darkMode ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
                </motion.div>
              </motion.div>
              <span className="font-bold tracking-tight text-gray-900 dark:text-white">{t.darkMode}</span>
            </div>
            <button
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none pointer-events-none ${darkMode ? 'bg-ikyro-blue' : 'bg-gray-300 dark:bg-gray-700'}`}
            >
              <span className="sr-only">{t.darkMode}</span>
              <motion.span
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${darkMode ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-1 rtl:-translate-x-1'}`}
              />
            </button>
          </motion.div>

          {/* Language Selector */}
          <motion.button 
            whileTap="tap"
            variants={{ tap: { scale: 0.98 } }}
            onClick={() => setCurrentView('language')}
            className="flex items-center justify-between p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors w-full"
          >
            <div className="flex items-center gap-3">
              <motion.div 
                variants={{ tap: { scale: 0.8, rotate: -15, borderRadius: "12px" } }}
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-teal-500"
              >
                <Globe className="w-5 h-5 text-white" />
              </motion.div>
              <span className="font-bold tracking-tight text-gray-900 dark:text-white">{t.language}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">
                {language === 'ar' ? 'العربية' : language === 'en' ? 'English' : 'Kurdî (کوردی)'}
              </span>
              <ChevronLeft className="w-4 h-4 text-gray-400 rtl:rotate-0 ltr:rotate-180" />
            </div>
          </motion.button>

          <SettingRow 
            icon={Trash2} 
            title={t.clearData} 
            destructive
            iconBg="bg-red-500"
            onClick={() => setShowConfirm(true)} 
          />
        </GlassPanel>

        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 px-2 mt-2 tracking-tight">{t.appUpdate}</h3>
        <GlassPanel className="!p-0 overflow-hidden flex flex-col divide-y divide-gray-100 dark:divide-white/5">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-blue-500">
                <Info className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-gray-900 dark:text-white">{t.currentVersion}</span>
                <span className="text-xs font-medium text-gray-500 mt-0.5">0.5.0</span>
              </div>
            </div>
            {updateStatus === 'uptodate' && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs font-bold text-green-600 dark:text-green-400">{t.appUpToDate}</span>
              </motion.div>
            )}
          </div>
          <button 
            onClick={handleCheckUpdate}
            disabled={isCheckingUpdate}
            className={`flex items-center justify-center p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors w-full font-bold text-sm ${isCheckingUpdate ? 'text-gray-400' : 'text-ikyro-blue'}`}
          >
            {isCheckingUpdate ? (
              <div className="flex items-center gap-2">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }}>
                  <Globe className="w-4 h-4" />
                </motion.div>
                <span>{language === 'ar' ? 'جاري التحقق...' : language === 'en' ? 'Checking...' : 'پشکنین...'}</span>
              </div>
            ) : t.checkForUpdates}
          </button>
        </GlassPanel>

        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 px-2 mt-2 tracking-tight">{t.aboutApp}</h3>
        <GlassPanel className="!p-0 overflow-hidden flex flex-col divide-y divide-gray-100 dark:divide-white/5">
          <SettingRow icon={Share2} title={t.shareApp} iconBg="bg-indigo-500" onClick={handleShareApp} />
          <SettingRow icon={Bug} title={t.reportProblem} iconBg="bg-orange-500" onClick={() => { setReportMessage(''); setShowReportModal(true); }} />
          <SettingRow icon={Info} title={t.aboutIkyro} iconBg="bg-blue-500" onClick={() => setCurrentView('about')} />
          <SettingRow icon={Shield} title={t.privacy} iconBg="bg-green-500" onClick={() => setCurrentView('privacy')} />
          <SettingRow icon={FileText} title={t.terms} iconBg="bg-gray-500" onClick={() => setCurrentView('terms')} />
        </GlassPanel>

        <div className="mt-8 mb-4 flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
          <p className="text-[13px] font-medium opacity-80 text-center">الحقوق الابداعية و البصرية محفوظة للمهندس حسين علي</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-semibold tracking-wider opacity-90">@HusAli95</span>
            <a href="https://instagram.com/HusAli95" target="_blank" className="p-1.5 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 transition-colors">
              <Instagram className="w-4 h-4 opacity-80" />
            </a>
            <a href="https://t.me/HusAli95" target="_blank" className="p-1.5 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 transition-colors">
              <svg className="w-4 h-4 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.233-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/40 flex flex-col items-center justify-end sm:justify-center p-4 pb-20"
            onClick={() => setShowReportModal(false)}
          >
            <motion.div
              layout
              initial={{ y: 100, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm glass-panel rounded-[36px] p-6 shadow-2xl relative mb-12 sm:mb-0"
            >
              <div className="flex items-center gap-3 mb-6 text-ikyro-blue">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Bug className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{t.reportProblem}</h3>
              </div>

              <AnimatePresence mode="wait">
              {!showProblemTypeSelector ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="mb-4 relative">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t.selectProblemType}</label>
                    <motion.div 
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowProblemTypeSelector(true)}
                      className="w-full p-4 glass-panel rounded-2xl flex justify-between items-center cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <span className="text-gray-900 dark:text-white font-bold text-[15px]">{t.problemTypes[selectedProblemType as keyof typeof t.problemTypes]}</span>
                      <ChevronLeft className="w-5 h-5 text-gray-400 rtl:rotate-0 ltr:rotate-180" />
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    layout
                    className="mb-4 p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10"
                  >
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
                      {(t.problemDescriptions as any)?.[selectedProblemType]}
                    </p>
                  </motion.div>

                  <textarea
                    value={reportMessage}
                    onChange={e => setReportMessage(e.target.value)}
                    placeholder={language === 'ar' ? 'اكتب رسالتك هنا...' : language === 'en' ? 'Write your message here...' : 'لێرە پەیامەکەت بنووسە...'}
                    className="w-full h-32 p-4 glass-panel rounded-2xl text-[15px] mb-6 outline-none focus:ring-2 focus:ring-ikyro-blue resize-none text-gray-900 dark:text-white placeholder:text-gray-400 transition-shadow duration-300"
                  />
                  <div className="flex flex-col gap-3">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSendReport}
                      className="w-full py-4 bg-ikyro-blue text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
                    >
                      <Send className="w-5 h-5" />
                      {language === 'ar' ? 'إرسال عبر الإيميل' : language === 'en' ? 'Send via Email' : 'ناردن بە ئیمەیڵ'}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowReportModal(false)}
                      className="w-full py-4 text-gray-500 dark:text-gray-400 font-bold"
                    >
                      {t.cancel}
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="selector"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <button onClick={() => setShowProblemTypeSelector(false)} className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white ltr:rotate-180 rtl:rotate-0" />
                    </button>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">{t.selectProblemType}</h4>
                  </div>
                  <div className="flex flex-col divide-y divide-gray-100 dark:divide-white/5 glass-panel rounded-[24px] overflow-hidden !p-0">
                    {Object.keys(t.problemTypes).map((key) => (
                      <motion.button
                        whileTap={{ scale: 0.98, backgroundColor: "rgba(0,0,0,0.05)" }}
                        key={key}
                        onClick={() => {
                          setSelectedProblemType(key);
                          setShowProblemTypeSelector(false);
                        }}
                        className="flex items-center justify-between p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      >
                        <span className="text-[15px] font-medium text-gray-900 dark:text-white">
                          {t.problemTypes[key as keyof typeof t.problemTypes]}
                        </span>
                        {selectedProblemType === key && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-5 h-5 rounded-full bg-ikyro-blue flex items-center justify-center shadow-sm"
                          >
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                <h3 className="text-[17px] font-semibold text-black dark:text-white leading-tight">{t.clearData}</h3>
                <p className="text-[13px] text-black/70 dark:text-white/70 leading-snug">
                  {t.dataWillBeDeleted}
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
                  className="flex-1 py-[11px] text-[17px] text-[#FF3B30] font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors active:bg-black/10 dark:active:bg-white/10" 
                  onClick={handleClearData}
                >
                  {t.delete}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
