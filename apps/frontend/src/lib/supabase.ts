import { createClient } from "@supabase/supabase-js";

// Valeurs par défaut pour le développement
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://votre-projet.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "votre-clé-publique-anonyme";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
