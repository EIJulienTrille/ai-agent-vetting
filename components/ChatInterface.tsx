"use client";
import React, { useState, useEffect, useRef } from "react";

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Bienvenue chez Maison Trille. Agissez-vous en votre nom propre ou représentez-vous une entité ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    // 1. Ajouter le message de l'utilisateur à l'interface
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // 2. Préparation de l'historique textuel pour Gemini
      // On transforme le tableau d'objets en une seule chaîne de texte propre
      const chatHistory = messages
        .map((m) => `${m.role === "user" ? "Client" : "Expert"}: ${m.content}`)
        .join("\n");

      // 3. Appel à l'API (Route : /api/chat)
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: chatHistory,
        }),
      });

      const data = await response.json();

      // 4. Vérification de la validité de la réponse
      if (!response.ok) {
        throw new Error(data.text || "Erreur serveur");
      }

      // 5. Mise à jour de l'interface avec la réponse de Gemini
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        backgroundColor: "white",
      }}
    >
      {/* ZONE DE MESSAGES */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "30px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "75%",
              padding: "15px 20px",
              borderRadius:
                m.role === "user" ? "20px 20px 0 20px" : "20px 20px 20px 0",
              backgroundColor: m.role === "user" ? "#007AFF" : "#F2F2F7",
              color: m.role === "user" ? "white" : "black",
              fontSize: "15px",
              boxShadow:
                m.role === "user" ? "0 4px 15px rgba(0,122,255,0.2)" : "none",
            }}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <p
            style={{ color: "#8E8E93", fontSize: "12px", fontStyle: "italic" }}
          >
            Maison Trille analyse votre réponse...
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ZONE D'INPUT */}
      <div style={{ padding: "20px 30px", borderTop: "1px solid #F2F2F7" }}>
        <div
          style={{
            display: "flex",
            gap: "12px",
            backgroundColor: "#F9F9FB",
            padding: "8px",
            borderRadius: "16px",
            border: "1px solid #E5E5E7",
          }}
        >
          <input
            type="text"
            value={input}
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Écrivez votre réponse..."
            style={{
              flex: 1,
              border: "none",
              backgroundColor: "transparent",
              padding: "10px",
              outline: "none",
              fontSize: "15px",
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{
              backgroundColor: loading || !input.trim() ? "#E5E5E7" : "#007AFF",
              color: "white",
              border: "none",
              padding: "10px 24px",
              borderRadius: "12px",
              fontWeight: "600",
              cursor: loading || !input.trim() ? "default" : "pointer",
              transition: "background 0.2s ease",
            }}
          >
            {loading ? "..." : "Envoyer"}
          </button>
        </div>
      </div>
    </div>
  );
}
