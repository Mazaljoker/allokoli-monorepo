import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Lock, AlertCircle } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

// Nouvelle palette Givati Tech
const COLORS = {
  background: "#FFFFFF", // Fond global (body)
  surface: "#F8F8FB", // Cartes, inputs
  primary: "#6A0DAD", // Boutons CTA, titres
  primaryHover: "#4A0A7F", // Hover / focus CTA
  secondary: "#B07FD9", // Surfaces secondaires (décoratives)
  accent: "#D2B48C", // Accent doux (sable)
  accentDark: "#586D46", // Accent sombre (olive)
  text: "#1E1E24", // Texte principal
  textInverted: "#FFFFFF", // Texte sur fond violet
  shadow: "rgba(30,30,36,0.07)", // Ombres douces
};

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md"
    >
      <div className="text-center mb-6">
        <div
          className={`inline-flex items-center space-x-2 text-[${COLORS.primary}] mb-2`}
        >
          <Lock className="h-5 w-5" aria-hidden />
          <h2 className="text-xl font-semibold">Connexion</h2>
        </div>
        <p className="text-gray-600 text-sm">
          Accédez à votre tableau de bord AlloKoli
        </p>
      </div>

      {error && (
        <div
          className={`p-3 rounded-lg bg-red-50 text-red-700 flex items-start mb-4`}
        >
          <AlertCircle
            className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5"
            aria-hidden
          />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className={`block text-sm font-medium text-[${COLORS.text}] mb-1`}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-3 border border-gray-200 rounded-lg bg-[${COLORS.surface}] focus:ring-2 focus:ring-[${COLORS.primary}] focus:border-transparent transition-colors`}
            placeholder="votre@email.com"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className={`block text-sm font-medium text-[${COLORS.text}] mb-1`}
          >
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-3 border border-gray-200 rounded-lg bg-[${COLORS.surface}] focus:ring-2 focus:ring-[${COLORS.primary}] focus:border-transparent transition-colors`}
            placeholder="Votre mot de passe"
            required
          />
        </div>

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className={`text-sm text-[${COLORS.primary}] hover:underline`}
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <motion.button
          type="submit"
          className={`w-full bg-[${COLORS.primary}] text-[${COLORS.textInverted}] p-3 rounded-lg hover:bg-[${COLORS.primaryHover}] transition-colors flex items-center justify-center gap-2`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
        >
          {loading ? (
            <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <>
              Se connecter
              <ArrowRight className="w-4 h-4" aria-hidden />
            </>
          )}
        </motion.button>

        <div className="text-center text-sm mt-4">
          <p className="text-gray-600">
            Vous n'avez pas de compte ?{" "}
            <Link
              to="/signup"
              className={`text-[${COLORS.primary}] hover:underline`}
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </form>
    </motion.div>
  );
}
