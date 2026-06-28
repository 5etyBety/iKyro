import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { useAppStore } from '../../store';
import { translations } from '../../translations';
import { playSound } from '../../utils/audio';
import { FLUENT_EMOJIS } from '../../utils/emoji';

const EMOJIS = [
  FLUENT_EMOJIS.apple,
  FLUENT_EMOJIS.banana,
  FLUENT_EMOJIS.watermelon,
  FLUENT_EMOJIS.grapes,
  FLUENT_EMOJIS.strawberry,
  FLUENT_EMOJIS.cherries,
  FLUENT_EMOJIS.mango,
  FLUENT_EMOJIS.pineapple,
];

export default function MemoryGame() {
  const { language } = useAppStore();
  const t = translations[language];
  const [cards, setCards] = useState<{id: number, emoji: string, isFlipped: boolean, isMatched: boolean}[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [won, setWon] = useState(false);

  const initGame = () => {
    playSound('click');
    const shuffled = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, idx) => ({ id: idx, emoji, isFlipped: false, isMatched: false }));
    setCards(shuffled);
    setFlipped([]);
    setDisabled(false);
    setWon(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (id: number) => {
    if (disabled) return;
    const clickedCard = cards.find(c => c.id === id);
    if (clickedCard?.isFlipped || clickedCard?.isMatched) return;

    playSound('pop');

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    setCards(cards.map(c => c.id === id ? { ...c, isFlipped: true } : c));

    if (newFlipped.length === 2) {
      setDisabled(true);
      const first = cards.find(c => c.id === newFlipped[0]);
      const second = cards.find(c => c.id === id);

      if (first?.emoji === second?.emoji) {
        setTimeout(() => {
          playSound('win');
          setCards(prev => prev.map(c => 
            c.id === first.id || c.id === second.id ? { ...c, isMatched: true } : c
          ));
          setFlipped([]);
          setDisabled(false);
        }, 500);
      } else {
        setTimeout(() => {
          playSound('lose');
          setCards(prev => prev.map(c => 
            newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c
          ));
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.isMatched) && !won) {
      setWon(true);
      setTimeout(() => playSound('win'), 500);
    }
  }, [cards, won]);

  return (
    <div className="flex flex-col items-center w-full max-w-[320px]">
      <div className="grid grid-cols-4 gap-3 w-full mb-8">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleCardClick(card.id)}
            className={`w-full aspect-square rounded-2xl flex items-center justify-center text-4xl cursor-pointer shadow-sm transition-all duration-300 ${
              card.isFlipped || card.isMatched 
                ? 'bg-white dark:bg-white/10 ring-2 ring-ikyro-blue/30' 
                : 'bg-gradient-to-br from-ikyro-blue/10 to-ikyro-blue/20 dark:from-ikyro-blue/20 dark:to-ikyro-blue/30'
            } ${card.isMatched ? 'opacity-50 scale-95' : ''}`}
          >
            <motion.span
              initial={false}
              animate={{ rotateY: card.isFlipped || card.isMatched ? 0 : 180, opacity: card.isFlipped || card.isMatched ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center"
            >
              <img src={card.emoji} alt="card" className="w-12 h-12 object-contain" referrerPolicy="no-referrer" />
            </motion.span>
          </motion.div>
        ))}
      </div>
      
      <div className="h-12 mb-4 flex items-center justify-center">
        {won && (
          <motion.div initial={{opacity:0, scale:0.5}} animate={{opacity:1, scale:1}} className="text-center px-6 py-2 bg-gray-100 dark:bg-white/10 rounded-full">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t.youWin}</h3>
          </motion.div>
        )}
      </div>

      <button onClick={initGame} className="flex items-center gap-2 px-8 py-4 bg-ikyro-blue text-white font-bold rounded-2xl active:scale-95 transition-transform shadow-lg shadow-blue-500/30">
        <RotateCcw className="w-5 h-5" />
        {t.playNow}
      </button>
    </div>
  );
}
