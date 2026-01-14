"use client";
import React, { useState, useEffect, useRef } from "react";

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Bienvenue chez Maison Trille. Agissez-vous en votre nom propre ou représentez-vous une entité ou un tiers ?",
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

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history: messages }),
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.text },
      ]);
      if (data.analysis) setClientData(data.analysis);
    } catch (error) {
      console.error("Erreur technique", error);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center p-4 md:p-10 gap-8 bg-black/40 backdrop-blur-xl">
      {/* CARTE GAUCHE : VETTING CHAT */}
      <div className="figma-card w-full max-w-[400px] h-[600px] flex flex-col overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">
            Vetting
          </h1>
          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">
            Fonctionnalité — Expert Luxe
          </p>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gray-50/50"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                  m.role === "user"
                    ? "bg-blue-500 text-white rounded-tr-none"
                    : "bg-white text-gray-700 rounded-tl-none border border-gray-100"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-white border-t border-gray-100">
          <div className="relative flex items-center bg-gray-50 rounded-xl px-4 border border-gray-100 focus-within:border-blue-500 transition-all">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Écrivez votre message..."
              className="w-full bg-transparent py-4 text-sm outline-none text-gray-800 placeholder:text-gray-400"
            />
            <button
              onClick={handleSend}
              className="text-gray-300 hover:text-blue-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
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

      {/* CARTE DROITE : QUALIFICATION */}
      <div className="figma-card w-full max-w-[400px] h-[600px] p-10 flex flex-col">
        <div className="border-b border-gray-100 pb-6 mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">
            Qualification
          </h2>
          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">
            Fiche Prospect — Maison Trille
          </p>
        </div>

        <div className="space-y-10 flex-1">
          {[
            { label: "Mandant", value: clientData.name, status: "EN COURS" },
            {
              label: "Capacité financière",
              value: clientData.budget,
              status: "À VÉRIFIER",
            },
            { label: "Verdict Dossier", value: clientData.project, status: "" },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  {item.label}
                </span>
                {item.status && (
                  <span className="text-[9px] font-bold text-gray-300 uppercase">
                    {item.status}
                  </span>
                )}
              </div>
              <div
                className={`text-sm font-medium border-b border-gray-100 pb-2 flex justify-between ${
                  item.value === "RECEVABLE"
                    ? "text-green-500"
                    : item.value === "NON RECEVABLE"
                    ? "text-red-500"
                    : "text-gray-900"
                }`}
              >
                {item.value}
                {item.label === "Verdict Dossier" && (
                  <span className="text-[10px] opacity-50 italic">
                    RECEVABLE = CONTACT
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto text-center py-4 border-2 border-dashed border-gray-100 rounded-2xl">
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">
            Analyse IA en temps réel
          </p>
        </div>
      </div>
    </div>
  );
}
