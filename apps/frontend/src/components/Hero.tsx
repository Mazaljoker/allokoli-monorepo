import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import Section from './Section';

// Lazy load AuthForm
const AuthForm = lazy(() => import('./AuthForm'));

// Animation synchronisée Hero (staggerChildren)
const heroStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18
    }
  }
};

const heroItem = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

const Hero = () => {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      {/* Blob decorations */}
      <div className="blob bg-primary/5 top-[-150px] left-[-200px]"></div>
      <div className="blob bg-accent/5 bottom-[-150px] right-[-200px]"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-x-12 gap-y-20 py-28 items-start">
          {/* Left column - Hero content */}
          <motion.div
            variants={heroStagger}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5 lg:col-start-2 space-y-8 max-w-prose"
          >
            <motion.div variants={heroItem}>
              <h1 className="text-5xl font-bold leading-tight">
                Gagnez du temps&nbsp;: <span className="text-primary">déployez votre agent IA multicanal en 5 minutes</span>
              </h1>
              <p className="mt-4 text-xl text-gray-600">
                Plateforme simple, rapide et 100% RGPD.
              </p>
            </motion.div>
            <motion.ul
              className="mt-8 space-y-3"
              variants={heroStagger}
              initial="hidden"
              animate="visible"
            >
              {['Aucun code requis', 'Déploiement instantané', 'Support 24/7'].map((feat, i) => (
                <motion.li
                  key={i}
                  variants={heroItem}
                  className="flex items-center gap-3"
                >
                  <Check className="h-5 w-5 text-accent" aria-hidden />
                  <span>{feat}</span>
                </motion.li>
              ))}
            </motion.ul>
            <motion.div variants={heroItem}>
              <motion.button
                className="mt-8 bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-lg transition w-full font-semibold focus-visible:outline-primary flex items-center gap-2"
                onClick={() => window.location.hash = '#signup'}
                whileHover={{
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 300, damping: 10 }
                }}
                whileTap={{ scale: 0.97 }}
                aria-label="Commencer maintenant avec AlloKoli"
              >
                Commencer Maintenant
                <ArrowRight className="w-5 h-5" aria-hidden />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right column - Signup form */}
          <div className="lg:col-span-4 lg:col-start-8 w-full flex justify-center">
            <div className="w-full max-w-[440px] rounded-2xl bg-white shadow-xl ring-1 ring-black/5 p-8 space-y-6">
              <h2 className="text-2xl font-semibold text-primary mb-4">Créer un compte</h2>
              <Suspense fallback={<div>Chargement...</div>}>
                <AuthForm />
              </Suspense>
              
            </div>
          </div>
        </div>
        {/* GRID FIX OK */}
      </div>
    </section>
  );
};

export default Hero;

