import React, { useState } from 'react';
import { supabase } from "../lib/supabase";

export default function SignUpCard() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin + '/dashboard',
        }
      });
      
      if (error) throw error;
      
      setMessage({
        text: "Lien de connexion envoyé ! Vérifiez votre boîte mail.",
        type: "success"
      });
    } catch (error: any) {
      setMessage({
        text: error.message || "Une erreur est survenue.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="signup" className="rounded-2xl shadow-xl ring-1 ring-black/5 bg-white p-8 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Essayez AlloKoli gratuitement</h2>
      
      <form onSubmit={handleSignUp} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email professionnel
          </label>
          <input
            id="email"
            type="email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6A0DAD]"
            placeholder="vous@entreprise.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#6A0DAD] hover:bg-[#4A0A7F] text-white py-3 px-4 rounded-lg transition-colors font-medium disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6A0DAD]"
        >
          {loading ? "Chargement..." : "Créer mon compte"}
        </button>
      </form>
      
      {message && (
        <div className={`p-3 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
      
      <p className="text-xs text-gray-500">
        En vous inscrivant, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialité.
      </p>
    </div>
  );
}
