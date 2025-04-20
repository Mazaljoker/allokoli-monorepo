import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Section from './Section';

// Animation component
function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

const CtaBanner = () => {
  return (
    <Section className="bg-primary py-24">
      <div className="text-center">
        <FadeIn>
          <h2 className="text-3xl font-bold text-white mb-6">
            Prêt à transformer vos interactions client ?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Rejoignez les entreprises qui font confiance à AlloKoli
          </p>
          <motion.button
            className="mx-auto flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-2xl hover:bg-gray-100 transition-colors"
            type="button"
            onClick={() => {
              const el = document.getElementById('signup');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              } else {
                window.location.hash = '#signup';
              }
            }}
            whileHover={{
              scale: 1.05,
              transition: { type: "spring", stiffness: 300, damping: 10 }
            }}
            whileTap={{ scale: 0.97 }}
            aria-label="Commencer maintenant avec AlloKoli"
          >
            Commencer maintenant
            <ArrowRight className="w-5 h-5" aria-hidden />
          </motion.button>
        </FadeIn>
      </div>
    </Section>
  );
};

export default CtaBanner;