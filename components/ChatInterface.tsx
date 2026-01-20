"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Interface ChatInterface : Gère l'expérience de messagerie acheteur.
 * Intègre la détection du bien (propertyId) et la restauration de lead (leadId).
 */
export default function ChatInterface() {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("propertyId"); // ID du bien pour le contexte IA
  const leadId = searchParams.get("leadId"); // ID du prospect pour le Dashboard

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Bienvenue chez Maison Trille. Je suis votre expert dédié. Pour commencer l'audit de qualification, pouvez-vous m'indiquer votre nom ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll pour suivre la conversation
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Envoi du message à l'API
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
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
          history: JSON.stringify(messages),
          propertyId: propertyId, // Envoi du contexte du bien immobilier
        }),
      });

      const data = await response.json();

      if (data.text) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.text },
        ]);
      }
    } catch (error) {
      console.error("Erreur Chat:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "white",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header Statutaire */}
      <div
        style={{
          padding: "20px 40px",
          borderBottom: "1px solid #F2F2F7",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>
            Expertise Maison Trille
          </h2>
          <p style={{ margin: 0, fontSize: "12px", color: "#34C759" }}>
            ● Audit de qualification en cours
          </p>
        </div>
        {propertyId && (
          <div
            style={{
              fontSize: "12px",
              color: "#8E8E93",
              backgroundColor: "#F2F2F7",
              padding: "6px 12px",
              borderRadius: "8px",
            }}
          >
            Réf. Bien : #{propertyId}
          </div>
        )}
      </div>

      {/* Zone de messages */}
      <div
        ref={scrollRef}
        style={{ flex: 1, overflowY: "auto", padding: "40px" }}
      >
        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto",
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
                backgroundColor: m.role === "user" ? "#007AFF" : "#F2F2F7",
                color: m.role === "user" ? "white" : "#1C1C1E",
                padding: "14px 20px",
                borderRadius: "18px",
                maxWidth: "80%",
                fontSize: "15px",
                lineHeight: "1.4",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              {m.content}
            </div>
          ))}
          {loading && (
            <div style={{ color: "#8E8E93", fontSize: "13px" }}>
              L'expert analyse vos réponses...
            </div>
          )}
        </div>
      </div>

      {/* Input de saisie */}
      <div style={{ padding: "30px 40px", borderTop: "1px solid #F2F2F7" }}>
        <form
          onSubmit={sendMessage}
          style={{ maxWidth: "700px", margin: "0 auto", position: "relative" }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Répondez à l'expert..."
            style={{
              width: "100%",
              padding: "16px 24px",
              borderRadius: "30px",
              border: "1px solid #E5E5E7",
              backgroundColor: "#F9F9FB",
              fontSize: "15px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          <button
            type="submit"
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "#007AFF",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ↑
          </button>
        </form>
      </div>
    </div>
  );
}
