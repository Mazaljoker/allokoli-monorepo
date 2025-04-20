import React from 'react';
import { motion } from 'framer-motion';
import Section from './Section';
import SectionTitle from './SectionTitle';

// Animation component
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay }}
    >
      {children}
    </motion.div>
  );
}

const Steps = () => {
  return (
    <Section className="bg-white">
      <SectionTitle>Comment ça marche ?</SectionTitle>
      <motion.p
        className="text-xl text-center text-gray-600 mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        variants={{
          hidden: { opacity: 0, y: 32 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
        }}
      >
        En quelques étapes simples, créez et déployez votre agent IA
      </motion.p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mt-16">
        <FadeIn delay={0.1}>
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center text-white text-3xl">1</div>
            <h3 className="text-xl font-semibold text-primary">Configuration</h3>
            <p className="text-gray-600">
              Configurez un scénario via notre éditeur No Code intuitif
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center text-white text-3xl">2</div>
            <h3 className="text-xl font-semibold text-primary">Canaux</h3>
            <p className="text-gray-600">
              Choisissez les canaux de communication (téléphonie, WhatsApp, etc.)
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center text-white text-3xl">3</div>
            <h3 className="text-xl font-semibold text-primary">Déploiement</h3>
            <p className="text-gray-600">
              Testez l'agent en temps réel et déployez-le instantanément
            </p>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
};

export default Steps;