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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automatique vers le bas à chaque nouveau message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulation de réponse IA (à remplacer par votre appel API OpenAI/Mistral)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Merci pour cette précision. Pour continuer l'audit, j'ai besoin de connaître votre capacité financière.",
        },
      ]);
    }, 1000);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%", // Prend 100% du conteneur parent défini dans page.tsx
        width: "100%",
        backgroundColor: "white",
      }}
    >
      {/* 1. ZONE DES MESSAGES (Flexible et Scrollable) */}
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
              lineHeight: "1.4",
              boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
            }}
          >
            {m.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 2. BARRE DE RÉDACTION (Fixe en bas) */}
      <div
        style={{
          padding: "20px 30px",
          borderTop: "1px solid #F2F2F7",
          backgroundColor: "white",
          flexShrink: 0, // Empêche cette barre de s'écraser
        }}
      >
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
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Écrivez votre message..."
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
            style={{
              backgroundColor: "#007AFF",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "12px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "transform 0.1s",
            }}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.95)")
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}
