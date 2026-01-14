"use client";
import React, { useState, useEffect, useRef } from "react";

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Bienvenue chez Maison Trille. Pour commencer, agissez-vous en votre nom propre ou représentez-vous une entité ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [clientData, setClientData] = useState({
    name: "-",
    budget: "-",
    project: "EN COURS",
  });
  const [isTyping, setIsTyping] = useState(false);
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
      console.error("Erreur API", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-[#f9f9fb] p-4 lg:p-12 gap-10 items-stretch justify-center max-w-[1400px] mx-auto">
      {/* SECTION VETTING (Chat) */}
      <div className="flex-[2] flex flex-col space-y-6">
        <h1 className="text-4xl font-serif tracking-tight text-gray-900 ml-2">
          VETTING
        </h1>
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 flex flex-col flex-1 relative overflow-hidden min-h-[600px] lg:min-h-[750px]">
          {/* Zone de messages avec marges intérieures harmonieuses */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-8 custom-scrollbar pb-32"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-5 px-7 rounded-[24px] max-w-[85%] text-[15px] leading-relaxed shadow-sm ${
                    m.role === "user"
                      ? "bg-[#007AFF] text-white rounded-tr-none"
                      : "bg-[#f2f2f7] text-[#1d1d1f] rounded-tl-none"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-xs text-gray-400 animate-pulse ml-2 font-medium">
                Maison Trille analyse...
              </div>
            )}
          </div>

          {/* Barre de saisie style ChatGPT (flottante avec marges) */}
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white via-white/90 to-transparent">
            <div className="max-w-3xl mx-auto flex items-center bg-[#f4f4f4] rounded-2xl px-6 py-4 border border-gray-200 focus-within:border-gray-400 transition-all">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="bg-transparent flex-1 outline-none text-[15px]"
                placeholder="Répondez ici..."
              />
              <button
                onClick={handleSend}
                className="ml-4 text-[#007AFF] hover:scale-110 transition-transform"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION QUALIFICATION (Fiche) */}
      <div className="flex-1 flex flex-col space-y-6">
        <h2 className="text-2xl font-serif tracking-tight text-gray-900 border-b border-gray-200 pb-4">
          QUALIFICATION
        </h2>
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-10 flex flex-col space-y-12 flex-1">
          <div className="space-y-3">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Mandant
            </p>
            <div className="border-b border-gray-100 pb-3">
              <span className="text-lg font-medium text-gray-800">
                {clientData.name}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Capacité financière
            </p>
            <div className="border-b border-gray-100 pb-3">
              <span className="text-lg font-medium text-gray-800">
                {clientData.budget}
              </span>
            </div>
          </div>

          <div className="pt-10">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              Verdict Dossier
            </p>
            <div className="flex justify-between items-center">
              <span
                className={`text-3xl font-bold italic tracking-tighter ${
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
  );
}
