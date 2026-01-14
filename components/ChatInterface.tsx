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

  // Scroll automatique vers le bas à chaque nouveau message
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
        body: JSON.stringify({
          message: input,
          history: messages, // Envoi de l'historique complet
        }),
      });

      const data = await response.json();
      console.log("Réponse reçue de l'IA:", data);

      if (data && data.text) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.text },
        ]);
        if (data.analysis) {
          setClientData(data.analysis);
        }
      } else {
        throw new Error("Format de réponse invalide");
      }
    } catch (error) {
      console.error("Erreur de vetting:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Je rencontre une difficulté pour traiter votre demande. Veuillez reformuler.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full p-4 lg:p-12 gap-8 items-start justify-center max-w-[1600px] mx-auto bg-[#F5F5F7]">
      {/* SECTION VETTING (Chat) */}
      <div className="w-full lg:flex-[2] flex flex-col h-[85vh] lg:h-[800px]">
        <h1 className="text-4xl lg:text-5xl font-serif mb-6 tracking-tighter text-black">
          VETTING
        </h1>
        <div className="bg-white rounded-[32px] lg:rounded-[40px] shadow-sm flex flex-col flex-1 p-6 lg:p-10 relative overflow-hidden border border-gray-100">
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto space-y-6 mb-20 pr-2 custom-scrollbar"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-4 px-6 rounded-[22px] max-w-[85%] text-[14px] lg:text-[15px] leading-relaxed shadow-sm transition-all ${
                    m.role === "user"
                      ? "bg-[#007AFF] text-white rounded-tr-none"
                      : "bg-[#F2F2F7] text-[#1d1d1f] rounded-tl-none"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#F2F2F7] p-4 rounded-[22px] rounded-tl-none">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-10">
            <div className="bg-[#F2F2F7] rounded-2xl flex items-center px-4 lg:px-6 py-3 lg:py-4 border border-gray-200 focus-within:bg-white focus-within:shadow-md transition-all">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="bg-transparent flex-1 outline-none text-sm text-gray-800"
                placeholder="Écrivez votre message..."
              />
              <button onClick={handleSend} className="ml-4 text-[#007AFF] p-1">
                <svg
                  width="24"
                  height="24"
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
      </div>

      {/* SECTION QUALIFICATION (Fiche) */}
      <div className="w-full lg:flex-1 flex flex-col h-auto lg:h-[800px]">
        <h2 className="text-2xl font-serif tracking-tight mb-6 text-black border-b border-black pb-2">
          QUALIFICATION
        </h2>
        <div className="bg-white rounded-[32px] lg:rounded-[40px] shadow-sm p-8 lg:p-10 flex flex-col space-y-12 flex-1 border border-gray-100">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Mandant
            </p>
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <span className="text-lg font-medium text-gray-900">
                {clientData.name}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Capacité financière
            </p>
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <span className="text-lg font-medium text-gray-900">
                {clientData.budget}
              </span>
            </div>
          </div>

          <div className="pt-8">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              Verdict Dossier
            </p>
            <div className="flex justify-between items-center">
              <span
                className={`text-2xl font-bold italic tracking-tighter ${
                  clientData.project === "RECEVABLE"
                    ? "text-green-500"
                    : clientData.project === "NON RECEVABLE"
                    ? "text-red-500"
                    : "text-gray-900"
                }`}
              >
                {clientData.project}
              </span>
              <span className="text-[9px] text-gray-300 italic uppercase">
                Statut IA
              </span>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-gray-50 text-center">
            <p className="text-[9px] text-gray-300 uppercase tracking-[0.2em]">
              Maison Trille — Off-Market Vetting
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
