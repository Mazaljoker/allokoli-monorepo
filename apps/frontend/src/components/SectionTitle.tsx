import React from 'react';
import { motion } from 'framer-motion';

// Animation slide + fade pour titres de section
const sectionTitleVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

// Composant animé pour titres de section
function SectionTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.h2
      className={`text-3xl font-bold text-center text-primary mb-4 ${className}`}
      variants={sectionTitleVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
    >
      {children}
    </motion.h2>
  );
}

export default SectionTitle;