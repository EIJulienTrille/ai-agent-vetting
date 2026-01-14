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
  const [isTyping, setIsTyping] = useState(false);
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
    setIsTyping(true);

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

      if (data.analysis) {
        setClientData(data.analysis);
      }
    } catch (error) {
      console.error("Erreur de vetting:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full p-6 lg:p-12 gap-10 items-start justify-center max-w-[1600px] mx-auto">
      {/* SECTION VETTING (Gaucher) */}
      <div className="w-full lg:flex-[2] flex flex-col">
        <h1 className="text-5xl font-serif mb-8 tracking-tighter text-black">
          VETTING
        </h1>
        <div className="bg-white rounded-[40px] shadow-sm flex flex-col h-[700px] p-8 lg:p-12 relative overflow-hidden">
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
                  className={`p-4 px-6 rounded-[22px] max-w-[80%] text-[15px] leading-relaxed ${
                    m.role === "user"
                      ? "bg-[#007AFF] text-white shadow-md"
                      : "bg-[#F2F2F7] text-black"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-[10px] text-gray-400 italic animate-pulse">
                Analyse en cours...
              </div>
            )}
          </div>

          {/* Input flottant épuré */}
          <div className="absolute bottom-10 left-8 right-8">
            <div className="bg-[#F2F2F7] rounded-2xl flex items-center px-6 py-4 shadow-inner border border-gray-100">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="bg-transparent flex-1 outline-none text-[15px] text-gray-800"
                placeholder="Écrivez votre message..."
              />
              <button
                onClick={handleSend}
                className="ml-4 text-[#007AFF] hover:scale-110 transition-transform"
              >
                <svg
                  width="22"
                  height="22"
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

      {/* SECTION QUALIFICATION (Droite) */}
      <div className="w-full lg:flex-1 flex flex-col">
        <h2 className="text-2xl font-serif tracking-tight mb-8 text-black border-b border-black pb-4">
          QUALIFICATION
        </h2>
        <div className="bg-white rounded-[40px] shadow-sm p-10 h-[700px] flex flex-col space-y-12">
          <div className="space-y-3">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Mandant
            </p>
            <div className="flex justify-between items-end border-b border-gray-50 pb-3">
              <span className="text-lg font-medium tracking-tight text-gray-900">
                {clientData.name}
              </span>
              <span className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">
                Identité
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Capacité financière
            </p>
            <div className="flex justify-between items-end border-b border-gray-50 pb-3">
              <span className="text-lg font-medium tracking-tight text-gray-900">
                {clientData.budget}
              </span>
              <span className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">
                Solvabilité
              </span>
            </div>
          </div>

          <div className="pt-10 flex-1">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">
              Verdict Dossier
            </p>
            <div className="flex justify-between items-center">
              <span
                className={`text-2xl font-bold italic tracking-tighter transition-colors duration-500 ${
                  clientData.project === "RECEVABLE"
                    ? "text-green-500"
                    : clientData.project === "NON RECEVABLE"
                    ? "text-red-500"
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

          <div className="mt-auto py-6 border-t border-gray-50">
            <p className="text-[9px] text-center text-gray-300 uppercase tracking-widest font-medium">
              Maison Trille — Système de Vetting Certifié
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
