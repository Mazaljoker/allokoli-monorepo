import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Nouvelle palette Givati Tech
const COLORS = {
  background: "#FFFFFF",        // Fond global (body)
  surface: "#F8F8FB",           // Cartes, inputs
  primary: "#6A0DAD",           // Boutons CTA, titres
  primaryHover: "#4A0A7F",      // Hover / focus CTA
  secondary: "#B07FD9",         // Surfaces secondaires (décoratives)
  accent: "#D2B48C",            // Accent doux (sable)
  accentDark: "#586D46",        // Accent sombre (olive)
  text: "#1E1E24",              // Texte principal
  textInverted: "#FFFFFF",      // Texte sur fond violet
  shadow: "rgba(30,30,36,0.07)" // Ombres douces
};

type AuthMode = 'login' | 'signup' | 'forgot';

export default function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });
        
        if (error) throw error;
        setSuccess('Vérifiez votre email pour confirmer votre compte');
      } else if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        
        if (error) throw error;
        setSuccess('Instructions envoyées à votre email');
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-6">
        <div className={`inline-flex space-x-2 text-[${COLORS.primary}] mb-2`}>
          {mode === 'signup' && <User className="h-5 w-5" aria-hidden />}
          {mode === 'login' && <Lock className="h-5 w-5" aria-hidden />}
          {mode === 'forgot' && <Mail className="h-5 w-5" aria-hidden />}
          <span>
            {mode === 'signup' && 'Inscription'}
            {mode === 'login' && 'Connexion'}
            {mode === 'forgot' && 'Réinitialisation'}
          </span>
        </div>
        <p className="text-gray-600 text-sm">
          {mode === 'signup' && 'Créez votre compte AlloKoli en quelques secondes'}
          {mode === 'login' && 'Accédez à votre compte AlloKoli'}
          {mode === 'forgot' && 'Recevez un lien pour réinitialiser votre mot de passe'}
        </p>
      </div>

      {error && (
        <div className={`p-3 rounded-lg bg-red-50 text-red-700 flex items-start mb-4`}>
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" aria-hidden />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className={`p-3 rounded-lg bg-green-50 text-green-700 mb-4`}>
          {success}
        </div>
      )}

      <form onSubmit={handleAuth} className="space-y-4">
        {mode === 'signup' && (
          <div>
            <label htmlFor="name" className={`block text-sm font-medium text-[${COLORS.text}] mb-1`}>
              Nom complet
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-3 border border-gray-200 rounded-lg bg-[${COLORS.surface}] focus:ring-2 focus:ring-[${COLORS.primary}] focus:border-transparent transition-colors`}
              placeholder="Jean Dupont"
              required={mode === 'signup'}
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className={`block text-sm font-medium text-[${COLORS.text}] mb-1`}>
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

        {mode !== 'forgot' && (
          <div>
            <label htmlFor="password" className={`block text-sm font-medium text-[${COLORS.text}] mb-1`}>
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 border border-gray-200 rounded-lg bg-[${COLORS.surface}] focus:ring-2 focus:ring-[${COLORS.primary}] focus:border-transparent transition-colors`}
              placeholder={mode === 'signup' ? '8 caractères minimum' : ''}
              required={mode !== 'forgot'}
            />
          </div>
        )}

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
              {mode === 'signup' && 'Créer un compte'}
              {mode === 'login' && 'Se connecter'}
              {mode === 'forgot' && 'Envoyer les instructions'}
              <ArrowRight className="w-4 h-4" aria-hidden />
            </>
          )}
        </motion.button>

        <div className="text-center text-sm space-y-2">
          {mode === 'signup' && (
            <p className="text-gray-600">
              Vous avez déjà un compte ?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`text-[${COLORS.primary}] hover:underline focus:outline-none`}
              >
                Connexion
              </button>
            </p>
          )}

          {mode === 'login' && (
            <>
              <p className="text-gray-600">
                Nouveau sur AlloKoli ?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`text-[${COLORS.primary}] hover:underline focus:outline-none`}
                >
                  Créer un compte
                </button>
              </p>
              <p>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className={`text-[${COLORS.primary}] hover:underline focus:outline-none text-sm`}
                >
                  Mot de passe oublié ?
                </button>
              </p>
            </>
          )}

          {mode === 'forgot' && (
            <p className="text-gray-600">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`text-[${COLORS.primary}] hover:underline focus:outline-none`}
              >
                Retour à la connexion
              </button>
            </p>
          )}
        </div>
      </form>
    </motion.div>
  );
}
