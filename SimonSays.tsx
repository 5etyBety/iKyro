import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store';
import { translations } from '../translations';
import { Search, Compass } from 'lucide-react';

export const OnboardingOverlay = () => {
  const { hasCompletedOnboarding, completeOnboarding, language, setLanguage } = useAppStore();
  const [step, setStep] = useState(0);
  const t = translations[language];

  if (hasCompletedOnboarding) return null;

  const nextStep = () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      setStep(2);
    } else {
      completeOnboarding();
    }
  };

  const handleLanguageSelect = (lang: 'ar' | 'en' | 'ku') => {
    setLanguage(lang);
    nextStep();
  };

  return (
    <AnimatePresence>
      {!hasCompletedOnboarding && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex flex-col items-center pointer-events-auto"
        >
          {/* Backdrop with hole for bottom nav or search */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {step === 0 && (
            <div className="absolute inset-0 flex items-end sm:items-center justify-center p-4 pb-8 z-20 pointer-events-none">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="glass-panel w-full max-w-[340px] rounded-[24px] overflow-hidden shadow-2xl pointer-events-auto"
              >
                <div className="p-4 text-center border-b border-[#3C3C43]/20 dark:border-[#545458]/40">
                  <h2 className="text-[17px] font-semibold text-black dark:text-white tracking-tight">اختر اللغة / Language</h2>
                </div>
                
                <div className="flex flex-col w-full">
                  <button
                    onClick={() => handleLanguageSelect('ar')}
                    className="w-full flex items-center justify-between p-4 active:bg-black/5 dark:active:bg-white/5 transition-colors border-b border-[#3C3C43]/20 dark:border-[#545458]/40"
                  >
                    <span className="text-[17px] text-black dark:text-white font-normal">العربية</span>
                    {language === 'ar' && <span className="text-[#007AFF]">✓</span>}
                  </button>
                  <button
                    onClick={() => handleLanguageSelect('ku')}
                    className="w-full flex items-center justify-between p-4 active:bg-black/5 dark:active:bg-white/5 transition-colors border-b border-[#3C3C43]/20 dark:border-[#545458]/40"
                  >
                    <span className="text-[17px] text-black dark:text-white font-normal">کوردی</span>
                    {language === 'ku' && <span className="text-[#007AFF]">✓</span>}
                  </button>
                  <button
                    onClick={() => handleLanguageSelect('en')}
                    className="w-full flex items-center justify-between p-4 active:bg-black/5 dark:active:bg-white/5 transition-colors"
                  >
                    <span className="text-[17px] text-black dark:text-white font-normal">English</span>
                    {language === 'en' && <span className="text-[#007AFF]">✓</span>}
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {step === 1 && (
            <div className="absolute bottom-[100px] left-4 right-4 flex flex-col items-center z-10">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-[#1C1C1E] p-6 rounded-3xl shadow-2xl w-full max-w-sm text-center relative"
              >
                {/* Arrow pointing down */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[16px] border-r-[16px] border-t-[16px] border-l-transparent border-r-transparent border-t-white dark:border-t-[#1C1C1E]" />
                
                <div className="w-16 h-16 bg-ikyro-blue/10 rounded-full flex items-center justify-center mx-auto mb-4 text-ikyro-blue">
                  <Compass className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black mb-2 text-gray-900 dark:text-white">{t.onboardingWelcome}</h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-6">
                  {t.onboardingNavDesc}
                </p>
                
                <button
                  onClick={nextStep}
                  className="w-full bg-ikyro-blue text-white font-bold py-4 rounded-2xl active:scale-95 transition-transform"
                >
                  {t.onboardingNext}
                </button>
              </motion.div>
            </div>
          )}

          {step === 2 && (
            <div className="absolute bottom-[100px] left-4 right-4 flex flex-col items-center z-10">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white dark:bg-[#1C1C1E] p-6 rounded-3xl shadow-2xl w-full max-w-sm text-center relative"
              >
                {/* Arrow pointing down */}
                <div className={`absolute -bottom-4 w-0 h-0 border-l-[16px] border-r-[16px] border-t-[16px] border-l-transparent border-r-transparent border-t-white dark:border-t-[#1C1C1E] ${language === 'en' ? 'right-[30%] translate-x-[50%]' : 'left-[30%] -translate-x-[50%]'}`} />
                
                <div className="w-16 h-16 bg-ikyro-blue/10 rounded-full flex items-center justify-center mx-auto mb-4 text-ikyro-blue">
                  <Search className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black mb-2 text-gray-900 dark:text-white">{t.search}</h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-6">
                  {t.onboardingSearchDesc}
                </p>
                
                <button
                  onClick={nextStep}
                  className="w-full bg-ikyro-blue text-white font-bold py-4 rounded-2xl active:scale-95 transition-transform"
                >
                  {t.onboardingDone}
                </button>
              </motion.div>
            </div>
          )}

          {/* Highlight effect for bottom nav */}
          {step === 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-4 left-4 right-4 h-[72px] rounded-3xl border-2 border-ikyro-blue/50 shadow-[0_0_30px_rgba(0,122,255,0.3)] pointer-events-none z-10"
            />
          )}

          {/* Highlight effect for search icon in bottom nav */}
          {step === 2 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`absolute bottom-4 h-[72px] w-[20%] rounded-3xl border-2 border-ikyro-blue/50 shadow-[0_0_30px_rgba(0,122,255,0.3)] pointer-events-none z-10 ${language === 'en' ? 'right-[20%]' : 'left-[20%]'}`}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
