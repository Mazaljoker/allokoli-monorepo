import React from 'react';
import { motion } from 'framer-motion';
import { Headset, Users, Laptop2 } from 'lucide-react';
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

// Cas d'usage data
const useCases = [
  {
    title: 'Service Après-Vente (SAV)',
    description:
      "Automatisez la gestion des demandes clients, le suivi des tickets et la résolution des problèmes courants 24/7, tout en offrant une expérience personnalisée.",
    icon: Headset,
  },
  {
    title: 'Ressources Humaines (RH)',
    description:
      "Répondez instantanément aux questions des collaborateurs sur la paie, les congés ou les procédures internes, et simplifiez l'onboarding des nouveaux employés.",
    icon: Users,
  },
  {
    title: 'Support IT',
    description:
      "Gérez les incidents techniques, guidez les utilisateurs dans le dépannage et automatisez la création de tickets pour une assistance informatique efficace.",
    icon: Laptop2,
  },
];

// Animation hover pour cartes
const cardHover = {
  hover: {
    scale: 1.05,
    boxShadow: `0 8px 32px 0 rgba(30,30,36,0.07), 0 1.5px 6px 0 rgba(30,30,36,0.07)`,
    transition: { type: "spring", stiffness: 220, damping: 16 }
  }
};

const UseCases = () => {
  return (
    <Section className="bg-bgLite">
      <SectionTitle>Cas d'usage</SectionTitle>
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
        Découvrez comment AlloKoli s'adapte à vos métiers
      </motion.p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {useCases.map((useCase, idx) => (
          <FadeIn key={idx} delay={idx * 0.1}>
            <motion.div
              whileHover="hover"
              variants={cardHover}
              className="bg-bgLite p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition flex flex-col items-center text-center h-full"
            >
              <useCase.icon className="h-8 w-8 text-primary mb-4" aria-hidden />
              <h3 className="text-xl font-semibold text-primary mb-2">{useCase.title}</h3>
              <p className="text-gray-600">{useCase.description}</p>
            </motion.div>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
};

export default UseCases;