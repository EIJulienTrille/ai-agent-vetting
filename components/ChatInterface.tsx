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
      }}
    >
      <div className="flex flex-col lg:flex-row gap-12 max-w-[1600px] mx-auto items-stretch">
        {/* BLOC VETTING */}
        <div className="flex-[2] flex flex-col">
          <h1 className="text-5xl font-serif mb-8 tracking-tighter">VETTING</h1>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "40px",
              height: "750px",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              overflow: "hidden",
            }}
          >
            {/* Zone de Chat avec marges intérieures généreuses */}
            <div
              ref={scrollRef}
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "50px",
                paddingBottom: "120px",
              }}
              className="custom-scrollbar"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  } mb-6`}
                >
                  <div
                    style={{
                      padding: "16px 28px",
                      borderRadius: "24px",
                      maxWidth: "80%",
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
                <div className="text-xs text-gray-400 italic">
                  Maison Trille traite votre dossier...
                </div>
              )}
            </div>

            {/* BARRE DE SAISIE : FORCÉE EN BAS DU BLOC */}
            <div
              style={{
                position: "absolute",
                bottom: "0",
                left: "0",
                right: "0",
                padding: "30px",
                backgroundColor: "white",
                borderTop: "1px solid #F2F2F7",
              }}
            >
              <div
                style={{
                  backgroundColor: "#F2F2F7",
                  borderRadius: "20px",
                  display: "flex",
                  padding: "15px 25px",
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
                  placeholder="Écrivez votre message..."
                />
                <button
                  onClick={handleSend}
                  style={{
                    color: "#007AFF",
                    marginLeft: "15px",
                    cursor: "pointer",
                  }}
                >
                  <svg
                    width="24"
                    height="24"
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

        {/* BLOC QUALIFICATION */}
        <div className="flex-1 flex flex-col">
          <h2 className="text-2xl font-serif mb-8 border-b border-black pb-4">
            QUALIFICATION
          </h2>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "40px",
              padding: "50px",
              height: "750px",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          >
            <div className="space-y-12">
              <div className="border-b border-gray-50 pb-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Mandant
                </p>
                <span className="text-lg font-medium">{clientData.name}</span>
              </div>
              <div className="border-b border-gray-50 pb-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Capacité financière
                </p>
                <span className="text-lg font-medium">{clientData.budget}</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Verdict Dossier
                </p>
                <span
                  className={`text-3xl font-bold italic ${
                    clientData.project === "RECEVABLE"
                      ? "text-green-500"
                      : clientData.project === "NON RECEVABLE"
                      ? "text-red-500"
                      : "text-gray-900"
                  }`}
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
