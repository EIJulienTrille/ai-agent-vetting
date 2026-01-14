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

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    // Ton appel API ici...
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full p-6 lg:p-12 gap-8 items-start justify-center max-w-[1600px] mx-auto">
      {/* SECTION VETTING (Gaucher) */}
      <div className="w-full lg:w-[65%] flex flex-col">
        <h1 className="text-4xl font-serif mb-6 tracking-tight">VETTING</h1>
        <div className="bg-white rounded-[40px] shadow-sm flex flex-col h-[700px] p-10 relative">
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto space-y-6 mb-20 pr-4"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-4 px-6 rounded-2xl max-w-[85%] text-sm ${
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

          {/* Barre de saisie flottante épurée */}
          <div className="absolute bottom-8 left-10 right-10">
            <div className="bg-[#F2F2F7] rounded-2xl flex items-center px-6 py-4">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="bg-transparent flex-1 outline-none text-sm"
                placeholder="Écrivez votre message..."
              />
              <button onClick={handleSend} className="ml-4 text-[#007AFF]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m22 2-7 20-4-9-9-4Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION QUALIFICATION (Droite) */}
      <div className="w-full lg:w-[35%] flex flex-col">
        <div className="flex justify-between items-baseline mb-6 border-b border-black pb-2">
          <h2 className="text-2xl font-serif tracking-tight">QUALIFICATION</h2>
        </div>
        <div className="bg-white rounded-[40px] shadow-sm p-12 h-[700px] flex flex-col space-y-16">
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
              Mandant
            </p>
            <div className="border-b border-gray-100 pb-2 flex justify-between">
              <span className="text-lg">{clientData.name}</span>
              <span className="text-[10px] text-gray-200">EN COURS</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
              Capacité financière
            </p>
            <div className="border-b border-gray-100 pb-2">
              <span className="text-lg">{clientData.budget}</span>
            </div>
          </div>

          <div className="pt-10">
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-4">
              Verdict Dossier
            </p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold italic">
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
