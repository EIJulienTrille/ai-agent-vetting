"use client";
import React, { useState, useEffect, useRef } from "react";

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
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
      if (!response.ok) throw new Error(data.text || "Erreur serveur");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.text },
      ]);
    } catch (err) {
      console.error("Erreur Chat:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "L'expert Maison Trille rencontre une difficulté. Veuillez réessayer.",
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
      {/* Zone de Messagerie */}
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
              lineHeight: "1.5",
              boxShadow:
                m.role === "user" ? "0 2px 10px rgba(0,122,255,0.1)" : "none",
            }}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div
            style={{
              alignSelf: "flex-start",
              color: "#8E8E93",
              fontSize: "13px",
              fontStyle: "italic",
              marginLeft: "10px",
            }}
          >
            Maison Trille analyse votre réponse...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Barre d'input optimisée */}
      <div style={{ padding: "20px 30px", borderTop: "1px solid #F2F2F7" }}>
        <div
          style={{
            display: "flex",
            gap: "12px",
            backgroundColor: "#F9F9FB",
            padding: "8px",
            borderRadius: "16px",
            border: "1px solid #E5E5E7",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={input}
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Écrivez votre réponse ici..."
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
              backgroundColor: "#007AFF",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "12px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "600",
              transition: "opacity 0.2s",
            }}
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}
