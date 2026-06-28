import React from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../store';
import { GlassPanel } from '../components/UI';
import { ArrowRight, Info, Shield, FileText, CheckCircle2, Instagram, Send } from 'lucide-react';
import { translations } from '../translations';

export const InfoView = () => {
  const { currentView, setCurrentView, language } = useAppStore();
  const t = translations[language];

  let title = '';
  let icon = <Info className="w-6 h-6 text-ikyro-blue" />;
  let content = null;

  if (currentView === 'about') {
    title = t.aboutIkyro;
    icon = <Info className="w-6 h-6 text-ikyro-blue" />;
    content = (
      <div className="space-y-6 text-gray-600 dark:text-gray-300">
        <GlassPanel className="p-6 text-center flex flex-col items-center">
          <img 
            src="/watermark.png" 
            alt="iKyro Logo" 
            className="w-32 h-32 object-contain mb-4 filter drop-shadow-[0_0_20px_rgba(52,197,239,0.8)]" 
            onError={(e: any) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }} 
          />
          <div className="hidden w-32 h-32 rounded-2xl ikyro-gradient flex items-center justify-center text-white font-bold text-5xl mb-4 shadow-[0_8px_24px_rgba(52,197,239,0.3)]">
            iK
          </div>
          <p className="font-bold text-gray-500 dark:text-gray-400 mt-2">{t.version} 0.5.0</p>
        </GlassPanel>

        <p className="leading-relaxed">
          {t.aboutDescription}
        </p>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">{t.featuresListTitle}</h3>
          <ul className="space-y-3">
            {t.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-ikyro-blue flex-shrink-0" />
                <span className="font-medium">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
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
    );
  } else if (currentView === 'privacy') {
    title = t.privacy;
    icon = <Shield className="w-6 h-6 text-ikyro-blue" />;
    content = (
      <div className="space-y-6 text-gray-600 dark:text-gray-300">
        <GlassPanel className="p-6">
          <p className="leading-relaxed mb-4 font-medium text-gray-900 dark:text-white">
            {t.privacyIntro}
          </p>
        </GlassPanel>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">{t.dataCollection}</h3>
          <p className="leading-relaxed">
            {t.dataCollectionDesc}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">{t.howWeUseInfo}</h3>
          <p className="leading-relaxed">
            {t.howWeUseInfoDesc}
          </p>
        </div>
      </div>
    );
  } else if (currentView === 'terms') {
    title = t.terms;
    icon = <FileText className="w-6 h-6 text-ikyro-blue" />;
    content = (
      <div className="space-y-6 text-gray-600 dark:text-gray-300">
        <GlassPanel className="p-6">
          <p className="leading-relaxed font-medium text-gray-900 dark:text-white">
            {t.termsIntro}
          </p>
        </GlassPanel>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">{t.acceptableUse}</h3>
          <p className="leading-relaxed">
            {t.acceptableUseDesc}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">{t.disclaimer}</h3>
          <p className="leading-relaxed">
            {t.disclaimerDesc}
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen pb-20"
    >
      <div className="sticky top-0 z-50 pt-safe bg-white/70 dark:bg-[#090909]/70 backdrop-blur-[30px] border-b border-gray-100 dark:border-white/5">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('settings')}
              className="p-2 -mr-2 text-gray-900 dark:text-white rounded-full bg-gray-100 dark:bg-gray-800"
            >
              <ArrowRight className="w-6 h-6 rtl:rotate-0 ltr:rotate-180" />
            </button>
            <div className="flex items-center gap-2">
              {icon}
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {content}
      </div>
    </motion.div>
  );
};
