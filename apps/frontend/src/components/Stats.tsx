import React from "react";
import { motion } from "framer-motion";
import Section from "./Section";

// Animation d'apparition pour Stats
const statsSectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

// FadeIn component for staggered animations
function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
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

const stats = [
  { value: "5min", label: "Temps de déploiement" },
  { value: "99.9%", label: "Disponibilité" },
  { value: "+40%", label: "Satisfaction client" },
  { value: "-60%", label: "Coûts opérationnels" },
];

const Stats = () => {
  return (
    <Section className="bg-bgLite py-20">
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-y-12 text-center"
        variants={statsSectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {stats.map((stat, index) => (
          <FadeIn key={index} delay={index * 0.1}>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-primary mb-2">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </FadeIn>
        ))}
      </motion.div>
    </Section>
  );
};

export default Stats;
