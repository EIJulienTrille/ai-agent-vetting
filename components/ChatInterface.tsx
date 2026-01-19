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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          message: input,
          history: messages.map((m) => m.content).join("\n"),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.text },
      ]);
    } catch (e) {
      console.error(e);
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
      }}
    >
      {/* Header Interne */}
      <div style={{ padding: "30px 50px", borderBottom: "1px solid #F2F2F7" }}>
        <h2 style={{ fontSize: "32px", fontWeight: "800", margin: 0 }}>
          Messagerie
        </h2>
        <p style={{ color: "#8E8E93", margin: "5px 0 0 0", fontSize: "14px" }}>
          Session active — Audit de qualification
        </p>
      </div>

      {/* Zone de conversation */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "40px 50px",
          display: "flex",
          flexDirection: "column",
          gap: "25px",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "70%",
              padding: "20px 25px",
              borderRadius:
                m.role === "user" ? "25px 25px 0 25px" : "25px 25px 25px 0",
              backgroundColor: m.role === "user" ? "#007AFF" : "#F2F2F7",
              color: m.role === "user" ? "white" : "#1C1C1E",
              fontSize: "16px",
              lineHeight: "1.5",
              boxShadow: "0 2px 5px rgba(0,0,0,0.02)",
            }}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div
            style={{ color: "#8E8E93", fontSize: "14px", fontStyle: "italic" }}
          >
            Analyse en cours par l'expert...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input fixe en bas */}
      <div
        style={{
          padding: "30px 50px",
          backgroundColor: "white",
          borderTop: "1px solid #F2F2F7",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "15px",
            backgroundColor: "#F9F9FB",
            padding: "12px",
            borderRadius: "20px",
            border: "1px solid #E5E5E7",
          }}
        >
          <input
            style={{
              flex: 1,
              border: "none",
              background: "none",
              padding: "10px",
              outline: "none",
              fontSize: "16px",
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Répondez ici..."
          />
          <button
            onClick={handleSend}
            style={{
              backgroundColor: "#007AFF",
              color: "white",
              border: "none",
              padding: "12px 30px",
              borderRadius: "14px",
              fontWeight: "700",
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
