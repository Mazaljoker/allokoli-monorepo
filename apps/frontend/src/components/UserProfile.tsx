import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase"; // adapte le chemin si besoin

const LANG_OPTIONS = [
  { value: "fr", label: "Français" },
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
];

export default function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({ nom_complet: "", langue: "fr" });
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setEmail(user.email);
        // Récupère le profil dans la table users
        const { data, error } = await supabase
          .from("users")
          .select("nom_complet,langue")
          .eq("id", user.id)
          .single();
        if (!error && data) {
          setProfile({
            nom_complet: data.nom_complet || "",
            langue: data.langue || "fr",
          });
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase
      .from("users")
      .update({
        nom_complet: profile.nom_complet,
        langue: profile.langue,
      })
      .eq("id", user.id);
    setLoading(false);
    if (!error) {
      setMessage("Profil mis à jour !");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (loading) {
    return <div className="p-4 text-[#9EA1A9]">Chargement...</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-[#FFFFFF] rounded shadow-[0_4px_12px_rgba(30,30,36,0.07)] p-6 mt-8">
      <h2 className="text-xl font-bold mb-4 text-[#1E1E24]">
        Profil utilisateur
      </h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-[#1E1E24]">
            Email
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full border border-[#9EA1A9] rounded px-3 py-2 bg-[#F9F9FA] text-[#1E1E24] opacity-70"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-[#1E1E24]">
            Nom complet
          </label>
          <input
            type="text"
            name="nom_complet"
            value={profile.nom_complet}
            onChange={handleChange}
            className="w-full border border-[#9EA1A9] rounded px-3 py-2 bg-[#F9F9FA] text-[#1E1E24] focus:outline-none focus:ring-2 focus:ring-[#FF8AB0] focus:border-[#F50057]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-[#1E1E24]">
            Langue
          </label>
          <select
            name="langue"
            value={profile.langue}
            onChange={handleChange}
            className="w-full border border-[#9EA1A9] rounded px-3 py-2 bg-[#F9F9FA] text-[#1E1E24] focus:outline-none focus:ring-2 focus:ring-[#FF8AB0] focus:border-[#F50057]"
          >
            {LANG_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-[#FF6A3D] text-white px-4 py-2 rounded hover:bg-[#FF3D00] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFA76C] disabled:opacity-33"
          disabled={loading}
        >
          Mettre à jour
        </button>
      </form>
      {message && (
        <div className="mt-4 text-[#F50057] font-medium">{message}</div>
      )}
      <button
        onClick={handleSignOut}
        className="mt-6 w-full bg-[#F9F9FA] text-[#1E1E24] border border-[#9EA1A9] px-4 py-2 rounded hover:bg-[#F9F9FA] hover:text-[#F50057] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF8AB0]"
      >
        Déconnexion
      </button>
    </div>
  );
}
