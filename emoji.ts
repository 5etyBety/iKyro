import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, X, ChevronLeft, RotateCcw, Trophy, Play } from 'lucide-react';
import { useAppStore } from '../store';
import { translations } from '../translations';
import { playSound } from '../utils/audio';
import { FLUENT_EMOJIS } from '../utils/emoji';

// Games
import TicTacToe from './games/TicTacToe';
import SimonSays from './games/SimonSays';
import MemoryGame from './games/MemoryGame';
import StarCatcher from './games/StarCatcher';
import RockPaperScissors from './games/RockPaperScissors';

export const InstantGames = () => {
  const { language, currentView } = useAppStore();
  const t = translations[language];
  const [isOpen, setIsOpen] = useState(false);
  const [activeGame, setActiveGame] = useState<string | null>(null);

  if (currentView === 'search' || currentView === 'settings' || currentView === 'details') {
    return null;
  }

  const games = [
    { id: 'xo', name: t.ticTacToe, icon: FLUENT_EMOJIS.cross, component: TicTacToe },
    { id: 'simon', name: t.simonSays, icon: FLUENT_EMOJIS.palette, component: SimonSays },
    { id: 'memory', name: t.memoryGame, icon: FLUENT_EMOJIS.brain, component: MemoryGame },
    { id: 'star', name: t.starCatcher, icon: FLUENT_EMOJIS.star, component: StarCatcher },
    { id: 'rps', name: t.rockPaperScissors, icon: FLUENT_EMOJIS.scissors, component: RockPaperScissors },
  ];

  const renderGame = () => {
    const game = games.find(g => g.id === activeGame);
    if (!game) return null;
    const GameComponent = game.component;
    return (
      <div className="flex flex-col h-full bg-white dark:bg-[#121212]">
        <div className="flex items-center p-4 border-b border-gray-100 dark:border-white/5">
          <button 
            onClick={() => { playSound('click'); setActiveGame(null); }}
            className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white rtl:rotate-180" />
          </button>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex-1 text-center truncate">{game.name}</h2>
          <div className="w-10"></div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center">
          <GameComponent />
        </div>
      </div>
    );
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { playSound('click'); setIsOpen(true); }}
        className="fixed bottom-24 left-4 z-40 w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 shadow-lg flex items-center justify-center text-white"
      >
        <motion.div
          animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Zap className="w-6 h-6 fill-white" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => { playSound('click'); setIsOpen(false); }}
          >
            <motion.div
              layout
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm h-[600px] max-h-[80vh] glass-panel rounded-[32px] overflow-hidden flex flex-col shadow-2xl relative"
            >
              {!activeGame ? (
                <>
                  <div className="p-6 pb-2 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-orange-500 fill-orange-500" />
                      </div>
                      <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{t.instantGames}</h2>
                    </div>
                    <button 
                      onClick={() => { playSound('click'); setIsOpen(false); }}
                      className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-transform"
                    >
                      <X className="w-6 h-6 text-gray-500" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                    {games.map((game, i) => (
                      <motion.button
                        key={game.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { playSound('click'); setActiveGame(game.id); }}
                        className="w-full p-4 bg-white/50 dark:bg-white/5 rounded-2xl flex items-center gap-4 hover:bg-white dark:hover:bg-white/10 transition-colors border border-gray-100 dark:border-white/5 shadow-sm"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-black/20 flex items-center justify-center text-2xl">
                          <img src={game.icon} alt={game.name} className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1 text-start">
                          <h3 className="font-bold text-gray-900 dark:text-white">{game.name}</h3>
                          <span className="text-xs text-ikyro-blue font-semibold">{t.playNow}</span>
                        </div>
                        <Play className="w-5 h-5 text-gray-400 rtl:rotate-180" />
                      </motion.button>
                    ))}
                  </div>
                </>
              ) : (
                renderGame()
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
