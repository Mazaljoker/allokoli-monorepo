import React, { useState } from "react";

const AgentWizard: React.FC = () => {
  const [nom, setNom] = useState("");
  const [secteurActivite, setSecteurActivite] = useState("");
  const [ton, setTon] = useState("professionnel");
  const [langue, setLangue] = useState("fr");
  const [consentement, setConsentement] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentement) {
      alert("Vous devez accepter le consentement RGPD.");
      return;
    }
    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom,
          secteur_activite: secteurActivite,
          ton,
          langue,
        }),
      });
      if (response.ok) {
        alert("Agent créé avec succès");
        setNom("");
        setSecteurActivite("");
        setTon("professionnel");
        setLangue("fr");
        setConsentement(false);
      } else {
        const data = await response.json().catch(() => ({}));
        alert("Erreur : " + (data.error || data.message || "Erreur inconnue"));
      }
    } catch (err: any) {
      alert("Erreur : " + (err.message || err));
    }
  };

  return (
    <form
      className="max-w-md mx-auto p-6 bg-[#FFFFFF] rounded shadow-[0_4px_12px_rgba(30,30,36,0.07)] flex flex-col gap-4"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="block mb-1 font-medium text-[#1E1E24]">Nom</label>
        <input
          type="text"
          className="w-full border border-[#9EA1A9] rounded px-3 py-2 bg-[#F9F9FA] text-[#1E1E24] focus:outline-none focus:ring-2 focus:ring-[#FFA76C]"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium text-[#1E1E24]">Secteur d'activité</label>
        <input
          type="text"
          className="w-full border border-[#9EA1A9] rounded px-3 py-2 bg-[#F9F9FA] text-[#1E1E24] focus:outline-none focus:ring-2 focus:ring-[#FFA76C]"
          value={secteurActivite}
          onChange={(e) => setSecteurActivite(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium text-[#1E1E24]">Ton</label>
        <select
          className="w-full border border-[#9EA1A9] rounded px-3 py-2 bg-[#F9F9FA] text-[#1E1E24] focus:outline-none focus:ring-2 focus:ring-[#FFA76C]"
          value={ton}
          onChange={(e) => setTon(e.target.value)}
        >
          <option value="professionnel">Professionnel</option>
          <option value="amical">Amical</option>
          <option value="neutre">Neutre</option>
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium text-[#1E1E24]">Langue</label>
        <select
          className="w-full border border-[#9EA1A9] rounded px-3 py-2 bg-[#F9F9FA] text-[#1E1E24] focus:outline-none focus:ring-2 focus:ring-[#FFA76C]"
          value={langue}
          onChange={(e) => setLangue(e.target.value)}
        >
          <option value="fr">Français</option>
          <option value="en">Anglais</option>
          <option value="es">Espagnol</option>
          {/* Ajoutez d'autres langues si besoin */}
        </select>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="consentement"
          checked={consentement}
          onChange={(e) => setConsentement(e.target.checked)}
          className="mr-2 accent-[#FF6A3D] focus:ring-2 focus:ring-[#FFA76C]"
          required
        />
        <label htmlFor="consentement" className="text-sm text-[#1E1E24]">
          J'accepte le traitement de mes données (RGPD)
        </label>
      </div>
      <button
        type="submit"
        className="bg-[#FF6A3D] text-white rounded px-4 py-2 font-semibold hover:bg-[#FF3D00] transition focus:outline-none focus:ring-2 focus:ring-[#FFA76C] disabled:opacity-33"
      >
        Créer mon agent
      </button>
    </form>
  );
};

export default AgentWizard;
