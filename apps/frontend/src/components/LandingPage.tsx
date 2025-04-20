import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Bot, ArrowRight, Check } from "lucide-react";
import { supabase } from "../lib/supabase";

// Import section components
import Stats from "./Stats";
import Features from "./Features";
import UseCases from "./UseCases";
import Steps from "./Steps";
import Testimonials from "./Testimonials";
import FAQSection from "./FAQSection";
import CtaBanner from "./CtaBanner";
import SignUpCard from "./SignUpCard";
import Button from "./ui/Button";

export default function LandingPage() {
  const navigate = useNavigate();

  // Auth redirect
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((e, session) => {
      if (e === "SIGNED_IN" && session) navigate("/dashboard");
    });
    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>AlloKoli – Agents IA Vocaux & Textuels No Code</title>
        <meta
          name="description"
          content="Créez et déployez vos assistants IA en moins de 5 minutes, multicanal, RGPD, aucun code requis."
        />
        <html lang="fr" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <style>
          {`
            @import url('https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400&display=swap');
          `}
        </style>
      </Helmet>

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6 lg:px-12">
          <div className="flex items-center gap-2 font-bold text-[#141616]">
            <Bot className="text-[#6A0DAD] h-8 w-8" aria-hidden />
            <span className="sr-only">AlloKoli</span>
            <span className="text-2xl">AlloKoli</span>
          </div>
          <Button
            className="bg-[#435175] hover:bg-[#5b6a91] text-white px-6 py-2 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6A0DAD]"
            onClick={() => (window.location.hash = "#signup")}
          >
            Essayer Gratuitement
          </Button>
        </div>
      </header>

      <main className="font-['Satoshi',sans-serif]">
        {/* Hero Section */}
        <section className="relative isolate bg-white overflow-hidden before:absolute before:-left-64 before:-top-64 before:w-[900px] before:h-[900px] before:rounded-full before:bg-gradient-to-br before:from-[#6A0DAD]/10 before:via-[#435175]/10 before:to-transparent before:blur-3xl before:-z-10">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-16 py-28 items-center justify-items-center lg:justify-items-stretch">
              {/* Left Column: Text and CTA */}
              <div className="lg:col-span-5 lg:col-start-2 w-full space-y-6">
                <h1 className="text-5xl/tight lg:text-6xl font-extrabold">
                  Créez vos assistants IA en{" "}
                  <span className="text-[#435175]">quelques minutes</span>
                </h1>
                <p className="mt-6 max-w-prose text-lg text-[#4a4a4a]">
                  Déployez des agents vocaux et textuels puissants sans code,
                  compatibles RGPD et instantanément intégrables.
                </p>
                <ul className="mt-8 space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="text-green-600 mt-1" size={20} />
                    <span>Configuration sans code en 5 minutes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-green-600 mt-1" size={20} />
                    <span>
                      Intégration multi-canal (web, téléphone, WhatsApp)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-green-600 mt-1" size={20} />
                    <span>100% conforme RGPD, données en Europe</span>
                  </li>
                </ul>
                <div className="mt-10">
                  <Button
                    size="lg"
                    className="bg-[#435175] hover:bg-[#5b6a91] text-white px-8 py-3 rounded-lg transition-colors font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6A0DAD]"
                  >
                    Commencer Maintenant{" "}
                    <ArrowRight className="ml-2" size={18} />
                  </Button>
                </div>
              </div>

              {/* Right Column: Sign Up Card */}
              <div className="lg:col-span-4 lg:col-start-8 w-full">
                <SignUpCard />
              </div>
            </div>
          </div>
        </section>

        <Stats />
        <Features />
        <UseCases />
        <Steps />
        <Testimonials />
        <FAQSection />
        <CtaBanner />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bot className="text-primary h-6 w-6" aria-hidden />
                <span className="text-xl font-bold text-primary">AlloKoli</span>
              </div>
              <p className="text-gray-600">
                Transformez vos interactions client avec l'intelligence
                artificielle.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-4">Produit</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Fonctionnalités</li>
                <li>Intégrations</li>
                <li>Tarifs</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-4">Entreprise</h3>
              <ul className="space-y-2 text-gray-600">
                <li>À propos</li>
                <li>Blog</li>
                <li>Carrières</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-4">Légal</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Confidentialité</li>
                <li>Conditions d'utilisation</li>
                <li>RGPD</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>© {new Date().getFullYear()} AlloKoli. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
