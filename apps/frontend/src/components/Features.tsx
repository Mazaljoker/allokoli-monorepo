import React from "react";
import { motion } from "framer-motion";
import {
  Code,
  Lock,
  Rocket,
  Sparkles,
  Phone,
  Droplet as DragDrop,
} from "lucide-react";
import Section from "./Section";
import SectionTitle from "./SectionTitle";

const features = [
  {
    title: "Éditeur No Code",
    description:
      'Construisez vos scénarios conversationnels avec une interface simple de type "Drag & Drop". Aucun code nécessaire.',
    icon: DragDrop,
  },
  {
    title: "Multicanal",
    description:
      "Connectez-vous à la téléphonie, WhatsApp, Messenger, et plus pour des interactions omnicanal fluides.",
    icon: Phone,
  },
  {
    title: "Intelligence Artificielle",
    description:
      "Automatisez les flux conversationnels avec des moteurs NLP et IA avancés.",
    icon: Sparkles,
  },
  {
    title: "Déploiement Rapide",
    description:
      "Mettez en production en moins de 5 minutes avec notre plateforme optimisée.",
    icon: Rocket,
  },
  {
    title: "Sécurité Maximale",
    description: "Protection des données et conformité RGPD garanties.",
    icon: Lock,
  },
  {
    title: "Intégrations",
    description: "Connectez facilement vos CRM et systèmes externes.",
    icon: Code,
  },
];

// Animation hover pour cartes features
const cardHover = {
  hover: {
    scale: 1.05,
    boxShadow: `0 8px 32px 0 rgba(30,30,36,0.07), 0 1.5px 6px 0 rgba(30,30,36,0.07)`,
    transition: { type: "spring", stiffness: 220, damping: 16 },
  },
};

const Features = () => {
  return (
    <Section className="bg-white">
      <SectionTitle>Fonctionnalités clés</SectionTitle>
      <motion.p
        className="text-xl text-center text-gray-600 mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        variants={{
          hidden: { opacity: 0, y: 32 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: "easeOut" },
          },
        }}
      >
        Tout ce dont vous avez besoin pour des interactions client
        exceptionnelles
      </motion.p>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover="hover"
            variants={cardHover}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition"
          >
            <feature.icon className="h-8 w-8 text-primary mb-4" aria-hidden />
            <h3 className="text-xl font-semibold text-primary mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};

export default Features;
