import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import Section from "./Section";
import SectionTitle from "./SectionTitle";

// Animation component
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

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = [
    {
      question: "Comment fonctionne AlloKoli ?",
      answer:
        "AlloKoli utilise une IA avancée pour comprendre et répondre aux questions de vos clients en langage naturel, par téléphone ou chat.",
    },
    {
      question: "Combien de temps pour la mise en place ?",
      answer:
        "La configuration initiale prend moins de 30 minutes. Notre équipe vous accompagne pour une intégration optimale.",
    },
    {
      question: "Quelles langues sont supportées ?",
      answer:
        "AlloKoli supporte plus de 20 langues, dont le français, l'anglais, l'espagnol, l'allemand, et bien d'autres.",
    },
    {
      question: "Est-ce personnalisable ?",
      answer:
        "Oui, vous pouvez personnaliser la voix, le ton, les réponses et l'intégrer à vos outils existants.",
    },
  ];

  return (
    <Section className="bg-white">
      <SectionTitle>Questions Fréquentes</SectionTitle>
      <dl className="max-w-3xl mx-auto" aria-live="polite">
        {faqs.map((faq, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <dt>
              <button
                aria-expanded={openIndex === i}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex justify-between w-full py-4 font-medium text-left focus:outline-none"
              >
                <span>{faq.question}</span>
                {openIndex === i ? <ChevronUp /> : <ChevronDown />}
              </button>
            </dt>
            <AnimatePresence>
              {openIndex === i && (
                <motion.dd
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pb-4 text-gray-600"
                >
                  {faq.answer}
                </motion.dd>
              )}
            </AnimatePresence>
          </FadeIn>
        ))}
      </dl>
    </Section>
  );
};

export default FAQSection;
