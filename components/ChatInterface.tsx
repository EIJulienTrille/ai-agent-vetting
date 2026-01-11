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

    // Appel à ton API existante
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
      console.error("Erreur de vetting", error);
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-[#F5F5F5] font-light italic_prevent">
      {/* Zone de Chat : Minimalisme Absolu */}
      <div className="flex-1 flex flex-col border-r border-white/5">
        <header className="p-10">
          <h1 className="text-xl tracking-[0.5em] uppercase font-serif text-[#D4AF37]">
            Maison Trille
          </h1>
        </header>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-10 space-y-12"
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
                    ? "text-white/40"
                    : "text-white border-l border-[#D4AF37]/50 pl-6"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        <div className="p-10">
          <div className="relative border-b border-white/10 focus-within:border-[#D4AF37] transition-all duration-700">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="VOTRE MESSAGE..."
              className="w-full bg-transparent py-4 text-[11px] tracking-[0.2em] uppercase focus:outline-none placeholder:text-white/5"
            />
          </div>
        </div>
      </div>

      {/* Qualification : Fiche de Luxe */}
      <div className="w-96 bg-[#080808] p-10 flex flex-col space-y-16">
        <section>
          <h2 className="text-[10px] tracking-[0.4em] text-white/20 uppercase mb-12">
            Dossier de Qualification
          </h2>
          <div className="space-y-12">
            {[
              { label: "Mandant", value: clientData.name },
              { label: "Capacité financière", value: clientData.budget },
              { label: "Nature du projet", value: clientData.project },
            ].map((d, idx) => (
              <div key={idx} className="group">
                <p className="text-[9px] tracking-[0.2em] text-[#D4AF37]/50 uppercase mb-2">
                  {d.label}
                </p>
                <p className="text-sm tracking-widest text-white/80 group-hover:text-white transition-colors uppercase">
                  {d.value}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
