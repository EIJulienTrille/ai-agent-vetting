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

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: messages.map((m) => `${m.role}: ${m.content}`).join("\n"),
        }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.text },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Erreur de connexion avec l'expert." },
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
            }}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <p style={{ color: "#8E8E93", fontSize: "12px" }}>
            Maison Trille analyse votre réponse...
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>

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
            placeholder="Répondez ici..."
            style={{
              flex: 1,
              border: "none",
              backgroundColor: "transparent",
              padding: "10px",
              outline: "none",
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            style={{
              backgroundColor: "#007AFF",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}
