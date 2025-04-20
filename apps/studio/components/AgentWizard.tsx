import React, { useState } from "react";

export default function AgentWizard() {
  const [promptSysteme, setPromptSysteme] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      promptSysteme, // inclure même si vide
    };
    const response = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      setPromptSysteme("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="prompt-systeme" className="block font-medium mb-1">
        Comportement personnalisé de l’agent (optionnel)
      </label>
      <textarea
        id="prompt-systeme"
        name="prompt-systeme"
        className="w-full border rounded p-2 mb-4"
        placeholder="Ex. : Tu es un conseiller téléphonique courtois et rassurant..."
        value={promptSysteme}
        onChange={(e) => setPromptSysteme(e.target.value)}
        rows={4}
      />
    </form>
  );
}
