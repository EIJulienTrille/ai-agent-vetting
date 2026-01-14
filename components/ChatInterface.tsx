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
    <div className="flex flex-col lg:flex-row min-h-screen w-full p-6 lg:p-16 gap-12 items-stretch justify-center max-w-[1600px] mx-auto bg-[#F5F5F7]">
      {/* SECTION VETTING : BLOC GAUCHE */}
      <div className="flex-[2] flex flex-col min-h-[700px]">
        <h1 className="text-5xl font-serif tracking-tighter mb-8 text-black uppercase">
          VETTING
        </h1>
        <div className="bg-white rounded-[40px] shadow-sm flex flex-col flex-1 relative overflow-hidden border border-gray-100">
          {/* Zone de chat avec marges intérieures importantes */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-12 space-y-8 custom-scrollbar pb-32"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-5 px-8 rounded-[24px] max-w-[80%] text-[15px] leading-relaxed ${
                    m.role === "user"
                      ? "bg-[#007AFF] text-white shadow-sm"
                      : "bg-[#F2F2F7] text-[#1d1d1f]"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-[10px] text-gray-300 italic ml-2">
                Maison Trille traite votre dossier...
              </div>
            )}
          </div>

          {/* BARRE DE SAISIE : Toute la largeur, en bas du bloc */}
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-white border-t border-gray-50">
            <div className="flex items-center bg-[#F2F2F7] rounded-2xl px-6 py-5">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="bg-transparent flex-1 outline-none text-sm text-gray-800 placeholder:text-gray-400"
                placeholder="Écrivez votre message..."
              />
              <button onClick={handleSend} className="ml-4 text-[#007AFF]">
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

      {/* SECTION QUALIFICATION : BLOC DROIT */}
      <div className="flex-1 flex flex-col min-h-[700px]">
        <h2 className="text-2xl font-serif tracking-tight mb-8 text-black border-b border-black pb-4 uppercase">
          QUALIFICATION
        </h2>
        <div className="bg-white rounded-[40px] shadow-sm p-12 flex flex-col space-y-16 flex-1 border border-gray-100">
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">
              Mandant
            </p>
            <div className="border-b border-gray-50 pb-3 flex justify-between">
              <span className="text-lg font-medium">{clientData.name}</span>
              <span className="text-[9px] text-gray-200">EN COURS</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">
              Capacité financière
            </p>
            <div className="border-b border-gray-50 pb-3 flex justify-between">
              <span className="text-lg font-medium">{clientData.budget}</span>
              <span className="text-[9px] text-gray-200">À VÉRIFIER</span>
            </div>
          </div>

          <div className="pt-10">
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em] mb-4">
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
              <span className="text-[9px] text-gray-200 italic tracking-tighter">
                RECEVABLE = CONTACT
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
