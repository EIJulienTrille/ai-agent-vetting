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
  const [isLoading, setIsLoading] = useState(false); // État pour le chargement
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // APPEL RÉEL À GEMINI 3 FLASH
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: messages.map((m) => `${m.role}: ${m.content}`).join("\n"),
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
      console.error("Erreur chat:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Désolé, j'ai une erreur technique." },
      ]);
    } finally {
      setIsLoading(false);
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
              lineHeight: "1.4",
            }}
          >
            {m.content}
          </div>
        ))}
        {isLoading && (
          <p style={{ fontSize: "12px", color: "#8E8E93" }}>
            Maison Trille réfléchit...
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div
        style={{
          padding: "20px 30px",
          borderTop: "1px solid #F2F2F7",
          backgroundColor: "white",
          flexShrink: 0,
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
            disabled={isLoading}
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
            disabled={isLoading}
            style={{
              backgroundColor: isLoading ? "#ccc" : "#007AFF",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "12px",
              fontWeight: "600",
              cursor: isLoading ? "default" : "pointer",
            }}
          >
            {isLoading ? "..." : "Envoyer"}
          </button>
        </div>
      </div>
    </div>
  );
}
