// app/components/AnimatedCard.tsx
'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
}

const AnimatedCard = ({ children, className = '' }: AnimatedCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
