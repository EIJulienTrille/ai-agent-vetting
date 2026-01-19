"use client";
import React, { useState, useEffect, useRef } from "react";

// Structure de message recommandée pour 2026
interface Message {
  role: "assistant" | "user";
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Bienvenue chez Maison Trille. Agissez-vous en votre nom propre ou représentez-vous une entité ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Gestion du défilement automatique
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    // 1. Ajouter le message utilisateur à l'état local
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // 2. Appel à l'API OpenAI (Route : /api/chat)
      // L'historique est envoyé pour maintenir le contexte de la conversation
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: messages
            .map(
              (m) => `${m.role === "user" ? "Client" : "Expert"}: ${m.content}`
            )
            .join("\n"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.text || "Erreur serveur");
      }

      // 3. Ajouter la réponse de GPT-5.1 au chat
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.text },
      ]);
    } catch (err) {
      console.error("Erreur ChatInterface:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "L'expert Maison Trille rencontre une difficulté de connexion. Veuillez réessayer.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white font-sans text-gray-900">
      {/* Zone de messages scrollable */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col gap-6">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[80%] p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
              m.role === "user"
                ? "self-end bg-blue-600 text-white rounded-br-none"
                : "self-start bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="self-start bg-gray-50 p-4 rounded-2xl border border-gray-100 italic text-gray-500 text-sm animate-pulse">
            Maison Trille analyse votre demande...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Barre d'entrée de texte fixe */}
      <div className="p-6 border-t border-gray-100 bg-white">
        <div className="flex gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <input
            type="text"
            value={input}
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Écrivez votre réponse ici..."
            className="flex-1 bg-transparent p-3 outline-none placeholder-gray-400 text-[15px]"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-md ${
              loading || !input.trim()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
            }`}
          >
            {loading ? "..." : "Envoyer"}
          </button>
        </div>
      </div>
    </div>
  );
}
