"use client";
import React, { useState, useEffect, useRef } from "react";

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Bienvenue chez Maison Trille. Décrivez-moi l'envergure de votre vision.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false); // État pour l'animation dorée
  const [clientData, setClientData] = useState({
    name: "-",
    budget: "-",
    project: "-",
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
    setIsAnalyzing(true); // Active l'effet de vetting

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
        // Simulation d'un temps de traitement "humain" pour le luxe
        setTimeout(() => {
          setClientData(data.analysis);
          setIsAnalyzing(false); // Désactive l'effet une fois la fiche mise à jour
        }, 1200);
      } else {
        setIsAnalyzing(false);
      }
    } catch (error) {
      console.error("Erreur de vetting", error);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-[#F5F5F5] font-light">
      {/* Zone de Chat */}
      <div className="flex-1 flex flex-col border-r border-white/5">
        <header className="p-10 flex justify-between items-center">
          <h1 className="text-xl tracking-[0.5em] uppercase font-serif text-[#D4AF37]">
            Maison Trille
          </h1>
          {isAnalyzing && (
            <div className="text-[9px] tracking-[0.2em] text-[#D4AF37] italic animate-pulse">
              VETTING EN COURS...
            </div>
          )}
        </header>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-10 space-y-12 pb-10"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xl text-[13px] tracking-wide leading-relaxed ${
                  m.role === "user"
                    ? "text-white/30 italic"
                    : "text-white border-l border-[#D4AF37]/40 pl-6"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        <div className="p-10">
          {/* Ligne de chargement dorée minimaliste */}
          <div className="h-[1px] w-full bg-white/5 relative overflow-hidden mb-4">
            {isAnalyzing && <div className="gold-loader"></div>}
          </div>

          <div className="relative border-b border-white/10 focus-within:border-[#D4AF37] transition-all duration-700">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="VOTRE VISION..."
              className="w-full bg-transparent py-4 text-[10px] tracking-[0.3em] uppercase focus:outline-none placeholder:text-white/5"
            />
          </div>
        </div>
      </div>

      {/* Fiche de Qualification Confidentielle */}
      <div className="w-96 bg-[#080808] p-12 flex flex-col justify-between">
        <section>
          <h2 className="text-[9px] tracking-[0.5em] text-white/20 uppercase mb-20">
            Qualification de Haut Vol
          </h2>
          <div className="space-y-16">
            {[
              { label: "Mandant", value: clientData.name },
              { label: "Fonds Estimés", value: clientData.budget },
              { label: "Nature du Projet", value: clientData.project },
            ].map((d, idx) => (
              <div key={idx} className="relative group">
                <p className="text-[8px] tracking-[0.3em] text-[#D4AF37]/60 uppercase mb-3">
                  {d.label}
                </p>
                <p className="text-[13px] tracking-[0.15em] text-white font-normal uppercase transition-all duration-500 group-hover:pl-2">
                  {d.value}
                </p>
                <div
                  className={`absolute -left-4 top-0 h-full w-[1px] bg-[#D4AF37]/0 transition-all duration-500 ${
                    isAnalyzing ? "bg-[#D4AF37]/50" : ""
                  }`}
                ></div>
              </div>
            ))}
          </div>
        </section>

        <footer className="text-[8px] tracking-[0.2em] text-white/10 uppercase italic">
          Document strictement confidentiel - Maison Trille © 2026
        </footer>
      </div>
    </div>
  );
}
