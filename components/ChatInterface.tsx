"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

export default function ChatInterface() {
  const searchParams = useSearchParams();
  const leadId = searchParams.get("leadId");

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

  // Charger l'historique si on vient du Dashboard
  useEffect(() => {
    if (leadId) {
      fetch(`/api/leads/${leadId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.last_message) {
            setMessages([
              { role: "assistant", content: "Historique restauré." },
              { role: "assistant", content: data.last_message },
            ]);
          }
        });
    }
  }, [leadId]);

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
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ padding: "30px 50px", borderBottom: "1px solid #F2F2F7" }}>
        <h2 style={{ fontSize: "32px", fontWeight: "800", margin: 0 }}>
          Messagerie
        </h2>
        <p style={{ color: "#8E8E93", fontSize: "14px" }}>
          {leadId
            ? "Consultation d'un dossier existant"
            : "Nouvel audit de qualification"}
        </p>
      </div>

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
              padding: "18px 24px",
              borderRadius:
                m.role === "user" ? "22px 22px 0 22px" : "22px 22px 22px 0",
              backgroundColor: m.role === "user" ? "#007AFF" : "#F2F2F7",
              color: m.role === "user" ? "white" : "#1C1C1E",
              fontSize: "16px",
            }}
          >
            {m.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: "30px 50px", borderTop: "1px solid #F2F2F7" }}>
        <div
          style={{
            display: "flex",
            gap: "15px",
            backgroundColor: "#F9F9FB",
            padding: "12px",
            borderRadius: "20px",
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
