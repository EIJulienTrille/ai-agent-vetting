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
        backgroundColor: "white",
      }}
    >
      <div style={{ padding: "40px 60px", borderBottom: "1px solid #F2F2F7" }}>
        <h2
          style={{
            fontSize: "32px",
            fontWeight: "800",
            margin: 0,
            letterSpacing: "-0.03em",
          }}
        >
          Messagerie
        </h2>
        <p
          style={{
            color: "#8E8E93",
            margin: "8px 0 0 0",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Expertise Maison Trille — Session active
        </p>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "40px 60px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "65%",
              padding: "16px 24px",
              borderRadius:
                m.role === "user" ? "22px 22px 0 22px" : "22px 22px 22px 0",
              backgroundColor: m.role === "user" ? "#007AFF" : "#F2F2F7",
              color: m.role === "user" ? "white" : "#1C1C1E",
              fontSize: "16px",
              lineHeight: "1.5",
              fontWeight: "450",
            }}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div
            style={{ color: "#8E8E93", fontSize: "14px", fontStyle: "italic" }}
          >
            Analyse en cours...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div
        style={{
          padding: "30px 60px",
          backgroundColor: "white",
          borderTop: "1px solid #F2F2F7",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "15px",
            backgroundColor: "#F9F9FB",
            padding: "10px",
            borderRadius: "20px",
            border: "1px solid #E5E5E7",
          }}
        >
          <input
            style={{
              flex: 1,
              border: "none",
              background: "none",
              padding: "12px",
              outline: "none",
              fontSize: "16px",
              fontFamily: "inherit", // Utilise la police sans-serif du parent
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Écrivez ici..."
          />
          <button
            onClick={handleSend}
            style={{
              backgroundColor: "#007AFF",
              color: "white",
              border: "none",
              padding: "12px 24px",
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
