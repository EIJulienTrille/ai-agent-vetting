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
  const [isTyping, setIsTyping] = useState(false);
  const [clientData, setClientData] = useState({
    name: "-",
    budget: "-",
    project: "EN COURS",
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history: messages }),
      });
      const data = await response.json();
      if (data.text) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.text },
        ]);
        if (data.analysis) setClientData(data.analysis);
      }
    } catch (error) {
      console.error("Erreur API:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#F5F5F7",
        minHeight: "100vh",
        padding: "60px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "40px",
          width: "100%",
          maxWidth: "1600px",
          margin: "0 auto",
          alignItems: "stretch", // Garantit la même hauteur pour les deux blocs
        }}
      >
        {/* BLOC VETTING (70%) */}
        <div style={{ width: "70%", display: "flex", flexDirection: "column" }}>
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "800",
              marginBottom: "30px",
              letterSpacing: "-0.04em",
            }}
          >
            VETTING
          </h1>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "40px",
              height: "750px",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
              overflow: "hidden",
            }}
          >
            <div
              ref={scrollRef}
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "50px 60px",
                paddingBottom: "140px",
              }}
              className="custom-scrollbar"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent:
                      m.role === "user" ? "flex-end" : "flex-start",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      padding: "18px 30px",
                      borderRadius: "26px",
                      maxWidth: "75%",
                      fontSize: "16px",
                      backgroundColor:
                        m.role === "user" ? "#007AFF" : "#F2F2F7",
                      color: m.role === "user" ? "white" : "#1d1d1f",
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {/* Effet de transition "IA qui réfléchit" */}
              {isTyping && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      padding: "18px 30px",
                      borderRadius: "26px",
                      backgroundColor: "#F2F2F7",
                      display: "flex",
                      gap: "4px",
                      alignItems: "center",
                    }}
                  >
                    <span className="dot dot1"></span>
                    <span className="dot dot2"></span>
                    <span className="dot"></span>
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                position: "absolute",
                bottom: "0",
                left: "0",
                right: "0",
                padding: "40px",
                backgroundColor: "white",
              }}
            >
              <div
                style={{
                  backgroundColor: "#F2F2F7",
                  borderRadius: "22px",
                  display: "flex",
                  padding: "18px 30px",
                  alignItems: "center",
                }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  style={{
                    background: "transparent",
                    flex: 1,
                    border: "none",
                    outline: "none",
                    fontSize: "16px",
                  }}
                  placeholder="Écrivez votre message..."
                />
                <button
                  onClick={handleSend}
                  style={{
                    color: "#007AFF",
                    marginLeft: "20px",
                    cursor: "pointer",
                  }}
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BLOC QUALIFICATION (30%) */}
        <div style={{ width: "30%", display: "flex", flexDirection: "column" }}>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "700",
              marginBottom: "30px",
              paddingBottom: "15px",
              borderBottom: "2px solid black",
            }}
          >
            QUALIFICATION
          </h2>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "40px",
              padding: "50px 40px",
              flex: 1, // Prend toute la hauteur disponible du parent (stretch)
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "50px" }}
            >
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#A1A1A6",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    marginBottom: "12px",
                  }}
                >
                  Mandant
                </p>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "500",
                    borderBottom: "1px solid #F2F2F7",
                    paddingBottom: "10px",
                  }}
                >
                  {clientData.name}
                </div>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#A1A1A6",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    marginBottom: "12px",
                  }}
                >
                  Capacité financière
                </p>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "500",
                    borderBottom: "1px solid #F2F2F7",
                    paddingBottom: "10px",
                  }}
                >
                  {clientData.budget}
                </div>
              </div>
              <div style={{ marginTop: "20px" }}>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#A1A1A6",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    marginBottom: "15px",
                  }}
                >
                  Verdict Dossier
                </p>
                <span
                  style={{
                    fontSize: "32px",
                    fontWeight: "800",
                    fontStyle: "italic",
                    transition: "color 0.5s ease",
                    color:
                      clientData.project === "RECEVABLE"
                        ? "#34C759"
                        : clientData.project === "NON RECEVABLE"
                        ? "#FF3B30"
                        : "#1d1d1f",
                  }}
                >
                  {clientData.project}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
