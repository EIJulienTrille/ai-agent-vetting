"use client";
import React, { useState, useEffect, useRef } from "react";

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Bienvenue chez Maison Trille. Comment puis-je vous aider ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [clientData, setClientData] = useState({
    name: "-",
    budget: "-",
    project: "EN COURS",
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    // Ton appel API ici...
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F5F7] flex flex-col lg:flex-row items-start justify-center p-6 lg:p-16 gap-10 font-sans">
      {/* SECTION VETTING : Largeur prédominante */}
      <div className="w-full lg:flex-[2] flex flex-col">
        <h1 className="text-5xl font-serif tracking-tight mb-8 text-black">
          VETTING
        </h1>
        <div className="bg-white rounded-[32px] shadow-sm min-h-[600px] flex flex-col p-8 lg:p-12 relative">
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto space-y-6 mb-24 pr-4 custom-scrollbar"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-4 px-6 rounded-2xl max-w-[80%] text-[15px] ${
                    m.role === "user"
                      ? "bg-[#007AFF] text-white"
                      : "bg-[#F2F2F7] text-black"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input flottant comme sur le design */}
          <div className="absolute bottom-10 left-8 right-8">
            <div className="bg-[#F2F2F7] rounded-2xl flex items-center px-6 py-4 shadow-inner">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="bg-transparent flex-1 outline-none text-[15px]"
                placeholder="Écrivez votre message..."
              />
              <button
                onClick={handleSend}
                className="ml-4 opacity-30 hover:opacity-100 transition-opacity"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION QUALIFICATION : Plus étroite et élégante */}
      <div className="w-full lg:flex-1 flex flex-col">
        <h2 className="text-2xl font-serif tracking-tight mb-8 text-black border-b border-black pb-4">
          QUALIFICATION
        </h2>
        <div className="bg-white rounded-[32px] shadow-sm min-h-[600px] p-10 space-y-12">
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Mandant
            </p>
            <div className="flex justify-between items-end border-b border-gray-100 pb-2">
              <span className="text-lg font-medium">{clientData.name}</span>
              <span className="text-[10px] text-gray-300 font-bold uppercase">
                EN COURS
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Capacité Financière
            </p>
            <div className="flex justify-between items-end border-b border-gray-100 pb-2">
              <span className="text-lg font-medium">{clientData.budget}</span>
              <span className="text-[10px] text-gray-300 font-bold uppercase">
                À VÉRIFIER
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-10">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Verdict Dossier
            </p>
            <div className="flex justify-between items-center">
              <span
                className={`text-xl font-bold italic tracking-tighter ${
                  clientData.project === "RECEVABLE"
                    ? "text-green-500"
                    : "text-gray-900"
                }`}
              >
                {clientData.project}
              </span>
              <span className="text-[9px] text-gray-300 italic">
                RECEVABLE = CONTACT
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
