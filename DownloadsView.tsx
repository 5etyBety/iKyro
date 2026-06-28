import React, { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export const GlassPanel = ({ children, className = '', ...props }: HTMLMotionProps<"div">) => (
  <motion.div 
    className={`glass-panel rounded-3xl p-4 ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

export const IkyroButton = ({ children, className = '', glow = true, ...props }: HTMLMotionProps<"button"> & { glow?: boolean }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    className={`ikyro-gradient ${glow ? 'ikyro-glow' : ''} text-white font-semibold rounded-2xl flex items-center justify-center gap-2 relative overflow-hidden ${className}`}
    {...props}
  >
    <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
    <span className="relative z-10 flex items-center gap-2">{children}</span>
  </motion.button>
);

export const SectionTitle = ({ title, action, icon }: { title: string, action?: ReactNode, icon?: ReactNode }) => (
  <div className="flex items-center justify-between mb-4 px-2">
    <div className="flex items-center gap-2">
      {icon && <span className="text-gray-400">{icon}</span>}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h2>
    </div>
    {action && <div className="text-ikyro-blue text-sm font-medium">{action}</div>}
  </div>
);
