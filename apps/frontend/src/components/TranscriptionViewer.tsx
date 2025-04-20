import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Message = {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: string; // ISO string
};

type Props = {
  callId: string;
};

export const TranscriptionViewer: React.FC<Props> = ({ callId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData?.session?.access_token) {
          throw new Error("Impossible de récupérer le token d'authentification.");
        }
        const token = sessionData.session.access_token;
        const res = await fetch(`/api/calls/${callId}/messages`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error(`Erreur API: ${res.status}`);
        }
        const data = await res.json();
        // Tri par timestamp si besoin
        const sorted = Array.isArray(data)
          ? data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
          : [];
        setMessages(sorted);
      } catch (err: any) {
        setError(err.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [callId]);

  if (loading) return <div className="text-center py-4 text-[#9EA1A9]">Chargement…</div>;
  if (error) return <div className="text-[#FF3D00]">{error}</div>;

  return (
    <div className="bg-[#FFFFFF] rounded shadow-[0_4px_12px_rgba(30,30,36,0.07)] p-4 max-w-xl mx-auto">
      <h2 className="text-lg font-semibold mb-4 text-[#1E1E24]">Transcription de l'appel</h2>
      <ul className="space-y-2">
        {messages.map((msg) => (
          <li
            key={msg.id}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-[80%] break-words ${
                msg.role === "user"
                  ? "bg-[#FF6A3D] bg-opacity-10 text-right text-[#1E1E24]"
                  : "bg-[#F9F9FA] text-left text-[#1E1E24]"
              }`}
            >
              <span>{msg.content}</span>
            </div>
            <span className="text-xs text-[#9EA1A9] mt-1">
              {new Date(msg.timestamp).toLocaleTimeString("fr-FR")}
              {" · "}
              {msg.role === "user" ? "Utilisateur" : "Agent"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TranscriptionViewer;
