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
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
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

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();

      // Vérification et parsing sécurisé de la réponse de l'IA
      if (data && data.text) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.text },
        ]);

        // Appel silencieux pour enregistrer la discussion dans la base de données
        fetch("/api/admin/log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agency_id: "maison-trille-demo", // Identifiant pour votre dashboard
            status: "SUCCESS",
            verdict: data.analysis?.project || "EN COURS",
            conversation: [
              ...messages,
              userMsg,
              { role: "assistant", content: data.text },
            ],
          }),
        }).catch((err) => console.error("Erreur de logging database:", err));

        // Mise à jour de la fiche de qualification uniquement si l'analyse est présente
        if (data.analysis) {
          setClientData({
            name: data.analysis.name || "-",
            budget: data.analysis.budget || "-",
            project: data.analysis.project || "EN COURS",
          });
        }
      } else {
        throw new Error("Format de réponse de l'IA invalide");
      }
    } catch (error) {
      console.error("Détail de l'erreur technique:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Désolé, je rencontre une difficulté technique pour analyser votre demande. Pouvez-vous reformuler ?",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#F5F5F7",
        minHeight: "100%",
        padding: "40px 60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "40px",
          width: "100%",
          maxWidth: "1400px",
          alignItems: "stretch",
        }}
      >
        {/* BLOC VETTING (70%) */}
        <div style={{ width: "70%", display: "flex", flexDirection: "column" }}>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "800",
              marginBottom: "20px",
              letterSpacing: "-0.04em",
            }}
          >
            VETTING
          </h1>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "40px",
              height: "600px",
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
                padding: "40px 50px",
                paddingBottom: "120px",
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
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      padding: "16px 26px",
                      borderRadius: "24px",
                      maxWidth: "75%",
                      fontSize: "15px",
                      backgroundColor:
                        m.role === "user" ? "#007AFF" : "#F2F2F7",
                      color: m.role === "user" ? "white" : "#1d1d1f",
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      padding: "16px 26px",
                      borderRadius: "24px",
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
                padding: "30px",
                backgroundColor: "white",
              }}
            >
              <div
                style={{
                  backgroundColor: "#F2F2F7",
                  borderRadius: "18px",
                  display: "flex",
                  padding: "14px 24px",
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
                    fontSize: "15px",
                  }}
                  placeholder="Répondez à l'agent..."
                />
                <button
                  onClick={handleSend}
                  style={{
                    color: "#007AFF",
                    marginLeft: "15px",
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                  }}
                >
                  <svg
                    width="22"
                    height="22"
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
              fontSize: "20px",
              fontWeight: "700",
              marginBottom: "20px",
              paddingBottom: "10px",
              borderBottom: "2px solid black",
            }}
          >
            QUALIFICATION
          </h2>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "40px",
              padding: "40px 35px",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "40px" }}
            >
              <div>
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    color: "#A1A1A6",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    marginBottom: "8px",
                  }}
                >
                  Mandant
                </p>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "500",
                    borderBottom: "1px solid #F2F2F7",
                    paddingBottom: "8px",
                  }}
                >
                  {clientData.name}
                </div>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    color: "#A1A1A6",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    marginBottom: "8px",
                  }}
                >
                  Capacité financière
                </p>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "500",
                    borderBottom: "1px solid #F2F2F7",
                    paddingBottom: "8px",
                  }}
                >
                  {clientData.budget}
                </div>
              </div>
              <div style={{ marginTop: "10px" }}>
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    color: "#A1A1A6",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    marginBottom: "12px",
                  }}
                >
                  Verdict Dossier
                </p>
                <span
                  style={{
                    fontSize: "24px",
                    fontWeight: "800",
                    fontStyle: "italic",
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
